-- ReadShell 数据库 Schema
-- 版本: 1

-- 书籍元数据
CREATE TABLE IF NOT EXISTS books (
  id          TEXT PRIMARY KEY,   -- nanoid
  title       TEXT NOT NULL,
  author      TEXT,
  file_path   TEXT NOT NULL,
  format      TEXT NOT NULL,      -- 'txt' | 'epub'
  file_hash   TEXT NOT NULL,      -- 去重用
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
CREATE INDEX IF NOT EXISTS idx_recent_opened ON recent_reads(opened_at DESC);
