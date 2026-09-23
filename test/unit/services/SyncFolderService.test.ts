/**
 * SyncFolderService 合并逻辑单元测试
 * 覆盖：进度 LWW、书签墓碑传播、孤儿数据跳过、损坏设备文件容忍
 * 数据目录由 test/setup.ts 的 READSHELL_HOME 隔离到临时目录
 */

import { describe, it, expect } from 'vitest';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mergeRemoteDevice, SyncFolderService } from '../../../src/services/SyncFolderService.js';
import { initDatabase } from '../../../src/db/migrate.js';
import { BookModel, type BookRecord } from '../../../src/db/models/Book.js';
import { ProgressModel, type ProgressRecord } from '../../../src/db/models/Progress.js';
import type { BookmarkRecord } from '../../../src/db/models/Bookmark.js';
import type { DeviceSyncFile } from '../../../src/types/sync.js';

function makeBook(id: string, hash: string): BookRecord {
  return {
    id,
    title: `书-${id}`,
    author: null,
    file_path: `/tmp/${id}.txt`,
    format: 'txt',
    file_hash: hash,
    file_size: 1000,
    created_at: 0,
  };
}

function makeRemote(overrides: Partial<DeviceSyncFile> = {}): DeviceSyncFile {
  return {
    schemaVersion: 1,
    deviceId: 'device-b',
    deviceName: 'B',
    updatedAt: new Date().toISOString(),
    books: [],
    progress: [],
    bookmarks: [],
    sessions: [],
    ...overrides,
  };
}

function makeDeps() {
  const books = new Map<string, BookRecord>();
  const progress = new Map<string, ProgressRecord>();
  const bookmarks = new Map<string, BookmarkRecord>();
  const sessions = new Set<string>();
  const upserted: ProgressRecord[] = [];
  const savedBookmarks: BookmarkRecord[] = [];
  const insertedSessions: string[] = [];

  const bmKey = (bookId: string, offset: number) => `${bookId}:${offset}`;

  return {
    books,
    progress,
    bookmarks,
    sessions,
    upserted,
    savedBookmarks,
    insertedSessions,
    fns: {
      findBookByHash: (hash: string) => books.get(hash),
      findProgress: (bookId: string) => progress.get(bookId),
      upsertProgress: (p: ProgressRecord) => {
        progress.set(p.book_id, p);
        upserted.push(p);
      },
      findBookmarkByOffset: (bookId: string, offset: number) => bookmarks.get(bmKey(bookId, offset)),
      saveBookmark: (b: Omit<BookmarkRecord, 'id'>) => {
        bookmarks.set(bmKey(b.book_id, b.byte_offset), b as BookmarkRecord);
        savedBookmarks.push(b as BookmarkRecord);
      },
      insertSession: (s: { id: string }) => {
        if (sessions.has(s.id)) return false;
        sessions.add(s.id);
        insertedSessions.push(s.id);
        return true;
      },
    },
  };
}

