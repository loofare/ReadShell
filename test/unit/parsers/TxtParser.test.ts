/**
 * TxtParser 单元测试
 */

import { describe, it, expect } from 'vitest';
import { parseTxt } from '../../../src/parsers/TxtParser.js';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('TxtParser', () => {
  it('应正确解析 sample.txt', async () => {
    const filePath = resolve(__dirname, '../../fixtures/sample.txt');
    const result = await parseTxt(filePath);

    expect(result.title).toBe('sample');
    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);
  });

  it('应检测到章节标题', async () => {
    const filePath = resolve(__dirname, '../../fixtures/sample.txt');
    const result = await parseTxt(filePath);

    expect(result.chapters.length).toBeGreaterThan(0);
    expect(result.chapters[0].title).toMatch(/第.*章/);
  });
});
