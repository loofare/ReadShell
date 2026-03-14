/**
 * 解析器分发
 * 按文件格式分发到对应解析器
 */

import { parseTxt, type ParsedBook } from './TxtParser.js';
import { parseEpub } from './EpubParser.js';

export type { ParsedBook, ParsedChapter } from './TxtParser.js';

/**
 * 根据格式解析文件
 */
export async function parseFile(filePath: string, format: 'txt' | 'epub'): Promise<ParsedBook> {
  switch (format) {
    case 'txt':
      return parseTxt(filePath);
    case 'epub':
      return parseEpub(filePath);
    default:
      throw new Error(`不支持的文件格式: ${format}`);
  }
}
