/**
 * 测试环境初始化
 * 在任何模块加载前把数据目录指到临时目录，避免测试读写真实用户数据
 */

import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

process.env['READSHELL_HOME'] = mkdtempSync(join(tmpdir(), 'readshell-test-'));
