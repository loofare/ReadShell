/**
 * EPUB 文件解析器
 * 元数据 + 章节提取，并转为纯文本阅读格式
 */

import { EPub } from 'epub2';
import { convert } from 'html-to-text';
import { detect } from 'chardet';
import iconv from 'iconv-lite';
import { logger } from '../utils/logger.js';
import type { ParsedBook, ParsedChapter } from './TxtParser.js';

/**
 * 解析 EPUB 文件
 */
export async function parseEpub(filePath: string): Promise<ParsedBook> {
  logger.debug(`开始解析 EPUB: ${filePath}`);

  const epub = await openEpub(filePath);

  const title = epub.metadata.title || '未知书名';
  const author = epub.metadata.creator || null;

  const chapters: ParsedChapter[] = [];
  let fullContent = '';
  let currentByteOffset = 0;

  // epub.flow contains the reading order
  for (const chapterRef of epub.flow) {
    if (!chapterRef.id) continue;

    try {
      const htmlText = await getChapterHtml(epub, chapterRef.id);
      
      // 使用 html-to-text 转为纯文本，保持换行，去除无关标签
      const plainText = convert(htmlText, {
        wordwrap: false,
        selectors: [
          // 忽略图片和链接
          { selector: 'img', format: 'skip' },
          { selector: 'a', options: { ignoreHref: true } },
        ],
      });

      if (!plainText.trim()) continue; // 跳过空章节

      const chapterTitle = chapterRef.title || '无标题章节';

      chapters.push({
        title: chapterTitle,
        byteOffset: currentByteOffset,
      });

      // 加上章节标题作为正文本页头部
      const chapterContent = `\n\n${chapterTitle}\n\n${plainText}\n`;
      fullContent += chapterContent;

      currentByteOffset += Buffer.byteLength(chapterContent, 'utf-8');
    } catch (err) {
      logger.debug(`警告: 读取章节 ${chapterRef.id} 失败`, err);
    }
  }

  return {
    title,
    author,
    content: fullContent,
    chapters,
  };
}

/**
 * 提取 EPUB 元数据
 */
export async function getEpubMetadata(filePath: string): Promise<{ title: string; author: string | null }> {
  const epub = await openEpub(filePath);
  return {
    title: epub.metadata.title || '未知',
    author: epub.metadata.creator || null,
  };
}

// ============== 辅助函数 ==============

/**
 * 包装 epub2 基于回调的初始化过程为 Promise
 */
function openEpub(filePath: string): Promise<EPub> {
  return new Promise((resolve, reject) => {
    const epub = new EPub(filePath);
    epub.on('error', (err) => reject(err));
    epub.on('end', () => resolve(epub));
    epub.parse();
  });
}

/**
 * 获取单个章节的 HTML 原文并自动转码
 * 包装为 Promise
 */
function getChapterHtml(epub: any, chapterId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // 使用 getFile 获取原始 Buffer，避免 epub2 内部 getChapterRaw 强制转 utf-8 导致的乱码
    epub.getFile(chapterId, (err: Error | null, data: Buffer) => {
      if (err) return reject(err);

      const buffer = data;
      // 探测编码（如 GBK, UTF-8）
      const encoding = detect(buffer) || 'utf-8';
      
      const htmlText = encoding.toLowerCase() === 'utf-8'
        ? buffer.toString('utf-8')
        : iconv.decode(buffer, encoding);

      resolve(htmlText);
    });
  });
}

