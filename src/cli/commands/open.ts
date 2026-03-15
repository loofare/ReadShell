/**
 * novel open <id|name> — 打开指定书
 * 支持 book-id 或模糊匹配书名
 */

import type { CommandModule } from 'yargs';
import { BookService } from '../../services/BookService.js';
import { ProgressService } from '../../services/ProgressService.js';
import { renderApp } from '../../ui/renderApp.js';
import { logger } from '../../utils/logger.js';
import { t } from '../../locales/index.js';

export interface OpenArgs {
  target: string;
}

export const openCommand: CommandModule<object, OpenArgs> = {
  command: 'open <target>',
  describe: t('cli.open.desc'),
  builder: (yargs) => {
    return yargs.positional('target', {
      describe: t('cli.open.help'),
      type: 'string',
      demandOption: true,
    });
  },
  handler: async (argv) => {
    try {
      const bookService = new BookService();
      const book = bookService.findBook(argv.target);

      if (!book) {
        console.log(`${t('cli.open.not_found')} ${argv.target}`);
        process.exit(1);
      }

      // 检查是否有之前的阅读进度
      const progressService = new ProgressService();
      const progress = progressService.getProgress(book.id);
      const byteOffset = progress?.byte_offset ?? 0;

      logger.debug(`打开: ${book.title}, offset=${byteOffset}`);

      // 启动 Ink TUI 阅读器
      renderApp({
        initialPage: 'reader',
        bookId: book.id,
        initialByteOffset: byteOffset,
      });
    } catch (error) {
      logger.error('打开失败:', error);
      process.exit(1);
    }
  },
};
