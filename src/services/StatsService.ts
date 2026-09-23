/**
 * 阅读统计
 * 聚合 reading_sessions（含文件夹同步合并进来的其他设备会话），
 * 输出 GitHub 风格的终端热力图 + 总量统计
 */

import type { ReadingSessionRecord } from '../db/models/ReadingSession.js';
import { getStringWidth } from '../utils/stringWidth.js';

export interface StatsSummary {
  /** 'YYYY-MM-DD' → 当日阅读分钟数 */
  minutesByDay: Map<string, number>;
  /** 有阅读记录的天数 */
  readingDays: number;
  /** 总阅读分钟数 */
  totalMinutes: number;
  /** 读过的书数量 */
  booksRead: number;
  /** 当前连续阅读天数 */
  currentStreak: number;
  /** 历史最长连续阅读天数 */
  longestStreak: number;
}

function dayKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function dayDiff(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  return Math.round((Date.UTC(by!, bm! - 1, bd!) - Date.UTC(ay!, am! - 1, ad!)) / 86400000);
}

/**
 * 聚合会话为统计摘要（纯函数，便于单测）
 * 会话时长计入开始日；跨天会话不拆分
 */
export function aggregateSessions(
  sessions: Pick<ReadingSessionRecord, 'book_id' | 'started_at' | 'ended_at'>[],
  now: Date = new Date(),
): StatsSummary {
  const minutesByDay = new Map<string, number>();
  const books = new Set<string>();
  let totalMinutes = 0;

  for (const s of sessions) {
    const minutes = Math.max(0, (s.ended_at - s.started_at) / 60000);
    if (minutes <= 0) continue;
    const key = dayKey(new Date(s.started_at));
    minutesByDay.set(key, (minutesByDay.get(key) ?? 0) + minutes);
    books.add(s.book_id);
    totalMinutes += minutes;
  }

  const days = [...minutesByDay.keys()].sort();

  // 最长连续：排序后扫描相邻差为 1 的区间
  let longestStreak = 0;
  let run = 0;
  for (let i = 0; i < days.length; i++) {
    run = i > 0 && dayDiff(days[i - 1]!, days[i]!) === 1 ? run + 1 : 1;
    longestStreak = Math.max(longestStreak, run);
  }

  // 当前连续：从今天或昨天往前数（今天还没读不算断签）
  let currentStreak = 0;
  if (days.length > 0) {
    const today = dayKey(now);
    const yesterday = dayKey(new Date(now.getTime() - 86400000));
    const last = days[days.length - 1]!;
    if (last === today || last === yesterday) {
      currentStreak = 1;
      for (let i = days.length - 2; i >= 0; i--) {
        if (dayDiff(days[i]!, days[i + 1]!) === 1) currentStreak++;
        else break;
      }
    }
  }

  return {
    minutesByDay,
    readingDays: days.length,
    totalMinutes: Math.round(totalMinutes),
    booksRead: books.size,
    currentStreak,
    longestStreak,
  };
}

// 5 级强度：0 / <15 / <30 / <60 / >=60 分钟
const LEVEL_CHARS = ['·', '░', '▒', '▓', '█'];
// GitHub 暗色绿阶（256 色）
const LEVEL_COLORS = ['38;5;238', '38;5;22', '38;5;28', '38;5;34', '38;5;40'];

function levelOf(minutes: number): number {
  if (minutes <= 0) return 0;
  if (minutes < 15) return 1;
  if (minutes < 30) return 2;
  if (minutes < 60) return 3;
  return 4;
}

export interface HeatmapOptions {
  /** 终端宽度（列数），用于自适应周数 */
  width: number;
  /** 星期标签（周一/周三/周五行），如 ['一','三','五'] 或 ['Mon','Wed','Fri'] */
  dayLabels: [string, string, string];
  /** 是否输出 ANSI 颜色（非 TTY 时用纯字符） */
  color: boolean;
  now?: Date;
}

/**
 * 渲染 GitHub 风格热力图：53 周 × 7 天，周为列、周一到周日为行。
 * 终端太窄时自动减少周数。
 */
export function renderHeatmap(minutesByDay: Map<string, number>, opts: HeatmapOptions): string {
  const now = opts.now ?? new Date();
  const labelWidth = Math.max(...opts.dayLabels.map((l) => getStringWidth(l))) + 1;
  // 每列 2 字符宽；至少显示 4 周
  const weeks = Math.max(4, Math.min(53, Math.floor((opts.width - labelWidth) / 2)));

  // 本周一作为最后一列的起点
  const dow = (now.getDay() + 6) % 7; // 周一 = 0
  const endMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dow);
  const start = new Date(endMonday.getTime() - (weeks - 1) * 7 * 86400000);
  const todayKey = dayKey(now);

  const cell = (date: Date): string => {
    const key = dayKey(date);
    if (key > todayKey) return '  ';
    const level = levelOf(minutesByDay.get(key) ?? 0);
    if (!opts.color) return `${LEVEL_CHARS[level]} `;
    return `\x1b[${LEVEL_COLORS[level]}m█\x1b[0m `;
  };

  const lines: string[] = [];
  for (let row = 0; row < 7; row++) {
    const label = row === 0 ? opts.dayLabels[0] : row === 2 ? opts.dayLabels[1] : row === 4 ? opts.dayLabels[2] : '';
    let line = label + ' '.repeat(Math.max(0, labelWidth - getStringWidth(label)));
    for (let w = 0; w < weeks; w++) {
      line += cell(new Date(start.getTime() + (w * 7 + row) * 86400000));
    }
    lines.push(line.trimEnd());
  }

  return lines.join('\n');
}

/**
 * 渲染图例：少 → 多
 */
export function renderLegend(less: string, more: string, color: boolean): string {
  const cells = LEVEL_CHARS.map((ch, i) =>
    color ? `\x1b[${LEVEL_COLORS[i]}m█\x1b[0m` : ch,
  ).join(' ');
  return `${less} ${cells} ${more}`;
}
