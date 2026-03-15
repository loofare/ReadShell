export type LocaleKeys = keyof typeof import('./zh.js').default;

export type LocaleDictionary = Record<LocaleKeys, string>;
