/**
 * 分页算法单元测试
 */

import { describe, it, expect } from 'vitest';
import { paginate, wrapLine } from '../../../src/utils/paginate.js';

describe('paginate', () => {
  it('应将文本按指定高度分页', () => {
    const text = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6';
    const pages = paginate(text, 80, 3);

    expect(pages.length).toBe(2);
    expect(pages[0].lines.length).toBe(3);
    expect(pages[0].lines[0]).toBe('Line 1');
  });

  it('应正确处理空文本', () => {
    const pages = paginate('', 80, 24);
    expect(pages.length).toBe(1);
  });

  it('应正确计算 byte offset', () => {
    const text = 'Hello\nWorld';
    const pages = paginate(text, 80, 1);

    expect(pages[0].byteOffset).toBe(0);
    // 'Hello\n' = 6 bytes
    expect(pages[1].byteOffset).toBe(6);
  });
});

describe('wrapLine', () => {
  it('应将超宽行折行', () => {
    const result = wrapLine('ABCDEFGHIJ', 5);
    expect(result).toEqual(['ABCDE', 'FGHIJ']);
  });

  it('应正确处理中文字符（宽度为 2）', () => {
    const result = wrapLine('你好世界测试', 6);
    // 每个中文字符宽度为 2，一行能容纳 3 个中文字符
    expect(result[0]).toBe('你好世');
    expect(result[1]).toBe('界测试');
  });

  it('应正确处理空行', () => {
    const result = wrapLine('', 80);
    expect(result).toEqual(['']);
  });
});
