[English](README.md) | [中文](README_zh.md)

<div align="center">

# ReadShell

**Your terminal already has everything. Now it has a bookshelf.**

[![npm version](https://img.shields.io/npm/v/readshell.svg)](https://www.npmjs.com/package/readshell)
[![npm downloads](https://img.shields.io/npm/dm/readshell.svg)](https://www.npmjs.com/package/readshell)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green.svg)](https://nodejs.org)

*A low-friction reading tool for developers who never leave the terminal. Free and open source — no accounts, no servers, no paid tier.*

![ReadShell Demo](./docs/demo.gif)

</div>

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
One keypress transforms the reader into a convincing terminal error log (nodejs / python / java / c / go). Your secret is safe.
![Boss Key Demo](./docs/error.png)
*Boss Key wipes the scrollback buffer and shows a fake error. `novel resume` jumps back to the exact spot.*

**🔄 Folder sync — multi-device, no server**
Point ReadShell at any folder synced by iCloud Drive, Dropbox, OneDrive, 坚果云, or Syncthing. Progress, bookmarks (including deletions), and reading stats merge across devices automatically on open/exit. Nothing is ever uploaded to a ReadShell server — there isn't one.

**📊 `novel stats` — GitHub-style heatmap**
A year of reading at a glance, plus reading days, total time, books read, and streaks — aggregated across all synced devices.

**🔖 Bookmarks (`m`) + free export**
Capture a passage mid-read, revisit via the chapter navigator (`c`), export everything with `novel bookmarks export --format md|json`.

**📚 Batch import**
`novel import ~/books/` — recursively imports `.txt`, `.epub`, and `.md` files.

**🌐 i18n**
Native Chinese and English support (`novel lang zh|en`).

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
| `Space` / `j` / `↓` / `f` | Next page / scroll down |
| `k` / `↑` | Previous page / scroll up |
| `g` / `G` | First / last page |
| `c` | Chapter list & bookmarks |
| `Tab` | Toggle chapters / bookmarks |
| `m` | Add bookmark |
| `b` / `Esc` | **Boss Key** — disguise & save |
| `q` | Quit & save |
| `?` | Help |

### Commands
```bash
novel import <path>                    # file or directory (txt / epub / md)
novel list                             # library
novel open <id|title>                  # open a book
novel resume                           # resume last position
novel remove <id|title>                # remove from library
novel stats                            # reading heatmap & streaks
novel bookmarks export [--format json|md] [--out file]
novel sync --dir <path> [--with-books] # set sync folder & sync
novel sync                             # sync with saved folder
novel sync --off                       # disable sync
novel lang zh|en                       # interface language
novel config <key> <value>             # language | line-spacing | reading-mode | boss-key-lang
novel update                           # update to latest
```

---

## Folder Sync

ReadShell syncs through a plain folder — no account, no server. Each device writes a snapshot to `<syncDir>/readshell-sync/devices/<deviceId>.json` and merges every other device's file (last-write-wins progress, bookmark tombstones, session union).

Pick a folder that your sync tool already watches:

```bash
# iCloud Drive (macOS)
novel sync --dir "$HOME/Library/Mobile Documents/com~apple~CloudDocs/ReadShell"

# Dropbox
novel sync --dir ~/Dropbox/ReadShell

# 坚果云 / OneDrive / Syncthing — same idea, any synced folder
novel sync --dir ~/Nutstore/ReadShell
```

Add `--with-books` to also copy book files into the sync folder — other devices will auto-import books they don't have yet. Without it, only progress/bookmarks/stats sync (books are matched by file hash).

Sync runs automatically when the reader opens (pull) and exits (push + pull), silently and bounded to ~2s. `novel sync --off` disables it.

---

## Migrating from readshell-pro

```bash
npm uninstall -g readshell-pro && npm install -g readshell
```

Your library, progress, and bookmarks are preserved — the data directory is unchanged. Cloud auth keys are cleaned up automatically on first run.

---

## Why the terminal?

The terminal is already where you live. It's focused, text-only, and distraction-resistant by nature.

ReadShell doesn't ask you to context-switch. It sits quietly in your workflow — invisible to colleagues, zero install friction, no accounts, no cloud, no noise.

Your reading history lives entirely on your local machine in a SQLite file (plus the sync folder you choose). Nothing leaves your disk otherwise.

---

## Tech Stack

- **TypeScript** + **Node.js** ≥ 20
- **Ink** — React-based TUI framework
- **SQLite** (`better-sqlite3`) — local-first, zero-dependency storage
- **Vitest** — testing

## Project Structure
```
src/
├── cli/        # Command layer
├── ui/         # TUI components (Ink)
├── services/   # Business logic (incl. folder sync, stats)
├── parsers/    # txt / epub / md parsers
├── db/         # SQLite layer
├── config/     # Config management
└── utils/
```

---

## Contributing

Issues, ideas, and PRs are welcome — see [CONTRIBUTING](docs/CONTRIBUTING.md).
If ReadShell fits into your workflow, a ⭐ helps more people find it.

## Sponsor

If ReadShell saves you time, consider supporting development: https://readshell.com/sponsor

---

## License

[MIT](LICENSE)
