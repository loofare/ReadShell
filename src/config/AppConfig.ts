/**
 * 应用配置管理
 * 读写 ~/.config/readshell/config.json
 */

import Conf from 'conf';

interface ReadShellConfig {
  /** 每页显示行数（0 = 自适应终端高度） */
  linesPerPage: number;
  /** 是否显示状态栏 */
  showStatusBar: boolean;
  /** 阅读模式: 'page' | 'scroll' */
  readingMode: 'page' | 'scroll';
}

const defaults: ReadShellConfig = {
  linesPerPage: 0,
  showStatusBar: true,
  readingMode: 'page',
};

const config = new Conf<ReadShellConfig>({
  projectName: 'readshell',
  defaults,
});

export function getConfig(): ReadShellConfig {
  return {
    linesPerPage: config.get('linesPerPage'),
    showStatusBar: config.get('showStatusBar'),
    readingMode: config.get('readingMode'),
  };
}

export function setConfig<K extends keyof ReadShellConfig>(key: K, value: ReadShellConfig[K]): void {
  config.set(key, value);
}

export { config };
