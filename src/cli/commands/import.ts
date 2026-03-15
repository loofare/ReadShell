/**
 * novel import <file> — 导入本地文件
 * 支持 txt，基础去重，导入后自动入书架
 */

import type { CommandModule } from 'yargs';
import { BookService } from '../../services/BookService.js';
import { logger } from '../../utils/logger.js';
import { t } from '../../locales/index.js';
import { statSync, readdirSync } from 'node:fs';
import { resolve, join, extname } from 'node:path';
import * as readline from 'node:readline/promises';

export interface ImportArgs {
  file: string;
}

// 递归扫描目录文件
function scanDirectory(dir: string): string[] {
  let results: string[] = [];
  try {
    const list = readdirSync(dir);
    for (const file of list) {
      const fullPath = join(dir, file);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        results = results.concat(scanDirectory(fullPath));
      } else {
        const ext = extname(fullPath).toLowerCase();
        if (ext === '.txt' || ext === '.epub') {
          results.push(fullPath);
        }
      }
    }
  } catch (err) {
    logger.error('Scan error:', err);
  }
  return results;
}

export const importCommand: CommandModule<object, ImportArgs> = {
  command: 'import <file>',
  describe: t('cli.import.desc'),
  builder: (yargs) => {
    return yargs.positional('file', {
      describe: t('cli.import.help'),
      type: 'string',
      demandOption: true,
    });
  },
  handler: async (argv) => {
    try {
      const targetPath = resolve(argv.file);
      let stat;
      try {
        stat = statSync(targetPath);
      } catch (e) {
        console.log(`${t('cli.import.not_found')} ${targetPath}`);
        process.exit(1);
      }

      const bookService = new BookService();

      if (stat.isDirectory()) {
        console.log(`${t('cli.import.scan_dir')} ${targetPath}...`);
        const files = scanDirectory(targetPath);

        if (files.length === 0) {
          console.log(`✗ ` + t('cli.import.unsupported'));
          return;
        }

        console.log(t('cli.import.found_files'));
        files.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));

        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        const answer = await rl.question(t('cli.import.confirm_batch', files.length) + ' ');
        rl.close();

        if (answer.toLowerCase() === 'y') {
          for (const file of files) {
            try {
              const book = await bookService.importBook(file);
              console.log(`${t('cli.import.success')} ${book.title} (${book.id})`);
            } catch (err) {
              console.log(`${t('cli.import.fail')} ${file} - ${err}`);
            }
          }
        } else {
          console.log(t('cli.import.canceled'));
        }
      } else {
        // 单文件导入
        const book = await bookService.importBook(argv.file);
        console.log(`${t('cli.import.success')} ${book.title} (${book.id})`);
      }
    } catch (error) {
      console.log(`${t('cli.import.fail')} ${error}`);
      process.exit(1);
    }
  },
};
