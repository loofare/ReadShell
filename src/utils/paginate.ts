/**
 * 文本分页算法
 * 按终端宽高切割文本为页面
 */

import { getStringWidth } from './stringWidth.js';

export interface Page {
  /** 页面内容行 */
  lines: string[];
  /** 此页在原始文本中的 byte offset 起始位置 */
  byteOffset: number;
}

/**
 * 将文本按终端尺寸分页
 * @param text 原始文本
 * @param width 终端宽度（列数）
 * @param height 可用行数（扣除状态栏后）
 * @returns 分页结果
 */
export function paginate(text: string, width: number, height: number): Page[] {
  const pages: Page[] = [];
  const rawLines = text.split('\n');

  // 将原始文本行按终端宽度折行
  const wrappedLines: { text: string; byteOffset: number }[] = [];
  let currentOffset = 0;

  for (const rawLine of rawLines) {
    const wrapped = wrapLine(rawLine, width);
    for (const line of wrapped) {
      wrappedLines.push({ text: line, byteOffset: currentOffset });
    }
    currentOffset += Buffer.byteLength(rawLine + '\n', 'utf-8');
  }

  // 按高度切割为页
  for (let i = 0; i < wrappedLines.length; i += height) {
    const pageLines = wrappedLines.slice(i, i + height);
    pages.push({
      lines: pageLines.map((l) => l.text),
      byteOffset: pageLines[0]?.byteOffset ?? 0,
    });
  }

  return pages;
}

/**
 * 将一行文本按终端宽度折行
 * 处理中英文混排（中文字符宽度为 2）
 */
export function wrapLine(line: string, width: number): string[] {
  if (line.length === 0) return [''];

  const result: string[] = [];
  let currentLine = '';
  let currentWidth = 0;

  for (const char of line) {
    const charWidth = getStringWidth(char);

    if (currentWidth + charWidth > width) {
      result.push(currentLine);
      currentLine = char;
      currentWidth = charWidth;
    } else {
      currentLine += char;
      currentWidth += charWidth;
    }
  }

  if (currentLine.length > 0) {
    result.push(currentLine);
  }

  return result.length > 0 ? result : [''];
}
