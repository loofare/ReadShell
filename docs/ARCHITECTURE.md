# ReadShell 架构说明

## 整体架构

ReadShell 采用分层架构，自上而下分为：

```
CLI 命令层 → TUI 展示层 → 业务逻辑层 → 数据访问层
```

### 1. CLI 命令层 (`src/cli/`)
- 使用 yargs 解析命令行参数
- 将用户输入路由到对应的命令处理函数
- 子命令: `import`, `resume`, `open`, `library`

### 2. TUI 展示层 (`src/ui/`)
- 使用 Ink (React 范式) 构建终端 UI
- 组件树: App → Pages → Components
- Hooks 管理阅读器状态、键盘事件、终端尺寸

### 3. 业务逻辑层 (`src/services/`)
- BookService: 书籍导入、去重、CRUD
- ProgressService: 进度保存与恢复（resume 核心）
- ChapterService: 章节索引管理
- RecentService: 最近阅读排序

### 4. 数据访问层 (`src/db/`)
- SQLite (better-sqlite3) 同步 API
- 版本化迁移系统
- Model 层封装表操作

### 5. 文件解析层 (`src/parsers/`)
- TxtParser: 编码自动检测 + 章节切割
- EpubParser: 元数据 + 章节提取（P1）

## 数据流

```
用户输入 → CLI 解析 → Service 处理 → DB 读写
                    → Parser 解析文件
                    → TUI 渲染展示
```

## 关键设计决策

1. **本地优先**: 所有数据存储在本地 SQLite，无网络依赖
2. **同步 API**: better-sqlite3 同步接口简化 CLI 工具的控制流
3. **组件化 TUI**: Ink 的 React 范式使终端 UI 可复用、可测试
4. **版本化迁移**: 数据库 schema 变更通过增量迁移管理
