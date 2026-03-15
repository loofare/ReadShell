[English](README.md) | [中文](README_zh.md)

# ReadShell

> CLI Light Reading Tool for Developers

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org)

---

## 🎯 Why ReadShell?

ReadShell is not designed for "when you have no screens to read on", but rather:

**During coding breaks, you need a quick reading escape that won't drag you out of your workflow.**

| Alternatives | The Problem |
|---|---|
| Scrolling Social Media | Hard to stop; 10 minutes turns into 40 minutes. |
| Web Browsing | Information overload hijacked by algorithms; hard to get back to work. |
| Desktop Apps / Kindle | Requires switching context, devices, or windows, breaking your flow. |
| **ReadShell** | **Rest where you are, recover your flow, never leave the terminal.** |

## 📈 Current MVP Progress (v0.1.0)

Our initial MVP goals are fully realized:
- **Core Format Support**: Native parsing for `.txt` plain text and `.epub` ebooks. Features intelligent pagination, dialogue highlighting, and smooth scrolling.
- **Immersion & Boss Key**: Original `Boss Key` (`b`/`Esc`) instantly disguises the reader as a standard terminal error log, saving your progress seamlessly.
- **Local Lightning-Fast Library**: A zero-dependency local data center built entirely on SQLite. Accurately remembers byte-offsets and silently saves your progress upon exiting.
- **Deep Flow Reading**: Features rapid bookmarks (`m` key) and localized Kindle-style "Time Left" estimations based on your reading speed.
- **Batch Folder Import**: Recursively scan and import entire folders of books at once.
- **I18n Support**: Native support for English and Chinese.

## 💡 The Philosophy (Developer's Monologue)

### Why build a reader in the terminal?
As developers, the IDE and Terminal are our natural habitats. When we are waiting for a build, a pipeline to finish, or just experiencing a 5-10 minute mental block, we need a "spiritual refuge" that is easy to slip into and easy to drop out of.

Web browsers easily hijack your attention, and phones completely shatter your flow state. But the terminal—a pure, text-only monochrome environment—naturally carries a restrained sense of isolation.

**ReadShell** attempts to provide a text-based sanctuary with the lowest friction possible within this highly restrained environment. No bloated UI, no distractions. To your coworkers, it just looks like another local build task running silently and efficiently.

### The Romance of Tech Choices
To achieve ultimate speed and minimal resource overhead, we abandoned Electron and GUI frameworks:
- **`Ink` TUI Aesthetics**: Drawing an old-school, geeky CLI using Modern React reactive principles. Flexbox and Hooks give CLI apps smooth boundary feedback.
- **Absolute Local Sovereignty (`SQLite`)**: Rejecting cloud lock-in and redundant network requests. Your reading memories, chapter skeletons, and bookmarks exist cleanly in a lightning-fast read-only ledger on your SSD.
- **Philosophy of Simplification**: Whether it’s a massive raw TXT or a complex HTML-embedded EPUB, they are streamed, parsed, and cleansed into structured terminal rows, arriving right before your eyes at the press of a key.

## ⚡ Quick Start

### Installation

```bash
npm install -g readshell
```

### Basic Usage

```bash
# Set Language (en / zh)
novel lang en

# Import a single book or batch import a folder (.txt and .epub)
novel import ~/books/

# Resume last read (Zero-friction entry)
novel resume

# Open a specific book
novel open <book-id>

# View book list
novel list

# Remove a book and its records
novel remove <book-id>

# Check and update to the latest version
novel update
```

### Reader Shortcuts

| Key | Action |
|---|---|
| `Space` / `j` / `↓` | Next Page |
| `k` / `↑` | Previous Page |
| `c` | Open Chapters and Bookmarks list |
| `Tab` | Switch between Chapters/Bookmarks in menu |
| `m` / `M` | Add Bookmark at the current page |
| `b` / `Esc` | Boss Key (disguise terminal as error and save) |
| `q` | Quit and save progress |
| `?` | Help |

## 🏗️ Tech Stack

- **TypeScript** + **Node.js** (≥ 18)
- **Ink** — React-based Terminal UI framework
- **SQLite** (`better-sqlite3`) — Zero-dependency local DB
- **Vitest** — Testing Framework

## 📁 Project Structure

```
src/
├── cli/          # CLI layer: args parsing, command dispatch
├── ui/           # TUI layer (Ink components)
├── services/     # Business logic
├── parsers/      # Format parsers (txt/epub)
├── db/           # Database layer (SQLite)
├── config/       # Configuration management
└── utils/        # Utilities
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Dev mode
npm run dev

# Run tests
npm test

# Build
npm run build

# Lint
npm run lint

# Format
npm run format
```

## 📝 License

[AGPL-3.0](LICENSE)
