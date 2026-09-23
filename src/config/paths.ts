/**
 * 跨平台路径管理
 * 数据库、配置文件位置
 */

import { join } from 'path';
import { homedir } from 'os';
import { mkdirSync, existsSync } from 'fs';

/**
 * 获取应用数据目录
 * 默认 ~/.config/readshell/（macOS 为 ~/Library/Application Support/readshell），
 * 可用环境变量 READSHELL_HOME 覆盖（测试或多实例隔离用）
 */
export function getAppDataDir(): string {
  const override = process.env['READSHELL_HOME'];
  let configDir: string;

  if (override) {
    configDir = override;
  } else {
    const platform = process.platform;
    if (platform === 'darwin') {
      configDir = join(homedir(), 'Library', 'Application Support', 'readshell');
    } else if (platform === 'win32') {
      configDir = join(process.env['APPDATA'] || join(homedir(), 'AppData', 'Roaming'), 'readshell');
    } else {
      // Linux / 其他
      configDir = join(process.env['XDG_CONFIG_HOME'] || join(homedir(), '.config'), 'readshell');
    }
  }

  // 确保目录存在
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }

  return configDir;
}

/**
 * 获取数据库文件路径
 */
export function getDbPath(): string {
  return join(getAppDataDir(), 'readshell.db');
}

/**
 * 获取配置文件路径
 */
export function getConfigPath(): string {
  return join(getAppDataDir(), 'config.json');
}
