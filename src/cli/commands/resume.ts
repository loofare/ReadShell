/**
 * novel resume — 恢复上次阅读
 * 启动后默认入口，精确恢复到上次 offset，零摩擦
 */

import type { CommandModule } from 'yargs';
import { ProgressService } from '../../services/ProgressService.js';
import { logger } from '../../utils/logger.js';

export const resumeCommand: CommandModule = {
  command: 'resume',
  describe: '恢复上次阅读',
  handler: async () => {
    try {
      const progressService = new ProgressService();
      const lastBook = progressService.getLastOpenedBook();

      if (!lastBook) {
        console.log('📚 还没有阅读记录。使用 novel import <file> 导入一本书开始阅读。');
        return;
      }

      // TODO: 启动 Ink TUI 阅读器，恢复到上次 offset
      console.log(`📖 恢复阅读: ${lastBook.book_id}`);
    } catch (error) {
      logger.error('恢复阅读失败:', error);
      process.exit(1);
    }
  },
};
