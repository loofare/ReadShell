/**
 * 文件 hash 计算（去重用）
 */

import { createHash } from 'crypto';
import { readFileSync } from 'fs';

/**
 * 计算文件的 SHA-256 hash
 */
export async function computeFileHash(filePath: string): Promise<string> {
  const buffer = readFileSync(filePath);
  const hash = createHash('sha256');
  hash.update(buffer);
  return hash.digest('hex');
}
