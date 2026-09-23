/**
 * novel config <key> <value> — 修改应用配置
 */

import type { CommandModule } from 'yargs';
import { setConfig, type BossKeyLang } from '../../config/AppConfig.js';
import { t } from '../../locales/index.js';

const BOSS_KEY_LANGS: BossKeyLang[] = ['nodejs', 'python', 'java', 'c', 'go'];

export interface ConfigArgs {
  key: string;
  value: string;
}

export const configCommand: CommandModule<object, ConfigArgs> = {
  command: 'config <key> <value>',
  describe: t('cli.config.desc'),
  builder: (yargs) => {
    return yargs
      .positional('key', {
        describe: '配置项名称 (language|line-spacing|reading-mode|boss-key-lang)',
        type: 'string',
        choices: ['language', 'line-spacing', 'reading-mode', 'boss-key-lang'] as const,
        demandOption: true,
      })
      .positional('value', {
        describe: '配置项内容',
        type: 'string',
        demandOption: true,
      });
  },
  handler: (argv) => {
    const { key, value } = argv;

    try {
      if (key === 'language') {
        if (value === 'zh' || value === 'en') {
          setConfig('language', value);
          console.log(t('cli.lang.success', value));
        } else {
          console.log(t('cli.lang.unsupported', value));
        }
      } else if (key === 'line-spacing') {
        const spacing = parseInt(value, 10);
        if (!isNaN(spacing) && spacing >= 0 && spacing <= 2) {
          setConfig('lineSpacing', spacing);
          console.log(t('cli.config.line_spacing.success', spacing));
        } else {
          console.log(t('cli.config.line_spacing.desc'));
        }
      } else if (key === 'reading-mode') {
        if (value === 'page' || value === 'scroll') {
          setConfig('readingMode', value);
          console.log(`✓ Reading mode set to: ${value}`);
        } else {
          console.log(t('cli.config.reading_mode.desc'));
        }
      } else if (key === 'boss-key-lang') {
        if (BOSS_KEY_LANGS.includes(value as BossKeyLang)) {
          setConfig('bossKeyLang', value as BossKeyLang);
          console.log(`✓ Boss key language set to: ${value}`);
        } else {
          console.log(`✗ Unsupported language. Choose from: ${BOSS_KEY_LANGS.join(', ')}`);
        }
      }
    } catch (err) {
      console.error('✗ Failed to update config:', err);
      process.exit(1);
    }
  },
};
