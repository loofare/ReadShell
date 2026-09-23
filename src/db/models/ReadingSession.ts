/**
 * reading_sessions 表数据操作
 */

import { getDb } from '../client.js';

export interface ReadingSessionRecord {
  id: string;
  book_id: string;
  started_at: number;
  ended_at: number;
  bytes_read: number;
}

export class ReadingSessionModel {
  /**
   * 记录一次阅读会话
   */
  insert(session: ReadingSessionRecord): void {
    const db = getDb();
    db.prepare(`
      INSERT INTO reading_sessions (id, book_id, started_at, ended_at, bytes_read)
      VALUES (?, ?, ?, ?, ?)
    `).run(session.id, session.book_id, session.started_at, session.ended_at, session.bytes_read);
  }

  /**
   * 按 id 合并远端会话（已存在则跳过）
   */
  insertIfAbsent(session: ReadingSessionRecord): boolean {
    const db = getDb();
    const result = db.prepare(`
      INSERT OR IGNORE INTO reading_sessions (id, book_id, started_at, ended_at, bytes_read)
      VALUES (?, ?, ?, ?, ?)
    `).run(session.id, session.book_id, session.started_at, session.ended_at, session.bytes_read);
    return result.changes > 0;
  }

  /**
   * 获取指定书籍的全部会话
   */
  findByBookId(bookId: string): ReadingSessionRecord[] {
    const db = getDb();
    return db.prepare('SELECT * FROM reading_sessions WHERE book_id = ? ORDER BY started_at ASC').all(bookId) as ReadingSessionRecord[];
  }

  /**
   * 获取全部会话（统计与同步导出用）
   */
  findAll(): ReadingSessionRecord[] {
    const db = getDb();
    return db.prepare('SELECT * FROM reading_sessions ORDER BY started_at ASC').all() as ReadingSessionRecord[];
  }

  /**
   * 删除指定书籍的全部会话（配合彻底清理书籍使用）
   */
  deleteByBookId(bookId: string): void {
    const db = getDb();
    db.prepare('DELETE FROM reading_sessions WHERE book_id = ?').run(bookId);
  }
}