describe('mergeRemoteDevice', () => {
  it('远端进度更新时按 hash 映射本地书籍并覆盖（LWW）', () => {
    const deps = makeDeps();
    deps.books.set('hashA', makeBook('b1', 'hashA'));
    deps.progress.set('b1', {
      book_id: 'b1', chapter_no: 2, byte_offset: 100, percent: 0.1,
      updated_at: 1000, opened_at: 500,
    });

    const count = mergeRemoteDevice(makeRemote({
      progress: [{
        bookId: 'hashA', byteOffset: 500, percentage: 0.5,
        clientUpdatedAt: new Date(2000).toISOString(),
      }],
    }), deps.fns);

    expect(count).toBe(1);
    const p = deps.progress.get('b1')!;
    expect(p.byte_offset).toBe(500);
    expect(p.updated_at).toBe(2000);
    // opened_at 前移但不回退
    expect(p.opened_at).toBe(2000);
    // chapter_no 保留本地值
    expect(p.chapter_no).toBe(2);
  });

  it('本地进度更新时远端旧数据被跳过', () => {
    const deps = makeDeps();
    deps.books.set('hashA', makeBook('b1', 'hashA'));
    deps.progress.set('b1', {
      book_id: 'b1', chapter_no: 0, byte_offset: 900, percent: 0.9,
      updated_at: 5000, opened_at: 4000,
    });

    const count = mergeRemoteDevice(makeRemote({
      progress: [{
        bookId: 'hashA', byteOffset: 100, percentage: 0.1,
        clientUpdatedAt: new Date(2000).toISOString(),
      }],
    }), deps.fns);

    expect(count).toBe(0);
    expect(deps.progress.get('b1')!.byte_offset).toBe(900);
    expect(deps.progress.get('b1')!.opened_at).toBe(4000);
  });

  it('本地没有的书：进度/书签/会话全部跳过（不产生孤儿数据）', () => {
    const deps = makeDeps();

    const count = mergeRemoteDevice(makeRemote({
      progress: [{ bookId: 'ghost', byteOffset: 1, percentage: 0.1, clientUpdatedAt: new Date().toISOString() }],
      bookmarks: [{ id: 'ghost:0', bookId: 'ghost', byteOffset: 0, label: 'x', deleted: false, updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() }],
      sessions: [{ id: 's1', bookId: 'ghost', startedAt: new Date().toISOString(), endedAt: new Date().toISOString(), bytesRead: 10 }],
    }), deps.fns);

    expect(count).toBe(0);
    expect(deps.upserted).toHaveLength(0);
    expect(deps.savedBookmarks).toHaveLength(0);
    expect(deps.insertedSessions).toHaveLength(0);
  });

  it('书签墓碑：远端 deleted 覆盖本地书签，远端较旧则保留本地', () => {
    const deps = makeDeps();
    deps.books.set('hashA', makeBook('b1', 'hashA'));
    deps.bookmarks.set('b1:100', {
      book_id: 'b1', title: '本地书签', byte_offset: 100,
      created_at: 1000, updated_at: 3000, deleted: 0,
    });

    // 远端墓碑更新（4000 > 3000）→ 本地被标记删除
    const count = mergeRemoteDevice(makeRemote({
      bookmarks: [{
        id: 'hashA:100', bookId: 'hashA', byteOffset: 100, label: null,
        deleted: true, updatedAt: new Date(4000).toISOString(), createdAt: new Date(1000).toISOString(),
      }],
    }), deps.fns);

    expect(count).toBe(1);
    expect(deps.bookmarks.get('b1:100')!.deleted).toBe(1);

    // 远端更旧的活跃书签（2000 < 4000）→ 墓碑保留
    const count2 = mergeRemoteDevice(makeRemote({
      bookmarks: [{
        id: 'hashA:100', bookId: 'hashA', byteOffset: 100, label: '旧书签',
        deleted: false, updatedAt: new Date(2000).toISOString(), createdAt: new Date(1000).toISOString(),
      }],
    }), deps.fns);

    expect(count2).toBe(0);
    expect(deps.bookmarks.get('b1:100')!.deleted).toBe(1);
  });

  it('远端新书签插入本地；会话按 id 去重合并', () => {
    const deps = makeDeps();
    deps.books.set('hashA', makeBook('b1', 'hashA'));
    deps.sessions.add('dup');

    const remote = makeRemote({
      bookmarks: [{
        id: 'hashA:42', bookId: 'hashA', byteOffset: 42, label: '远端书签',
        deleted: false, updatedAt: new Date(1000).toISOString(), createdAt: new Date(1000).toISOString(),
      }],
      sessions: [
        { id: 'dup', bookId: 'hashA', startedAt: new Date(100).toISOString(), endedAt: new Date(200).toISOString(), bytesRead: 5 },
        { id: 'new', bookId: 'hashA', startedAt: new Date(300).toISOString(), endedAt: new Date(400).toISOString(), bytesRead: 5 },
      ],
    });

    expect(mergeRemoteDevice(remote, deps.fns)).toBe(2);
    expect(deps.bookmarks.get('b1:42')!.title).toBe('远端书签');
    expect(deps.insertedSessions).toEqual(['new']);
  });
});

describe('SyncFolderService 文件层', () => {
  it('sync 写入本机设备文件，合并远端文件并容忍损坏 JSON', async () => {
    initDatabase();

    const syncDir = mkdtempSync(join(tmpdir(), 'readshell-sync-'));
    try {
      const bookModel = new BookModel();
      const progressModel = new ProgressModel();

      const book = makeBook(`b-${Date.now()}`, `hash-${Date.now()}`);
      bookModel.insert(book);
      progressModel.upsert({
        book_id: book.id, chapter_no: 0, byte_offset: 10, percent: 0.01,
        updated_at: 1000, opened_at: 1000,
      });

      // 伪造另一台设备的快照 + 一个损坏文件
      const devicesDir = join(syncDir, 'readshell-sync', 'devices');
      mkdirSync(devicesDir, { recursive: true });
      writeFileSync(join(devicesDir, 'other-device.json'), JSON.stringify(makeRemote({
        deviceId: 'other-device',
        books: [{ hash: book.file_hash, title: book.title, author: null, format: 'txt', size: 1000 }],
        progress: [{
          bookId: book.file_hash, byteOffset: 777, percentage: 0.77,
          clientUpdatedAt: new Date(9999).toISOString(),
        }],
      })));
      writeFileSync(join(devicesDir, 'broken.json'), '{ not json !!!');

      const service = new SyncFolderService(syncDir);
      const result = await service.sync();

      expect(result.devices).toBe(1);
      expect(result.skipped).toBe(1);

      // 远端更新的进度被合并
      const merged = progressModel.findByBookId(book.id)!;
      expect(merged.byte_offset).toBe(777);
      expect(merged.updated_at).toBe(9999);

      // 本机设备文件已写入且可解析
      const own = readdirSync(devicesDir).find((n) => n !== 'other-device.json' && n !== 'broken.json');
      expect(own).toBeTruthy();
      const ownData = JSON.parse(readFileSync(join(devicesDir, own!), 'utf-8')) as DeviceSyncFile;
      expect(ownData.deviceId).toBeTruthy();
      expect(ownData.books[0]!.hash).toBe(book.file_hash);
    } finally {
      rmSync(syncDir, { recursive: true, force: true });
    }
  });
});
