/**
 * CLI 参数解析器
 * 使用 yargs 解析子命令
 */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { importCommand } from './commands/import.js';
import { resumeCommand } from './commands/resume.js';
import { openCommand } from './commands/open.js';
import { libraryCommand } from './commands/library.js';
import { removeCommand } from './commands/remove.js';
import { langCommand } from './commands/lang.js';
import { updateCommand } from './commands/update.js';

export function createParser() {
  const version = typeof APP_VERSION !== 'undefined' ? APP_VERSION : 'dev';

  return yargs(hideBin(process.argv))
    .scriptName('novel')
    .usage('$0 <command> [options]')
    .command(importCommand)
    .command(resumeCommand)
    .command(openCommand)
    .command(libraryCommand)
    .command(removeCommand)
    .command(langCommand)
    .command(updateCommand)
    .demandCommand(1, '请指定一个命令。使用 --help 查看可用命令。')
    .strict()
    .alias('h', 'help')
    .alias('v', 'version')
    .version(version)
    .epilogue('ReadShell — 终端内低打断轻阅读工具');
}
