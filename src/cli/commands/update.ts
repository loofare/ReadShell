import type { CommandModule } from 'yargs';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { t } from '../../locales/index.js';
import { logger } from '../../utils/logger.js';

export const updateCommand: CommandModule = {
  command: 'update',
  describe: t('cli.update.desc'),
  handler: async () => {
    try {
      console.log(t('cli.update.checking'));

      // 获取本地版本号 (由 tsup 在构建时注入)
      const localVersion = typeof APP_VERSION !== 'undefined' ? APP_VERSION : '0.2.2';

      // 获取 NPM 最新版本
      const npmOutput = execSync('npm view readshell version', { encoding: 'utf-8' });
      const latestVersion = npmOutput.trim();

      if (!latestVersion) {
        throw new Error('Could not fetch npm version');
      }

      if (latestVersion === localVersion) {
        console.log(t('cli.update.latest', localVersion));
        return;
      }

      console.log(t('cli.update.updating', latestVersion, localVersion));
      
      // 执行升级指令
      execSync('npm install -g readshell@latest', { stdio: 'inherit' });
      
      console.log(t('cli.update.success'));
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.log(t('cli.update.fail', msg));
      logger.error('更新失败:', error);
      process.exit(1);
    }
  },
};
