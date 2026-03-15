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
  /** 界面语言 */
  language: 'zh' | 'en';
  /** 行间距 (0-2) */
  lineSpacing: number;
}

const defaults: ReadShellConfig = {
  linesPerPage: 0,
  showStatusBar: true,
  readingMode: 'page',
  language: 'zh',
  lineSpacing: 0,
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
    language: config.get('language'),
    lineSpacing: config.get('lineSpacing'),
  };
}

export function setConfig<K extends keyof ReadShellConfig>(key: K, value: ReadShellConfig[K]): void {
  config.set(key, value);
}

export { config };
