/**
 * 阅读进度业务逻辑
 * 进度读写、resume 核心逻辑
 */

import { ProgressModel, type ProgressRecord } from '../db/models/Progress.js';
import { RecentModel } from '../db/models/Recent.js';
import { logger } from '../utils/logger.js';

export class ProgressService {
  private progressModel = new ProgressModel();
  private recentModel = new RecentModel();

  /**
   * 保存阅读进度（退出时调用）
   */
  saveProgress(bookId: string, chapterNo: number, byteOffset: number, percent: number): void {
    const now = Date.now();

    this.progressModel.upsert({
      book_id: bookId,
      chapter_no: chapterNo,
      byte_offset: byteOffset,
      percent,
      updated_at: now,
      opened_at: now,
    });

    // 同时更新最近阅读记录
    this.recentModel.recordOpen(bookId);

    logger.debug(`进度已保存: book=${bookId}, chapter=${chapterNo}, offset=${byteOffset}, ${(percent * 100).toFixed(1)}%`);
  }

  /**
   * 获取指定书籍的阅读进度（resume 时调用）
   */
  getProgress(bookId: string): ProgressRecord | undefined {
    return this.progressModel.findByBookId(bookId);
  }

  /**
   * 获取最近打开的书籍进度（启动时调用，决定 resume 哪本书）
   */
  getLastOpenedBook(): ProgressRecord | undefined {
    return this.progressModel.getLastOpened();
  }
}
