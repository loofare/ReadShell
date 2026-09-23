/**
 * 文件夹同步服务
 *
 * 无服务器同步：每台设备在 <syncDir>/readshell-sync/devices/<deviceId>.json
 * 写一份自己的数据快照（原子写入：tmp + rename），再读取其他设备的文件做合并。
 * 目录本身交给 iCloud / Dropbox / OneDrive / 坚果云 / Syncthing 等任意同步盘。
 *
 * 合并规则：
 * - 书籍身份 = 文件 hash
 * - 进度：按 clientUpdatedAt 与本地 updated_at 做 last-write-wins
 * - 书签：按 `${hash}:${byteOffset}` 做 LWW，含删除墓碑
 * - 会话：按 id 求并集（stats 因此能跨设备聚合）
 * - 本地没有的书：条目保留在对方文件里，但不写入本地（不产生孤儿数据）
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, renameSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { hostname } from 'node:os';
import { getDeviceId, getSyncDir, setSyncDir, clearSyncDir } from '../config/AppConfig.js';
import { ProgressModel, type ProgressRecord } from '../db/models/Progress.js';
import { BookmarkModel, type BookmarkRecord } from '../db/models/Bookmark.js';
import { BookModel, type BookRecord } from '../db/models/Book.js';
import { ReadingSessionModel } from '../db/models/ReadingSession.js';
import { BookService } from './BookService.js';
import { computeFileHash } from '../utils/hash.js';
import { logger } from '../utils/logger.js';
import type {
  DeviceSyncFile,
  SyncBookEntry,
  SyncBookmarkEntry,
  SyncProgressEntry,
  SyncSessionEntry,
} from '../types/sync.js';

const SYNC_ROOT = 'readshell-sync';
const SCHEMA_VERSION = 1;

export interface SyncResult {
  /** 合并进本地的条目数（进度 + 书签 + 会话 + 导入的书） */
  pulled: number;
  /** 本次读到的其他设备文件数 */
  devices: number;
  /** 因损坏被跳过的设备文件数 */
  skipped: number;
}

export interface SyncOptions {
  /** 同时把书源文件拷进 <syncDir>/readshell-sync/books/，并从那里补拉缺失的书 */
  withBooks?: boolean;
}

function isValidDeviceFile(data: unknown): data is DeviceSyncFile {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d['deviceId'] === 'string' &&
    Array.isArray(d['books']) &&
    Array.isArray(d['progress']) &&
    Array.isArray(d['bookmarks']) &&
    Array.isArray(d['sessions'])
  );
}

function toMillis(iso: unknown): number | null {
  if (typeof iso !== 'string') return null;
  const ms = new Date(iso).getTime();
  return Number.isNaN(ms) ? null : ms;
}

/**
 * 把一台远端设备的快照合并进本地 SQLite（纯数据操作，便于单测）
 * 返回应用的条目数
 */
export function mergeRemoteDevice(
  remote: DeviceSyncFile,
  deps: {
    findBookByHash: (hash: string) => BookRecord | undefined;
    findProgress: (bookId: string) => ProgressRecord | undefined;
    upsertProgress: (progress: ProgressRecord) => void;
    findBookmarkByOffset: (bookId: string, byteOffset: number) => BookmarkRecord | undefined;
    saveBookmark: (bookmark: Omit<BookmarkRecord, 'id'>) => void;
    insertSession: (session: { id: string; book_id: string; started_at: number; ended_at: number; bytes_read: number }) => boolean;
  },
): number {
  let count = 0;

  for (const p of remote.progress) {
    if (typeof p?.bookId !== 'string') continue;
    const book = deps.findBookByHash(p.bookId);
    if (!book) continue;

    const remoteTs = toMillis(p.clientUpdatedAt);
    if (remoteTs === null) continue;

    const local = deps.findProgress(book.id);
    // 远端不新于本地 → 本地赢，跳过
    if (local && remoteTs <= local.updated_at) continue;

    deps.upsertProgress({
      book_id: book.id,
      chapter_no: local?.chapter_no ?? 0,
      byte_offset: p.byteOffset,
      percent: p.percentage,
      updated_at: remoteTs,
      // opened_at 只在远端更新时才前移
      opened_at: Math.max(local?.opened_at ?? 0, remoteTs),
    });
    count++;
  }

  for (const b of remote.bookmarks) {
    if (typeof b?.bookId !== 'string' || typeof b?.byteOffset !== 'number') continue;
    const book = deps.findBookByHash(b.bookId);
    if (!book) continue;

    const remoteTs = toMillis(b.updatedAt) ?? toMillis(b.createdAt);
    if (remoteTs === null) continue;

    const local = deps.findBookmarkByOffset(book.id, b.byteOffset);
    // 远端不新于本地 → 本地赢，跳过
    if (local && remoteTs <= local.updated_at) continue;

    const createdAt = toMillis(b.createdAt) ?? remoteTs;
    deps.saveBookmark({
      book_id: book.id,
      title: b.label ?? '',
      byte_offset: b.byteOffset,
      created_at: createdAt,
      updated_at: remoteTs,
      deleted: b.deleted ? 1 : 0,
    });
    count++;
  }

  for (const s of remote.sessions) {
    if (typeof s?.id !== 'string' || typeof s?.bookId !== 'string') continue;
    const book = deps.findBookByHash(s.bookId);
    if (!book) continue;

    const startedAt = toMillis(s.startedAt);
    const endedAt = toMillis(s.endedAt);
    if (startedAt === null || endedAt === null) continue;

    if (
      deps.insertSession({
        id: s.id,
        book_id: book.id,
        started_at: startedAt,
        ended_at: endedAt,
        bytes_read: typeof s.bytesRead === 'number' ? s.bytesRead : 0,
      })
    ) {
      count++;
    }
  }

  return count;
}

