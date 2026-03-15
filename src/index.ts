#!/usr/bin/env node

/**
 * ReadShell — 终端内低打断轻阅读工具
 * 程序主入口，解析 argv，路由到子命令
 */

import { createParser } from './cli/parser.js';
import { initDatabase } from './db/migrate.js';
import { initI18n } from './locales/index.js';
import { logger } from './utils/logger.js';

async function main() {
  try {
    // 初始化数据库（自动建表/迁移）
    initDatabase();
    
    // 初始化多语言本地化模块
    initI18n();

    // 解析命令行参数并执行对应命令
    const parser = createParser();
    await parser.parse();
  } catch (error) {
    logger.error('程序启动失败:', error);
    process.exit(1);
  }
}

main();
