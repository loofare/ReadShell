/**
 * novel remove <id|name> — 移除书籍
 * 删除相关所有数据，包括记录和本地进度的 DB 项
 */

import type { CommandModule } from 'yargs';
import { BookService } from '../../services/BookService.js';
import { logger } from '../../utils/logger.js';

export interface RemoveArgs {
  target: string;
}

export const removeCommand: CommandModule<object, RemoveArgs> = {
  command: 'remove <target>',
  describe: '从书架移除书籍（仅删除记录，不删源文件）',
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
        console.log(`✗ 未找到匹配书籍: ${argv.target}`);
        process.exit(1);
      }

      bookService.deleteBook(book.id);
      console.log(`✓ 已移除书籍: ${book.title}`);
    } catch (error) {
      logger.error('移除书籍失败:', error);
      process.exit(1);
    }
  },
};
