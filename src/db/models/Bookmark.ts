/**
 * bookmarks 表数据操作
 */

import { getDb } from '../client.js';

export interface BookmarkRecord {
  id?: number;
  book_id: string;
  title: string;
  byte_offset: number;
  created_at: number;
}

export class BookmarkModel {
  /**
   * 插入书签
   */
  insert(bookmark: Omit<BookmarkRecord, 'id'>): void {
    const db = getDb();
    db.prepare(`
      INSERT INTO bookmarks (book_id, title, byte_offset, created_at)
      VALUES (?, ?, ?, ?)
    `).run(bookmark.book_id, bookmark.title, bookmark.byte_offset, bookmark.created_at);
  }

  /**
   * 获取指定书籍的所有书签
   */
  findByBookId(bookId: string): BookmarkRecord[] {
    const db = getDb();
    return db.prepare('SELECT * FROM bookmarks WHERE book_id = ? ORDER BY created_at DESC').all(bookId) as BookmarkRecord[];
  }

  /**
   * 获取指定书签
   */
  findById(id: number): BookmarkRecord | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM bookmarks WHERE id = ?').get(id) as BookmarkRecord | undefined;
  }

  /**
   * 获取书籍书签总数
   */
  getCount(bookId: string): number {
    const db = getDb();
    const result = db.prepare('SELECT COUNT(*) as count FROM bookmarks WHERE book_id = ?').get(bookId) as { count: number };
    return result.count;
  }

  /**
   * 删除书签
   */
  delete(id: number): void {
    const db = getDb();
    db.prepare('DELETE FROM bookmarks WHERE id = ?').run(id);
  }

  /**
   * 移除整本书的书签 (配合彻底清理书籍使用)
   */
  deleteByBookId(bookId: string): void {
    const db = getDb();
    db.prepare('DELETE FROM bookmarks WHERE book_id = ?').run(bookId);
  }
}