export class SyncFolderService {
  private readonly deviceId = getDeviceId();

  constructor(private readonly syncDir: string) {}

  private get rootDir(): string {
    return join(this.syncDir, SYNC_ROOT);
  }

  private get devicesDir(): string {
    return join(this.rootDir, 'devices');
  }

  private get booksDir(): string {
    return join(this.rootDir, 'books');
  }

  private get ownFile(): string {
    return join(this.devicesDir, `${this.deviceId}.json`);
  }

  /**
   * 收集本机快照
   */
  private collectLocal(): DeviceSyncFile {
    const bookModel = new BookModel();
    const progressModel = new ProgressModel();
    const bookmarkModel = new BookmarkModel();
    const sessionModel = new ReadingSessionModel();

    const books: SyncBookEntry[] = [];
    const progress: SyncProgressEntry[] = [];
    const bookmarks: SyncBookmarkEntry[] = [];

    for (const book of bookModel.findAll()) {
      books.push({
        hash: book.file_hash,
        title: book.title,
        author: book.author,
        format: book.format,
        size: book.file_size,
      });

      const p = progressModel.findByBookId(book.id);
      if (p) {
        progress.push({
          bookId: book.file_hash,
          byteOffset: p.byte_offset,
          percentage: p.percent,
          clientUpdatedAt: new Date(p.updated_at).toISOString(),
        });
      }

      for (const b of bookmarkModel.findAllByBookId(book.id)) {
        bookmarks.push({
          id: `${book.file_hash}:${b.byte_offset}`,
          bookId: book.file_hash,
          byteOffset: b.byte_offset,
          label: b.title,
          deleted: b.deleted === 1,
          updatedAt: new Date(b.updated_at || b.created_at).toISOString(),
          createdAt: new Date(b.created_at).toISOString(),
        });
      }
    }

    const sessions: SyncSessionEntry[] = [];
    for (const s of sessionModel.findAll()) {
      const book = bookModel.findById(s.book_id);
      if (!book) continue; // 书籍已删，跳过
      sessions.push({
        id: s.id,
        bookId: book.file_hash,
        startedAt: new Date(s.started_at).toISOString(),
        endedAt: new Date(s.ended_at).toISOString(),
        bytesRead: s.bytes_read,
      });
    }

    return {
      schemaVersion: SCHEMA_VERSION,
      deviceId: this.deviceId,
      deviceName: hostname(),
      updatedAt: new Date().toISOString(),
      books,
      progress,
      bookmarks,
      sessions,
    };
  }

  /**
   * 原子写入本机设备文件（tmp + rename，避免同步盘读到半截文件）
   */
  private writeOwnFile(): void {
    mkdirSync(this.devicesDir, { recursive: true });
    const data = this.collectLocal();
    const tmp = `${this.ownFile}.tmp`;
    writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8');
    renameSync(tmp, this.ownFile);
  }

