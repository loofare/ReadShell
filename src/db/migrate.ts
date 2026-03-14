/**
 * 数据库迁移逻辑
 * 程序启动时检查并执行建表/迁移
 */

import { getDb } from './client.js';
import { logger } from '../utils/logger.js';

const SCHEMA_VERSION = 1;

/**
 * 初始化数据库（建表 + 版本管理）
 */
export function initDatabase(): void {
  const db = getDb();

  // 创建版本管理表
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY
    );
  `);

  const row = db.prepare('SELECT version FROM schema_version LIMIT 1').get() as
    | { version: number }
    | undefined;
  const currentVersion = row?.version ?? 0;

  if (currentVersion < SCHEMA_VERSION) {
    logger.debug(`数据库迁移: v${currentVersion} → v${SCHEMA_VERSION}`);
    migrate(db, currentVersion);
  }
}

function migrate(db: ReturnType<typeof getDb>, fromVersion: number): void {
  const migrations: Record<number, string> = {
    1: `
      -- 书籍元数据
      CREATE TABLE IF NOT EXISTS books (
        id          TEXT PRIMARY KEY,
        title       TEXT NOT NULL,
        author      TEXT,
        file_path   TEXT NOT NULL,
        format      TEXT NOT NULL,
        file_hash   TEXT NOT NULL,
        file_size   INTEGER,
        created_at  INTEGER NOT NULL
      );

      -- 核心状态表
      CREATE TABLE IF NOT EXISTS reading_progress (
        book_id     TEXT PRIMARY KEY REFERENCES books(id),
        chapter_no  INTEGER NOT NULL DEFAULT 0,
        byte_offset INTEGER NOT NULL DEFAULT 0,
        percent     REAL NOT NULL DEFAULT 0,
        updated_at  INTEGER NOT NULL,
        opened_at   INTEGER NOT NULL
      );

      -- 最近阅读排序
      CREATE TABLE IF NOT EXISTS recent_reads (
        book_id     TEXT PRIMARY KEY REFERENCES books(id),
        opened_at   INTEGER NOT NULL,
        open_count  INTEGER NOT NULL DEFAULT 1
      );

      -- 章节索引
      CREATE TABLE IF NOT EXISTS chapter_index (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id     TEXT NOT NULL REFERENCES books(id),
        chapter_no  INTEGER NOT NULL,
        title       TEXT,
        byte_offset INTEGER NOT NULL,
        UNIQUE(book_id, chapter_no)
      );

      -- 索引
      CREATE INDEX IF NOT EXISTS idx_chapter_book ON chapter_index(book_id);
      CREATE INDEX IF NOT EXISTS idx_recent_opened ON recent_reads(opened_at DESC);
    `,
  };

  db.transaction(() => {
    for (let v = fromVersion + 1; v <= SCHEMA_VERSION; v++) {
      const sql = migrations[v];
      if (sql) {
        db.exec(sql);
        logger.debug(`已执行迁移 v${v}`);
      }
    }

    // 更新版本号
    db.prepare('DELETE FROM schema_version').run();
    db.prepare('INSERT INTO schema_version (version) VALUES (?)').run(SCHEMA_VERSION);
  })();
}
