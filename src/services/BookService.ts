/**
 * 书籍业务逻辑
 * 书籍 CRUD、导入、去重
 */

import { resolve } from 'path';
import { existsSync, statSync } from 'fs';
import { nanoid } from 'nanoid';
import { BookModel, type BookRecord } from '../db/models/Book.js';
import { ChapterModel } from '../db/models/Chapter.js';
import { RecentModel } from '../db/models/Recent.js';
import { ProgressModel } from '../db/models/Progress.js';
import { parseFile } from '../parsers/index.js';
import { computeFileHash } from '../utils/hash.js';
import { logger } from '../utils/logger.js';

export class BookService {
  private bookModel = new BookModel();
  private chapterModel = new ChapterModel();
  private recentModel = new RecentModel();
  private progressModel = new ProgressModel();

  /**
   * 导入书籍文件
   */
  async importBook(filePath: string): Promise<BookRecord> {
    const absPath = resolve(filePath);

    // 检查文件存在
    if (!existsSync(absPath)) {
      throw new Error(`文件不存在: ${absPath}`);
    }

    // 检测文件格式
    const format = this.detectFormat(absPath);
    if (!format) {
      throw new Error('不支持的文件格式。目前支持: .txt, .epub');
    }

    // 计算文件 hash 用于去重
    const fileHash = await computeFileHash(absPath);
    const existing = this.bookModel.findByHash(fileHash);
    if (existing) {
      logger.debug(`文件已存在: ${existing.title} (${existing.id})`);
      return existing;
    }

    // 解析文件
    const parsed = await parseFile(absPath, format);

    // 获取文件大小
    const stats = statSync(absPath);

    // 创建书籍记录
    const book: BookRecord = {
      id: nanoid(),
      title: parsed.title,
      author: parsed.author || null,
      file_path: absPath,
      format,
      file_hash: fileHash,
      file_size: stats.size,
      created_at: Date.now(),
    };

    this.bookModel.insert(book);

    // 保存章节索引
    if (parsed.chapters.length > 0) {
      this.chapterModel.insertMany(
        parsed.chapters.map((ch, idx) => ({
          book_id: book.id,
          chapter_no: idx,
          title: ch.title,
          byte_offset: ch.byteOffset,
        })),
      );
    }

    logger.debug(`导入成功: ${book.title}`);
    return book;
  }

  /**
   * 查找书籍（ID 或模糊匹配书名）
   */
  findBook(target: string): BookRecord | undefined {
    // 先尝试精确 ID 匹配
    const byId = this.bookModel.findById(target);
    if (byId) return byId;

    // 再尝试书名模糊匹配
    const results = this.bookModel.searchByTitle(target);
    return results[0];
  }

  /**
   * 搜索书籍
   */
  searchBooks(keyword: string): BookRecord[] {
    return this.bookModel.searchByTitle(keyword);
  }

  /**
   * 获取所有书籍
   */
  getAllBooks(): BookRecord[] {
    return this.bookModel.findAll();
  }

  /**
   * 删除书籍及相关数据
   */
  deleteBook(id: string): void {
    this.chapterModel.deleteByBookId(id);
    this.progressModel.delete(id);
    this.recentModel.delete(id);
    this.bookModel.delete(id);
  }

  /**
   * 检测文件格式
   */
  private detectFormat(filePath: string): 'txt' | 'epub' | null {
    const ext = filePath.toLowerCase().split('.').pop();
    if (ext === 'txt') return 'txt';
    if (ext === 'epub') return 'epub';
    return null;
  }
}
