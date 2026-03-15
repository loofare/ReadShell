/**
 * novel remove <id|name> — 移除书籍
 * 删除相关所有数据，包括记录和本地进度的 DB 项
 */

import type { CommandModule } from 'yargs';
import { BookService } from '../../services/BookService.js';
import { logger } from '../../utils/logger.js';
import { t } from '../../locales/index.js';

export interface RemoveArgs {
  target: string;
}

export const removeCommand: CommandModule<object, RemoveArgs> = {
  command: 'remove <target>',
  describe: t('cli.remove.desc'),
  builder: (yargs) => {
    return yargs.positional('target', {
      describe: t('cli.remove.help'),
      type: 'string',
      demandOption: true,
    });
  },
  handler: async (argv) => {
    try {
      const bookService = new BookService();
      const book = bookService.findBook(argv.target);

      if (!book) {
        console.log(`${t('cli.remove.not_found')} ${argv.target}`);
        process.exit(1);
      }

      bookService.deleteBook(book.id);
      console.log(`${t('cli.remove.success')} ${book.title}`);
    } catch (error) {
      logger.error('移除书籍失败:', error);
      process.exit(1);
    }
  },
};
