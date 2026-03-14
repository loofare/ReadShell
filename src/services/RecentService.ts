/**
 * 最近阅读业务逻辑
 */

import { RecentModel } from '../db/models/Recent.js';
import { BookModel, type BookRecord } from '../db/models/Book.js';

export class RecentService {
  private recentModel = new RecentModel();
  private bookModel = new BookModel();

  /**
   * 获取最近阅读的书籍列表（包含书籍详情）
   */
  getRecentBooks(limit: number = 20): BookRecord[] {
    const recentRecords = this.recentModel.getRecent(limit);

    return recentRecords
      .map((record) => this.bookModel.findById(record.book_id))
      .filter((book): book is BookRecord => book !== undefined);
  }

  /**
   * 记录打开事件
   */
  recordOpen(bookId: string): void {
    this.recentModel.recordOpen(bookId);
  }
}
