[English](README.md) | [中文](README_zh.md)

<div align="center">

# ReadShell

**Your terminal already has everything. Now it has a bookshelf.**

[![npm version](https://img.shields.io/npm/v/readshell.svg)](https://www.npmjs.com/package/readshell)
[![npm downloads](https://img.shields.io/npm/dm/readshell.svg)](https://www.npmjs.com/package/readshell)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org)

*A low-friction reading tool for developers who never leave the terminal.*

![ReadShell Demo](./docs/demo.gif)



---

## The Problem

Waiting for a build to finish? Pipeline still running? You have 5 minutes.

You open your phone. 40 minutes later, you're still scrolling.

ReadShell is built for that gap — a reading space that lives inside your workflow, not outside it.
```bash
novel resume
```

One command. Back to where you were. Back to work when you're ready.

---

## Features

**📖 `novel resume` — Zero-friction re-entry**
The most important command. Picks up exactly where you left off, down to the byte.

**🥷 Boss Key (`b` / `Esc`) — Instant disguise**
One keypress transforms the reader into a convincing terminal error log. Your secret is safe.

**⏱ Reading time estimate**
Calibrated to your actual reading speed. Tells you if you have time for one more chapter.

**🔖 Bookmarks (`m`)**
Capture a passage mid-read. Revisit it later from the chapter navigator (`c`).

**📚 Batch import**
`novel import ~/books/` — recursively imports an entire folder of `.txt` and `.epub` files.

**🌐 i18n**
Native English and Chinese support.

---

## Quick Start
```bash
npm install -g readshell
```
```bash
# Import your books
novel import ~/books/

# Jump back in
novel resume

# Or pick a specific book
novel open <book-id>

# Browse your library
novel list
```

### Reader Controls

| Key | Action |
|---|---|
| `Space` / `j` / `↓` | Next page / scroll down |
| `k` / `↑` | Previous page / scroll up |
| `c` | Chapter list & bookmarks |
| `Tab` | Toggle chapters / bookmarks |
| `m` | Add bookmark |
| `b` / `Esc` | **Boss Key** — disguise & save |
| `q` | Quit & save |
| `?` | Help |

### Configuration
```bash
novel lang en                       # Set language (en / zh)
novel config line-spacing 1         # Line spacing
novel config reading-mode scroll    # scroll or page
novel update                        # Update to latest
```

---

## Why the terminal?

The terminal is already where you live. It's focused, text-only, and distraction-resistant by nature.

ReadShell doesn't ask you to context-switch. It sits quietly in your workflow — invisible to colleagues, zero install friction, no accounts, no cloud, no noise.

Your reading history lives entirely on your local machine in a SQLite file. Nothing leaves your disk.

---

## Tech Stack

- **TypeScript** + **Node.js** ≥ 18
- **Ink** — React-based TUI framework
- **SQLite** (`better-sqlite3`) — local-first, zero-dependency storage
- **Vitest** — testing

## Project Structure
```
src/
├── cli/        # Command layer
├── ui/         # TUI components (Ink)
├── services/   # Business logic
├── parsers/    # txt / epub parsers
├── db/         # SQLite layer
├── config/     # Config management
└── utils/
```

---

## Contributing

Issues, ideas, and PRs are welcome.
If ReadShell fits into your workflow, a ⭐ helps more people find it.

---

## License

[AGPL-3.0](LICENSE)