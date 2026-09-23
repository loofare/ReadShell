/**
 * 命令注册统一导出
 */

import { importCommand } from './import.js';
import { resumeCommand } from './resume.js';
import { openCommand } from './open.js';
import { libraryCommand } from './library.js';
import { removeCommand } from './remove.js';
import { langCommand } from './lang.js';
import { updateCommand } from './update.js';
import { configCommand } from './config.js';
import { syncCommand } from './sync.js';
import { bookmarksCommand } from './bookmarks.js';
import { statsCommand } from './stats.js';

export { importCommand, resumeCommand, openCommand, libraryCommand, removeCommand, langCommand, updateCommand, configCommand, syncCommand, bookmarksCommand, statsCommand };
export const commands = [importCommand, resumeCommand, openCommand, libraryCommand, removeCommand, langCommand, updateCommand, configCommand, syncCommand, bookmarksCommand, statsCommand];
