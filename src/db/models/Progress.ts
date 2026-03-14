/**
 * reading_progress 表数据操作
 */

import { getDb } from '../client.js';

export interface ProgressRecord {
  book_id: string;
  chapter_no: number;
  byte_offset: number;
  percent: number;
  updated_at: number;
  opened_at: number;
}

export class ProgressModel {
  /**
   * 保存或更新阅读进度
   */
  upsert(progress: ProgressRecord): void {
    const db = getDb();
    db.prepare(`
      INSERT INTO reading_progress (book_id, chapter_no, byte_offset, percent, updated_at, opened_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(book_id) DO UPDATE SET
        chapter_no = excluded.chapter_no,
        byte_offset = excluded.byte_offset,
        percent = excluded.percent,
        updated_at = excluded.updated_at,
        opened_at = excluded.opened_at
    `).run(progress.book_id, progress.chapter_no, progress.byte_offset, progress.percent, progress.updated_at, progress.opened_at);
  }

  /**
   * 获取指定书籍的阅读进度
   */
  findByBookId(bookId: string): ProgressRecord | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM reading_progress WHERE book_id = ?').get(bookId) as ProgressRecord | undefined;
  }

  /**
   * 获取最近打开的书籍进度（用于 resume）
   */
  getLastOpened(): ProgressRecord | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM reading_progress ORDER BY opened_at DESC LIMIT 1').get() as ProgressRecord | undefined;
  }

  /**
   * 删除指定书籍的进度
   */
  delete(bookId: string): void {
    const db = getDb();
    db.prepare('DELETE FROM reading_progress WHERE book_id = ?').run(bookId);
  }
}
