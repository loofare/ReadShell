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

import * as fs from 'node:fs';

const getVersion = () => {
  try {
    const pkgUrl = new URL('../../package.json', import.meta.url);
    const pkg = JSON.parse(fs.readFileSync(pkgUrl, 'utf-8'));
    return pkg.version;
  } catch {
    return 'unknown';
  }
};

export function createParser() {
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
    .version(getVersion())
    .epilogue('ReadShell — 终端内低打断轻阅读工具');
}
