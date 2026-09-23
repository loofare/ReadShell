# ReadShell 架构说明

## 整体架构

ReadShell 采用分层架构，自上而下分为：

```
CLI 命令层 → TUI 展示层 → 业务逻辑层 → 数据访问层
```

### 1. CLI 命令层 (`src/cli/`)
- 使用 yargs 解析命令行参数
- 将用户输入路由到对应的命令处理函数
- 子命令: `import`, `resume`, `open`, `list`, `remove`, `lang`, `config`, `update`, `sync`, `bookmarks`, `stats`

### 2. TUI 展示层 (`src/ui/`)
- 使用 Ink (React 范式) 构建终端 UI
- 组件树: App → Pages → Components
- Hooks 管理阅读器状态、键盘事件、终端尺寸

### 3. 业务逻辑层 (`src/services/`)
- BookService: 书籍导入、去重、CRUD
- ProgressService: 进度保存与恢复（resume 核心）
- ChapterService: 章节索引管理
- RecentService: 最近阅读排序
- BookmarkService: 书签管理（删除写墓碑）
- SyncFolderService: 文件夹同步（见下）
- StatsService: 阅读统计聚合与热力图渲染

### 4. 数据访问层 (`src/db/`)
- SQLite (better-sqlite3) 同步 API
- 版本化迁移系统（当前 schema v4）
- Model 层封装表操作

### 5. 文件解析层 (`src/parsers/`)
- TxtParser: 编码自动检测 + 章节切割（md 按纯文本处理）
- EpubParser: 元数据 + 章节提取

## 数据流

```
用户输入 → CLI 解析 → Service 处理 → DB 读写
                    → Parser 解析文件
                    → TUI 渲染展示
```

## 文件夹同步

无服务器多设备同步。每台设备把自己的快照写入
`<syncDir>/readshell-sync/devices/<deviceId>.json`（tmp + rename 原子写入），
再读取并合并其他设备的文件。目录本身交给 iCloud / Dropbox / 坚果云 / Syncthing 等同步盘。

- 书籍身份 = 文件 SHA-256 hash
- 进度：按 `clientUpdatedAt` 与本地 `updated_at` 做 last-write-wins
- 书签：按 `${hash}:${byteOffset}` 做 LWW，本地删除写墓碑（`deleted=1`）以传播删除
- 阅读会话：按 id 求并集，`novel stats` 因此能跨设备聚合
- 本地没有的书：远端条目保留在对方文件里但不写入本地（不产生孤儿数据）
- `--with-books`：书源文件拷入 `readshell-sync/books/<hash>.<ext>`，其他设备自动导入缺失的书
- 损坏/半截 JSON 设备文件跳过并记 debug 日志
- 打开阅读器时自动 pull、退出时自动 push+pull（`pendingSync` 注册，最多等 ~2s，静默失败）

## 关键设计决策

1. **本地优先**: 所有数据存储在本地 SQLite，无网络依赖、无账号体系
2. **同步 API**: better-sqlite3 同步接口简化 CLI 工具的控制流
3. **组件化 TUI**: Ink 的 React 范式使终端 UI 可复用、可测试
4. **版本化迁移**: 数据库 schema 变更通过增量迁移管理
5. **墓碑删除**: 书签删除不物理移除，保证文件夹同步能传播删除事件
