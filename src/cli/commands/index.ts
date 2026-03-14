/**
 * 命令注册统一导出
 */

import { importCommand } from './import.js';
import { resumeCommand } from './resume.js';
import { openCommand } from './open.js';
import { libraryCommand } from './library.js';
import { removeCommand } from './remove.js';

export const commands = [importCommand, resumeCommand, openCommand, libraryCommand, removeCommand];
