/**
 * 书签管理服务
 * 处理针对某一位置打标记录以及后续的跳转
 */

import { BookmarkModel, type BookmarkRecord } from '../db/models/Bookmark.js';

export class BookmarkService {
  private bookmarkModel: BookmarkModel;

  constructor() {
    this.bookmarkModel = new BookmarkModel();
  }

  /**
   * 增加一条书签
   * @param title 该书签展现给用户的文案（一句话大纲）
   */
  addBookmark(bookId: string, title: string, byteOffset: number): void {
    this.bookmarkModel.insert({
      book_id: bookId,
      title,
      byte_offset: byteOffset,
      created_at: Date.now(),
    });
  }

  /**
   * 罗列该书全部的书签
   */
  getBookmarksByBookId(bookId: string): BookmarkRecord[] {
    return this.bookmarkModel.findByBookId(bookId);
  }

  /**
   * 删掉对应书签
   */
  removeBookmark(id: number): void {
    this.bookmarkModel.delete(id);
  }
}
