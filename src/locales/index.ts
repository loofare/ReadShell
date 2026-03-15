import zh from './zh.js';
import en from './en.js';
import type { LocaleDictionary, LocaleKeys } from './types.js';
import { getConfig } from '../config/AppConfig.js';

const dictionaries: Record<'zh' | 'en', LocaleDictionary> = {
  zh,
  en,
};

let currentLang: 'zh' | 'en' = 'zh';
let currentDict: LocaleDictionary = dictionaries.zh;

/**
 * 初始化并加载当前配置的语言
 */
export function initI18n() {
  const config = getConfig();
  currentLang = config.language || 'zh';
  currentDict = dictionaries[currentLang] || dictionaries.zh;
}

/**
 * 切换语言字典（运行时热切换支持）
 */
export function setLanguage(lang: 'zh' | 'en') {
  currentLang = lang;
  currentDict = dictionaries[lang] || dictionaries.zh;
}

/**
 * 获取翻译词条
 * 支持占位符 {0}, {1} 替换
 */
export function t(key: LocaleKeys, ...args: (string | number)[]): string {
  let template = currentDict[key];
  if (!template) {
    return key;
  }
  
  if (args.length > 0) {
    args.forEach((arg, index) => {
      template = template.replace(`{${index}}`, String(arg));
    });
  }
  return template;
}
