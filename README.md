# ReadShell

> 终端内低打断轻阅读工具 · CLI Light Reading Tool for Developers

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org)

---

## 🎯 解决什么问题

ReadShell 解决的不是「没有地方看书」，而是：

**开发间隙，你缺少一个不会把自己拖离工作流的短时休息入口。**

| 现有替代方案 | 问题 |
|---|---|
| 刷手机 | 打开就停不下来，10 分钟变 40 分钟 |
| 刷网页 | 信息流劫持注意力，回不到工作状态 |
| 微信读书 / Kindle | 需要切换设备或窗口，打断工作流 |
| **ReadShell** | **原地休息，原地恢复，不离开终端** |

## ⚡ 快速开始

### 安装

```bash
npm install -g readshell
```

### 基本使用

```bash
# 导入一本书 (支持 .txt 和 .epub)
novel import ~/books/my-novel.epub

# 恢复上次阅读（零摩擦入口）
novel resume

# 打开指定书籍
novel open <book-id>

# 查看书架
novel library

# 移除书籍与记录
novel remove <book-id>
```

### 阅读器快捷键

| 快捷键 | 功能 |
|---|---|
| `空格` / `j` / `↓` | 下一页 |
| `k` / `↑` | 上一页 |
| `c` | 章节列表及书签列表 |
| `Tab` | 章节弹出层中切换【目录/书签】 |
| `m` / `M` | 将当前页首行标记为书签 |
| `b` / `Esc` | Boss Key (老板键)，秒速伪装终端报错并自动存档 |
| `q` | 正常退出并保存进度 |
| `?` | 帮助 |

## 🏗️ 技术栈

- **TypeScript** + **Node.js** (≥ 18)
- **Ink** — React 范式的终端 UI 框架
- **SQLite** (`better-sqlite3`) — 零依赖本地数据库
- **Vitest** — 测试框架

## 📁 项目结构

```
src/
├── cli/          # 命令层：解析参数，调用 service
├── ui/           # TUI 层（Ink 组件）
├── services/     # 业务逻辑层
├── parsers/      # 文件解析层（txt/epub）
├── db/           # 数据库层（SQLite）
├── config/       # 配置管理
└── utils/        # 工具函数
```

## 🛠️ 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 运行测试
npm test

# 构建
npm run build

# 代码检查
npm run lint

# 格式化
npm run format
```

## 📝 许可证

[AGPL-3.0](LICENSE)
