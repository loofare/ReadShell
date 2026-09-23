/**
 * bookmarks 表数据操作
 * deleted=1 的行为墓碑记录：本地删除不物理移除，供文件夹同步传播删除事件
 */

import { getDb } from '../client.js';

export interface BookmarkRecord {
  id?: number;
  book_id: string;
  title: string;
  byte_offset: number;
  created_at: number;
  /** 最近一次变更（新增/删除）时间，同步 LWW 依据 */
  updated_at: number;
  /** 1 = 墓碑（已删除） */
  deleted: number;
}

export class BookmarkModel {
  /**
   * 插入书签
   */
  insert(bookmark: Omit<BookmarkRecord, 'id'>): void {
    const db = getDb();
    db.prepare(`
      INSERT INTO bookmarks (book_id, title, byte_offset, created_at, updated_at, deleted)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      bookmark.book_id,
      bookmark.title,
      bookmark.byte_offset,
      bookmark.created_at,
      bookmark.updated_at,
      bookmark.deleted,
    );
  }

  /**
   * 获取指定书籍的所有有效书签（不含墓碑）
   */
  findByBookId(bookId: string): BookmarkRecord[] {
    const db = getDb();
    return db.prepare('SELECT * FROM bookmarks WHERE book_id = ? AND deleted = 0 ORDER BY created_at DESC').all(bookId) as BookmarkRecord[];
  }

  /**
   * 获取指定书籍的全部书签记录（含墓碑，同步导出用）
   */
  findAllByBookId(bookId: string): BookmarkRecord[] {
    const db = getDb();
    return db.prepare('SELECT * FROM bookmarks WHERE book_id = ? ORDER BY created_at DESC').all(bookId) as BookmarkRecord[];
  }

  /**
   * 按 (book_id, byte_offset) 查找有效书签
   */
  findByOffset(bookId: string, byteOffset: number): BookmarkRecord | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM bookmarks WHERE book_id = ? AND byte_offset = ? AND deleted = 0').get(bookId, byteOffset) as BookmarkRecord | undefined;
  }

  /**
   * 按 (book_id, byte_offset) 查找书签记录（含墓碑，同步合并用）
   */
  findByOffsetAny(bookId: string, byteOffset: number): BookmarkRecord | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM bookmarks WHERE book_id = ? AND byte_offset = ?').get(bookId, byteOffset) as BookmarkRecord | undefined;
  }

  /**
   * 按 (book_id, byte_offset) 软删除书签（写墓碑，同步传播删除用）
   */
  deleteByOffset(bookId: string, byteOffset: number): void {
    const db = getDb();
    db.prepare('UPDATE bookmarks SET deleted = 1, updated_at = ? WHERE book_id = ? AND byte_offset = ? AND deleted = 0')
      .run(Date.now(), bookId, byteOffset);
  }

  /**
   * 同步合并：按 (book_id, byte_offset) 覆盖写入一条书签记录（可为墓碑）
   */
  saveByOffset(record: Omit<BookmarkRecord, 'id'>): void {
    const db = getDb();
    const existing = this.findByOffsetAny(record.book_id, record.byte_offset);
    if (existing?.id !== undefined) {
      db.prepare(`
        UPDATE bookmarks SET title = ?, created_at = ?, updated_at = ?, deleted = ?
        WHERE id = ?
      `).run(record.title, record.created_at, record.updated_at, record.deleted, existing.id);
    } else {
      this.insert(record);
    }
  }

  /**
   * 获取指定书签
   */
  findById(id: number): BookmarkRecord | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM bookmarks WHERE id = ?').get(id) as BookmarkRecord | undefined;
  }

  /**
   * 获取书籍有效书签总数
   */
  getCount(bookId: string): number {
    const db = getDb();
    const result = db.prepare('SELECT COUNT(*) as count FROM bookmarks WHERE book_id = ? AND deleted = 0').get(bookId) as { count: number };
    return result.count;
  }

  /**
   * 删除书签（写墓碑）
   */
  delete(id: number): void {
    const db = getDb();
    db.prepare('UPDATE bookmarks SET deleted = 1, updated_at = ? WHERE id = ? AND deleted = 0').run(Date.now(), id);
  }

  /**
   * 移除整本书的书签 (配合彻底清理书籍使用，物理删除含墓碑)
   */
  deleteByBookId(bookId: string): void {
    const db = getDb();
    db.prepare('DELETE FROM bookmarks WHERE book_id = ?').run(bookId);
  }
}
