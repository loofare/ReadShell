-- ReadShell 数据库 Schema
-- 版本: 4

-- 书籍元数据
CREATE TABLE IF NOT EXISTS books (
  id          TEXT PRIMARY KEY,   -- nanoid
  title       TEXT NOT NULL,
  author      TEXT,
  file_path   TEXT NOT NULL,
  format      TEXT NOT NULL,      -- 'txt' | 'epub' | 'md'
  file_hash   TEXT NOT NULL,      -- 去重与跨设备身份
  file_size   INTEGER,
  created_at  INTEGER NOT NULL    -- unix timestamp
);

-- 核心状态表（resume 的数据基础）
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

-- 章节索引（快速跳转与续读加速）
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

-- 书签管理（v2；v4 增加 updated_at/deleted 墓碑以支持文件夹同步）
CREATE TABLE IF NOT EXISTS bookmarks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id     TEXT NOT NULL REFERENCES books(id),
  title       TEXT NOT NULL,
  byte_offset INTEGER NOT NULL,
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL DEFAULT 0,
  deleted     INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_book ON bookmarks(book_id);

-- 阅读会话（v3；v4 移除 synced 列，文件夹同步按 id 去重合并）
CREATE TABLE IF NOT EXISTS reading_sessions (
  id         TEXT PRIMARY KEY,   -- uuid
  book_id    TEXT NOT NULL REFERENCES books(id),
  started_at INTEGER NOT NULL,
  ended_at   INTEGER NOT NULL,
  bytes_read INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_sessions_book ON reading_sessions(book_id);
CREATE INDEX IF NOT EXISTS idx_recent_opened ON recent_reads(opened_at DESC);
