/**
 * chapter_index 表数据操作
 */

import { getDb } from '../client.js';

export interface ChapterRecord {
  id?: number;
  book_id: string;
  chapter_no: number;
  title: string | null;
  byte_offset: number;
}

export class ChapterModel {
  /**
   * 批量插入章节索引
   */
  insertMany(chapters: Omit<ChapterRecord, 'id'>[]): void {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO chapter_index (book_id, chapter_no, title, byte_offset)
      VALUES (?, ?, ?, ?)
    `);

    db.transaction(() => {
      for (const chapter of chapters) {
        stmt.run(chapter.book_id, chapter.chapter_no, chapter.title, chapter.byte_offset);
      }
    })();
  }

  /**
   * 获取指定书籍的所有章节
   */
  findByBookId(bookId: string): ChapterRecord[] {
    const db = getDb();
    return db.prepare('SELECT * FROM chapter_index WHERE book_id = ? ORDER BY chapter_no').all(bookId) as ChapterRecord[];
  }

  /**
   * 获取指定章节
   */
  findChapter(bookId: string, chapterNo: number): ChapterRecord | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM chapter_index WHERE book_id = ? AND chapter_no = ?').get(bookId, chapterNo) as ChapterRecord | undefined;
  }

  /**
   * 获取书籍章节总数
   */
  getChapterCount(bookId: string): number {
    const db = getDb();
    const result = db.prepare('SELECT COUNT(*) as count FROM chapter_index WHERE book_id = ?').get(bookId) as { count: number };
    return result.count;
  }

  /**
   * 删除指定书籍的章节索引
   */
  deleteByBookId(bookId: string): void {
    const db = getDb();
    db.prepare('DELETE FROM chapter_index WHERE book_id = ?').run(bookId);
  }
}
