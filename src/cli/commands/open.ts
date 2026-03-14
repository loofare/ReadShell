/**
 * novel open <id|name> — 打开指定书
 * 支持 book-id 或模糊匹配书名
 */

import type { CommandModule } from 'yargs';
import { BookService } from '../../services/BookService.js';
import { logger } from '../../utils/logger.js';

interface OpenArgs {
  target: string;
}

export const openCommand: CommandModule<object, OpenArgs> = {
  command: 'open <target>',
  describe: '打开指定书籍（ID 或书名）',
  builder: (yargs) => {
    return yargs.positional('target', {
      describe: '书籍 ID 或书名（支持模糊匹配）',
      type: 'string',
      demandOption: true,
    });
  },
  handler: async (argv) => {
    try {
      const bookService = new BookService();
      const book = bookService.findBook(argv.target);

      if (!book) {
        console.log(`✗ 未找到书籍: ${argv.target}`);
        process.exit(1);
      }

      // TODO: 启动 Ink TUI 阅读器
      console.log(`📖 打开: ${book.title}`);
    } catch (error) {
      logger.error('打开失败:', error);
      process.exit(1);
    }
  },
};
