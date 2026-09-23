/**
 * novel sync — 文件夹同步
 * --dir <path>  设置同步目录并立即同步（目录交给 iCloud/Dropbox/坚果云/Syncthing 等同步）
 * --with-books  同时同步书源文件
 * --off         关闭同步
 * 无参数        使用已保存的目录同步一次
 */

import type { CommandModule } from 'yargs';
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { t } from '../../locales/index.js';
import { getSyncDir, setSyncDir, clearSyncDir } from '../../config/AppConfig.js';
import { SyncFolderService } from '../../services/SyncFolderService.js';

interface SyncArgs {
  dir?: string;
  'with-books'?: boolean;
  off?: boolean;
}

export const syncCommand: CommandModule = {
  command: 'sync',
  describe: t('cli.sync.desc'),
  builder: (yargs) =>
    yargs
      .option('dir', {
        describe: t('cli.sync.dir'),
        type: 'string',
      })
      .option('with-books', {
        describe: t('cli.sync.with_books'),
        type: 'boolean',
        default: false,
      })
      .option('off', {
        describe: t('cli.sync.off'),
        type: 'boolean',
        default: false,
      }),
  handler: async (argv) => {
    const args = argv as unknown as SyncArgs;

    if (args.off) {
      clearSyncDir();
      console.log(t('cli.sync.disabled'));
      return;
    }

    if (args.dir) {
      const dir = resolve(args.dir);
      if (!existsSync(dir) || !statSync(dir).isDirectory()) {
        console.log(t('cli.sync.dir_invalid', dir));
        process.exit(1);
      }
      setSyncDir(dir);
      console.log(t('cli.sync.dir_set', dir));
    }

    const syncDir = getSyncDir();
    if (!syncDir) {
      console.log(t('cli.sync.no_dir'));
      process.exit(1);
    }

    console.log(t('cli.sync.running'));
    try {
      const result = await new SyncFolderService(syncDir).sync({ withBooks: args['with-books'] });
      console.log(t('cli.sync.success', String(result.pulled), String(result.devices)));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(t('cli.sync.failed', msg));
      process.exit(1);
    }
  },
};
