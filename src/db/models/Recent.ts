/**
 * recent_reads 表数据操作
 */

import { getDb } from '../client.js';

export interface RecentRecord {
  book_id: string;
  opened_at: number;
  open_count: number;
}

export class RecentModel {
  /**
   * 记录打开（插入或更新计数）
   */
  recordOpen(bookId: string): void {
    const db = getDb();
    const now = Date.now();
    db.prepare(`
      INSERT INTO recent_reads (book_id, opened_at, open_count)
      VALUES (?, ?, 1)
      ON CONFLICT(book_id) DO UPDATE SET
        opened_at = excluded.opened_at,
        open_count = open_count + 1
    `).run(bookId, now);
  }

  /**
   * 获取最近阅读列表（按时间倒序）
   */
  getRecent(limit: number = 20): RecentRecord[] {
    const db = getDb();
    return db.prepare('SELECT * FROM recent_reads ORDER BY opened_at DESC LIMIT ?').all(limit) as RecentRecord[];
  }

  /**
   * 删除记录
   */
  delete(bookId: string): void {
    const db = getDb();
    db.prepare('DELETE FROM recent_reads WHERE book_id = ?').run(bookId);
  }
}
