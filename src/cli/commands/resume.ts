/**
 * novel resume — 恢复上次阅读
 * 启动后默认入口，精确恢复到上次 offset，零摩擦
 */

import type { CommandModule } from 'yargs';
import { ProgressService } from '../../services/ProgressService.js';
import { BookService } from '../../services/BookService.js';
import { renderApp } from '../../ui/renderApp.js';
import { logger } from '../../utils/logger.js';

export const resumeCommand: CommandModule = {
  command: 'resume',
  describe: '恢复上次阅读',
  handler: async () => {
    try {
      const progressService = new ProgressService();
      const lastProgress = progressService.getLastOpenedBook();

      if (!lastProgress) {
        console.log('📚 还没有阅读记录。使用 novel import <file> 导入一本书开始阅读。');
        return;
      }

      // 验证书籍仍然存在
      const bookService = new BookService();
      const book = bookService.findBook(lastProgress.book_id);
      if (!book) {
        console.log('📚 上次阅读的书籍已被删除。使用 novel library 查看书架。');
        return;
      }

      logger.debug(`恢复阅读: ${book.title}, offset=${lastProgress.byte_offset}`);

      // 启动 Ink TUI 阅读器，恢复到上次 offset
      renderApp({
        initialPage: 'reader',
        bookId: lastProgress.book_id,
        initialByteOffset: lastProgress.byte_offset,
      });
    } catch (error) {
      logger.error('恢复阅读失败:', error);
      process.exit(1);
    }
  },
};
