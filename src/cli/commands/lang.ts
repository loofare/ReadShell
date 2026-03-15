/**
 * novel lang <zh|en> — 切换语言
 */

import type { CommandModule } from 'yargs';
import { setConfig } from '../../config/AppConfig.js';
import { t, setLanguage } from '../../locales/index.js';

export interface LangArgs {
  target: 'zh' | 'en';
}

export const langCommand: CommandModule<object, LangArgs> = {
  command: 'lang <target>',
  describe: t('cli.lang.desc'),
  builder: (yargs) => {
    return yargs.positional('target', {
      describe: t('cli.lang.help'),
      type: 'string',
      choices: ['zh', 'en'] as const,
      demandOption: true,
    });
  },
  handler: (argv) => {
    const lang = argv.target;
    if (lang === 'zh' || lang === 'en') {
      setConfig('language', lang);
      setLanguage(lang);
      console.log(t('cli.lang.success', lang));
    } else {
      console.log(t('cli.lang.unsupported', lang));
      process.exit(1);
    }
  },
};
