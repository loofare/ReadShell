/**
 * books 表数据操作
 */

import { getDb } from '../client.js';

export interface BookRecord {
  id: string;
  title: string;
  author: string | null;
  file_path: string;
  format: 'txt' | 'epub';
  file_hash: string;
  file_size: number | null;
  created_at: number;
}

export class BookModel {
  /**
   * 插入新书
   */
  insert(book: BookRecord): void {
    const db = getDb();
    db.prepare(`
      INSERT INTO books (id, title, author, file_path, format, file_hash, file_size, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(book.id, book.title, book.author, book.file_path, book.format, book.file_hash, book.file_size, book.created_at);
  }

  /**
   * 通过 ID 获取书籍
   */
  findById(id: string): BookRecord | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM books WHERE id = ?').get(id) as BookRecord | undefined;
  }

  /**
   * 通过文件 hash 查找（去重用）
   */
  findByHash(hash: string): BookRecord | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM books WHERE file_hash = ?').get(hash) as BookRecord | undefined;
  }

  /**
   * 模糊搜索书名
   */
  searchByTitle(keyword: string): BookRecord[] {
    const db = getDb();
    return db.prepare('SELECT * FROM books WHERE title LIKE ? ORDER BY created_at DESC').all(`%${keyword}%`) as BookRecord[];
  }

  /**
   * 获取所有书籍
   */
  findAll(): BookRecord[] {
    const db = getDb();
    return db.prepare('SELECT * FROM books ORDER BY created_at DESC').all() as BookRecord[];
  }

  /**
   * 删除书籍
   */
  delete(id: string): void {
    const db = getDb();
    db.prepare('DELETE FROM books WHERE id = ?').run(id);
  }
}
