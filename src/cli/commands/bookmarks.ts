/**
 * novel bookmarks export — 导出全部书签
 * 按书籍分组，支持 json / md 两种格式
 */

import type { CommandModule } from 'yargs';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { t } from '../../locales/index.js';
import { BookModel, type BookRecord } from '../../db/models/Book.js';
import { BookmarkModel, type BookmarkRecord } from '../../db/models/Bookmark.js';

interface ExportArgs {
  format?: string;
  out?: string;
}

interface ExportEntry {
  label: string;
  byteOffset: number;
  percent: number | null;
  createdAt: string;
}

interface ExportGroup {
  title: string;
  author: string | null;
  format: string;
  bookmarks: ExportEntry[];
}

/**
 * 计算书签在书中的大致位置（0-1），无法估算时返回 null
 */
function bookmarkPercent(book: BookRecord, b: BookmarkRecord): number | null {
  if (!book.file_size || book.file_size <= 0) return null;
  return Math.min(1, Math.max(0, b.byte_offset / book.file_size));
}

function collectGroups(): ExportGroup[] {
  const bookModel = new BookModel();
  const bookmarkModel = new BookmarkModel();
  const groups: ExportGroup[] = [];

  for (const book of bookModel.findAll()) {
    const bookmarks = bookmarkModel.findByBookId(book.id);
    if (bookmarks.length === 0) continue;

    groups.push({
      title: book.title,
      author: book.author,
      format: book.format,
      bookmarks: bookmarks.map((b) => ({
        label: b.title,
        byteOffset: b.byte_offset,
        percent: bookmarkPercent(book, b),
        createdAt: new Date(b.created_at).toISOString(),
      })),
    });
  }

  return groups;
}

function toMarkdown(groups: ExportGroup[]): string {
  const lines: string[] = ['# ReadShell Bookmarks', ''];
  for (const g of groups) {
    lines.push(`## ${g.title}${g.author ? ` — ${g.author}` : ''}`, '');
    for (const b of g.bookmarks) {
      const pct = b.percent !== null ? ` (${(b.percent * 100).toFixed(1)}%)` : '';
      lines.push(`- ${b.label} — offset ${b.byteOffset}${pct} — ${b.createdAt}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

export const bookmarksCommand: CommandModule = {
  command: 'bookmarks',
  describe: t('cli.bookmarks.desc'),
  builder: (yargs) =>
    yargs.command({
      command: 'export',
      describe: t('cli.bookmarks.export.desc'),
      builder: (yy) =>
        yy
          .option('format', {
            describe: t('cli.bookmarks.export.format'),
            type: 'string',
            choices: ['json', 'md'] as const,
            default: 'md' as const,
          })
          .option('out', {
            describe: t('cli.bookmarks.export.out'),
            type: 'string',
          }),
      handler: async (argv) => {
        const args = argv as unknown as ExportArgs;
        try {
          const groups = collectGroups();
          const total = groups.reduce((n, g) => n + g.bookmarks.length, 0);
          if (total === 0) {
            console.log(t('cli.bookmarks.export.empty'));
            return;
          }

          const output = args.format === 'json'
            ? JSON.stringify(groups, null, 2)
            : toMarkdown(groups);

          if (args.out) {
            const outPath = resolve(args.out);
            writeFileSync(outPath, output + '\n', 'utf-8');
            console.log(t('cli.bookmarks.export.success', String(total), outPath));
          } else {
            console.log(output);
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          console.log(t('cli.bookmarks.export.fail', msg));
          process.exit(1);
        }
      },
    }).demandCommand(1),
  handler: () => {},
};
