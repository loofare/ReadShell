# 版本日志

## [1.0.0] - 2026-09-23

### 新增
- 文件夹同步：`novel sync --dir <path> [--with-books]`，通过 iCloud / Dropbox / OneDrive / 坚果云 / Syncthing 等任意同步盘在多设备间同步进度、书签（含删除墓碑）与阅读统计；打开/退出阅读器时自动同步
- `novel stats`：GitHub 风格终端热力图（近一年，宽度自适应）+ 阅读天数、总时长、书籍数、当前/最长连续天数
- `novel bookmarks export --format json|md`：导出全部书签（免费功能）
- Markdown (.md) 导入支持
- `g` / `G` 跳转首页/末页，`?` 帮助浮层
- 老板键多语言伪装：nodejs / python / java / c / go（`novel config boss-key-lang`）
- 阅读会话记录（reading_sessions），为统计与跨设备聚合提供数据
- `READSHELL_HOME` 环境变量可覆盖数据目录
- `readshell` 作为 `novel` 的别名命令

### 变更
- 许可证从 AGPL-3.0 改为 MIT
- 移除云账号体系（login/logout、云端同步、tier 订阅）；书签导出与同步对所有用户免费
- 配置文件迁移到数据目录（`getAppDataDir()/config.json`），旧配置自动迁移，遗留 auth*/lastSyncAt 键自动清理
- `novel update` 指向 `readshell` 包

### 迁移
- readshell-pro 用户：`npm uninstall -g readshell-pro && npm install -g readshell`，本地数据保留

## [0.1.0] - 2026-03-15

### 新增
- 项目初始化
- 基础目录结构搭建
- CLI 命令骨架: `import`, `resume`, `open`, `library`
- SQLite 数据库 schema 和迁移系统
- TUI 组件骨架 (Ink)
- TXT 解析器（含编码检测和章节切割）
- 分页算法（支持中英文混排）
