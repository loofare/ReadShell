/**
 * 应用配置管理
 * 读写 <数据目录>/config.json（见 config/paths.ts）
 */

import Conf from 'conf';
import { randomUUID } from 'node:crypto';
import { existsSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { getAppDataDir } from './paths.js';

export type BossKeyLang = 'nodejs' | 'python' | 'java' | 'c' | 'go';

interface ReadShellConfig {
  /** 每页显示行数（0 = 自适应终端高度） */
  linesPerPage: number;
  /** 是否显示状态栏 */
  showStatusBar: boolean;
  /** 阅读模式: 'page' | 'scroll' */
  readingMode: 'page' | 'scroll';
  /** 界面语言 */
  language: 'zh' | 'en';
  /** 行间距 (0-2) */
  lineSpacing: number;
  /** 老板键伪装语言 */
  bossKeyLang: BossKeyLang;
  /** 本设备 ID（文件夹同步用，首次使用时生成） */
  deviceId?: string;
  /** 文件夹同步目录（novel sync --dir 设置） */
  syncDir?: string;
}

const defaults: ReadShellConfig = {
  linesPerPage: 0,
  showStatusBar: true,
  readingMode: 'page',
  language: 'zh',
  lineSpacing: 0,
  bossKeyLang: 'nodejs',
};

const configDir = getAppDataDir();

// 兼容旧版本：conf 默认把配置写到 env-paths 目录（projectName + "-nodejs"），
// 1.0 起统一放到数据目录。新位置不存在而旧位置存在时迁移一次，保留用户设置。
// 设置了 READSHELL_HOME（测试/隔离实例）时不读取真实用户的旧配置。
function legacyConfigPath(): string {
  const name = 'readshell-nodejs';
  if (process.platform === 'darwin') {
    return join(homedir(), 'Library', 'Preferences', name, 'config.json');
  }
  if (process.platform === 'win32') {
    const appData = process.env['APPDATA'] || join(homedir(), 'AppData', 'Roaming');
    return join(appData, name, 'Config', 'config.json');
  }
  const xdgConfig = process.env['XDG_CONFIG_HOME'] || join(homedir(), '.config');
  return join(xdgConfig, name, 'config.json');
}

const newConfigPath = join(configDir, 'config.json');
if (!process.env['READSHELL_HOME'] && !existsSync(newConfigPath)) {
  const legacyPath = legacyConfigPath();
  if (existsSync(legacyPath)) {
    try {
      copyFileSync(legacyPath, newConfigPath);
    } catch {
      // 迁移失败不阻塞启动，使用默认配置
    }
  }
}

const config = new Conf<ReadShellConfig>({
  cwd: configDir,
  defaults,
});

// 一次性清理：1.0 移除了云账号体系，删掉旧版本遗留的 auth*/lastSyncAt 键
for (const legacyKey of [
  'authToken',
  'authUserId',
  'authDeviceId',
  'authTier',
  'authExpiresAt',
  'lastSyncAt',
]) {
  config.delete(legacyKey as never);
}

export function getConfig(): ReadShellConfig {
  return {
    linesPerPage: config.get('linesPerPage'),
    showStatusBar: config.get('showStatusBar'),
    readingMode: config.get('readingMode'),
    language: config.get('language'),
    lineSpacing: config.get('lineSpacing'),
    bossKeyLang: config.get('bossKeyLang'),
    deviceId: config.get('deviceId'),
    syncDir: config.get('syncDir'),
  };
}

export function setConfig<K extends keyof ReadShellConfig>(key: K, value: ReadShellConfig[K]): void {
  config.set(key, value);
}

/**
 * 获取本设备 ID，首次调用时生成并持久化
 */
export function getDeviceId(): string {
  let id = config.get('deviceId');
  if (!id) {
    id = randomUUID();
    config.set('deviceId', id);
  }
  return id;
}

export function getSyncDir(): string | null {
  return config.get('syncDir') ?? null;
}

export function setSyncDir(dir: string): void {
  config.set('syncDir', dir);
}

export function clearSyncDir(): void {
  config.delete('syncDir' as never);
}

export { config };
