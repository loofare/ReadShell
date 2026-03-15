/**
 * novel library — 书架列表
 * 含最近阅读排序 + 搜索
 */

import type { CommandModule } from 'yargs';
import { renderApp } from '../../ui/renderApp.js';
import { BookService } from '../../services/BookService.js';
import { logger } from '../../utils/logger.js';
import { t } from '../../locales/index.js';

export interface LibraryArgs {
  search?: string;
}

export const libraryCommand: CommandModule<object, LibraryArgs> = {
  command: 'library',
  describe: t('cli.library.desc'),
  builder: (yargs) => {
    return yargs.option('search', {
      alias: 's',
      describe: t('cli.library.help'),
      type: 'string',
    });
  },
  handler: async (argv) => {
    try {
      // 如果有搜索参数，以非交互模式输出
      if (argv.search) {
        const bookService = new BookService();
        const books = bookService.searchBooks(argv.search);

        if (books.length === 0) {
          console.log(t('cli.library.search_none', argv.search));
          return;
        }

        console.log(t('cli.library.search_result', books.length));
        books.forEach((book, index) => {
          console.log(`  ${index + 1}. ${book.title}  [${book.id}]  (${book.format})`);
        });
        return;
      }

      // 无搜索参数，启动交互式书架
      renderApp({ initialPage: 'library' });
    } catch (error) {
      logger.error('获取书架失败:', error);
      process.exit(1);
    }
  },
};
