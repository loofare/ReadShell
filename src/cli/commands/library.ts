/**
 * novel library — 书架列表
 * 含最近阅读排序 + 搜索
 */

import type { CommandModule } from 'yargs';
import { BookService } from '../../services/BookService.js';
import { RecentService } from '../../services/RecentService.js';
import { logger } from '../../utils/logger.js';

interface LibraryArgs {
  search?: string;
}

export const libraryCommand: CommandModule<object, LibraryArgs> = {
  command: 'library',
  describe: '查看书架列表',
  builder: (yargs) => {
    return yargs.option('search', {
      alias: 's',
      describe: '搜索书名',
      type: 'string',
    });
  },
  handler: async (argv) => {
    try {
      const bookService = new BookService();
      const recentService = new RecentService();

      const books = argv.search
        ? bookService.searchBooks(argv.search)
        : recentService.getRecentBooks();

      if (books.length === 0) {
        console.log('📚 书架为空。使用 novel import <file> 导入你的第一本书。');
        return;
      }

      // TODO: 启动 Ink TUI 书架页面
      console.log('📚 书架:');
      books.forEach((book, index) => {
        console.log(`  ${index + 1}. ${book.title} (${book.id})`);
      });
    } catch (error) {
      logger.error('获取书架失败:', error);
      process.exit(1);
    }
  },
};
