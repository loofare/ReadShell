/**
 * 文件夹同步的数据结构
 * 每台设备在 <syncDir>/readshell-sync/devices/<deviceId>.json 写一份自己的快照，
 * 书籍身份 = 文件 SHA-256 hash（同一文件跨设备可映射）。
 */

export interface SyncBookEntry {
  /** 文件 hash，即书籍的跨设备身份 */
  hash: string;
  title: string;
  author: string | null;
  format: string;
  size: number | null;
}

export interface SyncProgressEntry {
  bookId: string;
  byteOffset: number;
  percentage: number;
  /** 本地 updated_at 的 ISO 时间，last-write-wins 依据 */
  clientUpdatedAt: string;
}

/** 书签 id 是确定性的：`${bookId}:${byteOffset}` */
export interface SyncBookmarkEntry {
  id: string;
  bookId: string;
  byteOffset: number;
  label: string | null;
  /** 墓碑：远端已删除 */
  deleted: boolean;
  /** 最近一次变更（新增或删除）的 ISO 时间 */
  updatedAt: string;
  createdAt: string;
}

/** 一段连续阅读会话；id 由客户端生成，全局唯一 */
export interface SyncSessionEntry {
  id: string;
  bookId: string;
  startedAt: string;
  endedAt: string;
  bytesRead: number;
}

/** <syncDir>/readshell-sync/devices/<deviceId>.json 的文件格式 */
export interface DeviceSyncFile {
  schemaVersion: number;
  deviceId: string;
  deviceName: string;
  updatedAt: string;
  books: SyncBookEntry[];
  progress: SyncProgressEntry[];
  bookmarks: SyncBookmarkEntry[];
  sessions: SyncSessionEntry[];
}
