/**
 * novel stats — 阅读统计
 * GitHub 风格热力图（近一年）+ 总量：阅读天数、总时长、书籍数、连续天数
 */

import type { CommandModule } from 'yargs';
import { t } from '../../locales/index.js';
import { getConfig } from '../../config/AppConfig.js';
import { ReadingSessionModel } from '../../db/models/ReadingSession.js';
import { aggregateSessions, renderHeatmap, renderLegend } from '../../services/StatsService.js';

export const statsCommand: CommandModule = {
  command: 'stats',
  describe: t('cli.stats.desc'),
  handler: () => {
    const sessions = new ReadingSessionModel().findAll();
    const stats = aggregateSessions(sessions);
    const lang = getConfig().language;

    const width = process.stdout.columns ?? 80;
    const color = Boolean(process.stdout.isTTY);
    const dayLabels: [string, string, string] = lang === 'en' ? ['Mon', 'Wed', 'Fri'] : ['一', '三', '五'];

    console.log(t('cli.stats.title'));
    console.log('');
    console.log(renderHeatmap(stats.minutesByDay, { width, dayLabels, color }));
    console.log('');
    console.log(renderLegend(t('cli.stats.less'), t('cli.stats.more'), color));
    console.log('');
    console.log(t('cli.stats.summary',
      String(stats.readingDays),
      String(stats.totalMinutes),
      String(stats.booksRead),
      String(stats.currentStreak),
      String(stats.longestStreak),
    ));
  },
};
