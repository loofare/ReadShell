/**
 * novel import <file> — 导入本地文件
 * 支持 txt，基础去重，导入后自动入书架
 */

import type { CommandModule } from 'yargs';
import { BookService } from '../../services/BookService.js';
import { logger } from '../../utils/logger.js';

export interface ImportArgs {
  file: string;
}

export const importCommand: CommandModule<object, ImportArgs> = {
  command: 'import <file>',
  describe: '导入本地文件到书架',
  builder: (yargs) => {
    return yargs.positional('file', {
      describe: '文件路径（支持 .txt / .epub）',
      type: 'string',
      demandOption: true,
    });
  },
  handler: async (argv) => {
    try {
      const bookService = new BookService();
      const book = await bookService.importBook(argv.file);
      console.log(`✓ 已导入: ${book.title} (${book.id})`);
    } catch (error) {
      logger.error('导入失败:', error);
      process.exit(1);
    }
  },
};
