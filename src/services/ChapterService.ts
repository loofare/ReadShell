/**
 * 章节索引业务逻辑
 * 章节索引构建与查询
 */

import { ChapterModel, type ChapterRecord } from '../db/models/Chapter.js';

export class ChapterService {
  private chapterModel = new ChapterModel();

  /**
   * 获取指定书籍的所有章节
   */
  getChapters(bookId: string): ChapterRecord[] {
    return this.chapterModel.findByBookId(bookId);
  }

  /**
   * 获取指定章节信息
   */
  getChapter(bookId: string, chapterNo: number): ChapterRecord | undefined {
    return this.chapterModel.findChapter(bookId, chapterNo);
  }

  /**
   * 获取章节总数
   */
  getChapterCount(bookId: string): number {
    return this.chapterModel.getChapterCount(bookId);
  }

  /**
   * 根据 byte_offset 找到当前所在章节
   */
  getChapterByOffset(bookId: string, byteOffset: number): ChapterRecord | undefined {
    const chapters = this.chapterModel.findByBookId(bookId);
    if (chapters.length === 0) return undefined;

    // 找到 offset 所在的章节（最后一个 byte_offset <= 给定 offset 的章节）
    let current: ChapterRecord | undefined;
    for (const chapter of chapters) {
      if (chapter.byte_offset <= byteOffset) {
        current = chapter;
      } else {
        break;
      }
    }
    return current;
  }
}
