/**
 * TXT 文件解析器
 * 编码检测、章节切割
 */

import { readFileSync } from 'fs';
import { detect } from 'chardet';
import iconv from 'iconv-lite';
import { logger } from '../utils/logger.js';

export interface ParsedChapter {
  title: string;
  byteOffset: number;
}

export interface ParsedBook {
  title: string;
  author: string | null;
  content: string;
  chapters: ParsedChapter[];
}

// 常见的章节标题正则
const CHAPTER_PATTERNS = [
  /^第[零一二三四五六七八九十百千万\d]+[章节回卷集部篇]/m,
  /^Chapter\s+\d+/im,
  /^CHAPTER\s+\d+/m,
  /^第\s*\d+\s*[章节回]/m,
];

/**
 * 解析 TXT 文件
 */
export async function parseTxt(filePath: string): Promise<ParsedBook> {
  // 读取原始字节
  const buffer = readFileSync(filePath);

  // 自动检测编码
  const encoding = detect(buffer) || 'utf-8';
  logger.debug(`检测到编码: ${encoding}`);

  // 转换为 UTF-8 字符串
  const content = encoding.toLowerCase() === 'utf-8'
    ? buffer.toString('utf-8')
    : iconv.decode(buffer, encoding);

  // 从文件名提取标题
  const title = extractTitle(filePath);

  // 提取章节索引
  const chapters = extractChapters(content);

  return {
    title,
    author: null,
    content,
    chapters,
  };
}

/**
 * 从文件名提取书名
 */
function extractTitle(filePath: string): string {
  const basename = filePath.split('/').pop() || filePath;
  // 去掉扩展名
  return basename.replace(/\.txt$/i, '').trim() || '未命名';
}

/**
 * 提取章节索引
 */
function extractChapters(content: string): ParsedChapter[] {
  const chapters: ParsedChapter[] = [];
  const lines = content.split('\n');
  let byteOffset = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    for (const pattern of CHAPTER_PATTERNS) {
      if (pattern.test(trimmed)) {
        chapters.push({
          title: trimmed,
          byteOffset,
        });
        break;
      }
    }

    // 计算 byte offset（UTF-8 编码）
    byteOffset += Buffer.byteLength(line + '\n', 'utf-8');
  }

  logger.debug(`检测到 ${chapters.length} 个章节`);
  return chapters;
}
