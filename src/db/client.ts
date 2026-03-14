/**
 * SQLite 数据库连接初始化
 * 使用 better-sqlite3 同步 API
 */

import Database from 'better-sqlite3';
import { getDbPath } from '../config/paths.js';
import { logger } from '../utils/logger.js';

let db: Database.Database | null = null;

/**
 * 获取数据库连接实例（单例模式）
 */
export function getDb(): Database.Database {
  if (!db) {
    const dbPath = getDbPath();
    logger.debug(`数据库路径: ${dbPath}`);

    db = new Database(dbPath);

    // 启用 WAL 模式以提升写入性能
    db.pragma('journal_mode = WAL');
    // 启用外键约束
    db.pragma('foreign_keys = ON');
  }

  return db;
}

/**
 * 关闭数据库连接
 */
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
    logger.debug('数据库连接已关闭');
  }
}

// 进程退出时自动关闭数据库
process.on('exit', () => closeDb());
process.on('SIGINT', () => {
  closeDb();
  process.exit(0);
});
process.on('SIGTERM', () => {
  closeDb();
  process.exit(0);
});
