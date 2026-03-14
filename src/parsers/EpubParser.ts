/**
 * EPUB 文件解析器
 * 元数据 + 章节提取
 */

import { logger } from '../utils/logger.js';
import type { ParsedBook, ParsedChapter } from './TxtParser.js';

/**
 * 解析 EPUB 文件
 * TODO: 阶段一暂不实现 epub 完整解析，先做 txt-only
 */
export async function parseEpub(filePath: string): Promise<ParsedBook> {
  logger.debug(`解析 EPUB: ${filePath}`);

  // TODO: 使用 epub2 库实现完整解析
  // const epub = new EPub(filePath);
  // await epub.parse();

  throw new Error('epub 支持即将推出。目前请使用 .txt 文件。');
}

/**
 * 提取 EPUB 元数据
 * TODO: 实现
 */
export async function getEpubMetadata(_filePath: string): Promise<{ title: string; author: string | null }> {
  // TODO: 实现元数据提取
  return { title: '未知', author: null };
}