  /**
   * 读取所有其他设备文件；损坏/半截 JSON 跳过并记 debug 日志
   */
  private readRemoteFiles(): { files: DeviceSyncFile[]; skipped: number } {
    const files: DeviceSyncFile[] = [];
    let skipped = 0;

    let names: string[] = [];
    try {
      names = readdirSync(this.devicesDir);
    } catch {
      return { files, skipped };
    }

    for (const name of names) {
      if (!name.endsWith('.json') || name === `${this.deviceId}.json`) continue;
      try {
        const parsed: unknown = JSON.parse(readFileSync(join(this.devicesDir, name), 'utf-8'));
        if (!isValidDeviceFile(parsed)) {
          skipped++;
          logger.debug(`同步：跳过格式非法的设备文件 ${name}`);
          continue;
        }
        files.push(parsed);
      } catch (err) {
        skipped++;
        logger.debug(`同步：跳过损坏的设备文件 ${name}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    return { files, skipped };
  }

  private mergeDeps() {
    const progressModel = new ProgressModel();
    const bookmarkModel = new BookmarkModel();
    const bookModel = new BookModel();
    const sessionModel = new ReadingSessionModel();

    return {
      findBookByHash: (hash: string) => bookModel.findByHash(hash),
      findProgress: (bookId: string) => progressModel.findByBookId(bookId),
      upsertProgress: (p: ProgressRecord) => progressModel.upsert(p),
      findBookmarkByOffset: (bookId: string, offset: number) => bookmarkModel.findByOffsetAny(bookId, offset),
      saveBookmark: (b: Omit<BookmarkRecord, 'id'>) => bookmarkModel.saveByOffset(b),
      insertSession: (s: { id: string; book_id: string; started_at: number; ended_at: number; bytes_read: number }) =>
        sessionModel.insertIfAbsent(s),
    };
  }

  /**
   * 把本地书源文件拷进 books/（--with-books），已存在则跳过
   */
  private pushBookFiles(): void {
    const bookModel = new BookModel();
    mkdirSync(this.booksDir, { recursive: true });

    for (const book of bookModel.findAll()) {
      const target = join(this.booksDir, `${book.file_hash}.${book.format}`);
      if (existsSync(target)) continue;
      try {
        if (existsSync(book.file_path)) {
          copyFileSync(book.file_path, target);
        }
      } catch (err) {
        logger.debug(`同步：拷贝书源文件失败 ${book.title}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  /**
   * 远端有记录但本地没有的书，从 books/ 目录自动导入（--with-books）
   * 返回导入数量
   */
  private async pullBookFiles(remoteFiles: DeviceSyncFile[]): Promise<number> {
    const bookModel = new BookModel();
    const bookService = new BookService();
    let imported = 0;

    const wanted = new Map<string, SyncBookEntry>();
    for (const remote of remoteFiles) {
      for (const b of remote.books) {
        if (typeof b?.hash === 'string' && !wanted.has(b.hash)) {
          wanted.set(b.hash, b);
        }
      }
    }

    for (const [hash, entry] of wanted) {
      if (bookModel.findByHash(hash)) continue;
      const ext = entry.format || 'txt';

      const candidate = join(this.booksDir, `${hash}.${ext}`);
      if (!existsSync(candidate)) continue;
      try {
        // 校验文件 hash 与记录一致再导入
        const actual = await computeFileHash(candidate);
        if (actual !== hash) {
          logger.debug(`同步：books/${hash}.${ext} hash 不匹配，跳过`);
          continue;
        }
        const book = await bookService.importBook(candidate);
        // 文件名是 hash，导入后用远端元数据恢复书名/作者
        bookModel.updateMeta(book.id, entry.title, entry.author);
        imported++;
      } catch (err) {
        logger.debug(`同步：导入 ${candidate} 失败: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    return imported;
  }

  /**
   * 只拉取：读取其他设备文件并合并（阅读器打开时调用）
   */
  async pull(options: SyncOptions = {}): Promise<SyncResult> {
    const { files, skipped } = this.readRemoteFiles();

    let pulled = 0;
    if (options.withBooks) {
      pulled += await this.pullBookFiles(files);
    }

    const deps = this.mergeDeps();
    for (const remote of files) {
      pulled += mergeRemoteDevice(remote, deps);
    }

    return { pulled, devices: files.length, skipped };
  }

  /**
   * 完整同步：先写本机快照（push），再合并其他设备（pull）
   */
  async sync(options: SyncOptions = {}): Promise<SyncResult> {
    mkdirSync(this.devicesDir, { recursive: true });
    this.writeOwnFile();
    if (options.withBooks) {
      this.pushBookFiles();
    }
    return this.pull(options);
  }
}

/**
 * 已配置同步目录时返回服务实例，否则 null
 */
export function createFolderSyncService(): SyncFolderService | null {
  const dir = getSyncDir();
  if (!dir) return null;
  return new SyncFolderService(dir);
}

/**
 * 打开阅读器前的拉取：已配置同步目录时合并其他设备数据，最多等待 timeoutMs，静默失败
 */
export async function syncOnOpen(timeoutMs = 2000): Promise<void> {
  const service = createFolderSyncService();
  if (!service) return;
  await Promise.race([
    service.pull().catch(() => {}),
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}

