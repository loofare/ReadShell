/**
 * StatsService 聚合与热力图单元测试
 * 覆盖：跨天连续统计、总量聚合、宽度自适应
 */

import { describe, it, expect } from 'vitest';
import { aggregateSessions, renderHeatmap } from '../../../src/services/StatsService.js';

function session(bookId: string, startedAt: number, minutes: number) {
  return { book_id: bookId, started_at: startedAt, ended_at: startedAt + minutes * 60000 };
}

// 本地时区构造日期，避免 UTC 偏移影响 dayKey
function at(y: number, m: number, d: number, h = 12): number {
  return new Date(y, m - 1, d, h).getTime();
}

describe('aggregateSessions', () => {
  it('聚合天数/总时长/书籍数', () => {
    const stats = aggregateSessions([
      session('a', at(2026, 9, 20), 30),
      session('a', at(2026, 9, 20), 15),
      session('b', at(2026, 9, 21), 45),
    ], new Date(2026, 8, 23));

    expect(stats.readingDays).toBe(2);
    expect(stats.totalMinutes).toBe(90);
    expect(stats.booksRead).toBe(2);
  });

  it('跨天（含跨月）连续阅读正确计算 current/longest streak', () => {
    // 9/30 → 10/1 → 10/2 连续三天，"今天"是 10/2
    const stats = aggregateSessions([
      session('a', at(2026, 9, 30, 23), 20),
      session('a', at(2026, 10, 1), 20),
      session('a', at(2026, 10, 2), 20),
    ], new Date(2026, 9, 2, 18));

    expect(stats.currentStreak).toBe(3);
    expect(stats.longestStreak).toBe(3);
  });

  it('断签后 current streak 归零，longest 保留历史', () => {
    const stats = aggregateSessions([
      session('a', at(2026, 9, 1), 20),
      session('a', at(2026, 9, 2), 20),
      session('a', at(2026, 9, 3), 20),
      // 9/4 断
      session('a', at(2026, 9, 5), 20),
    ], new Date(2026, 9, 10));

    expect(stats.currentStreak).toBe(0);
    expect(stats.longestStreak).toBe(3);
  });

  it('昨天读过今天还没读：current streak 不算断', () => {
    const stats = aggregateSessions([
      session('a', at(2026, 9, 8), 20),
      session('a', at(2026, 9, 9), 20),
    ], new Date(2026, 8, 10, 8));

    expect(stats.currentStreak).toBe(2);
  });
});

describe('renderHeatmap', () => {
  const days: [string, string, string] = ['Mon', 'Wed', 'Fri'];

  it('输出 7 行（周一到周日）', () => {
    const out = renderHeatmap(new Map(), { width: 120, dayLabels: days, color: false });
    expect(out.split('\n')).toHaveLength(7);
  });

  it('窄终端自动减少周数', () => {
    const wide = renderHeatmap(new Map(), { width: 120, dayLabels: days, color: false });
    const narrow = renderHeatmap(new Map(), { width: 30, dayLabels: days, color: false });
    const wideCols = wide.split('\n')[0]!.length;
    const narrowCols = narrow.split('\n')[0]!.length;
    expect(narrowCols).toBeLessThan(wideCols);
    expect(narrowCols).toBeLessThanOrEqual(30);
  });

  it('有阅读记录的格子渲染为高强度字符', () => {
    const now = new Date(2026, 8, 23, 12);
    const minutes = new Map([['2026-09-23', 90]]);
    const out = renderHeatmap(minutes, { width: 120, dayLabels: days, color: false, now });
    expect(out).toContain('█');
  });
});
