/**
 * GBK/UTF-8 自动检测
 */

import { readFileSync } from 'fs';
import { detect } from 'chardet';
import iconv from 'iconv-lite';

/**
 * 检测文件编码并返回 UTF-8 字符串
 */
export function readFileWithEncoding(filePath: string): string {
  const buffer = readFileSync(filePath);
  const encoding = detect(buffer) || 'utf-8';

  if (encoding.toLowerCase() === 'utf-8' || encoding.toLowerCase() === 'ascii') {
    return buffer.toString('utf-8');
  }

  return iconv.decode(buffer, encoding);
}

/**
 * 检测文件编码
 */
export function detectEncoding(filePath: string): string {
  const buffer = readFileSync(filePath);
  return detect(buffer) || 'utf-8';
}
