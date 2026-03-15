import type { LocaleDictionary } from './types.js';

const en: LocaleDictionary = {
  // Common
  'common.yes': 'Yes',
  'common.no': 'No',
  'common.confirm': 'Confirm',
  'common.cancel': 'Cancel',
  'common.quit': 'Press q to quit',

  // CLI
  'cli.import.desc': 'Import local file or directory to library',
  'cli.import.help': 'File or directory path (supports .txt / .epub)',
  'cli.import.success': '✓ Imported:',
  'cli.import.fail': 'Import failed:',
  'cli.import.not_found': 'Path not found:',
  'cli.import.unsupported': 'Unsupported file format. Currently supports: .txt, .epub',
  'cli.import.scan_dir': 'Scanning directory',
  'cli.import.found_files': 'Found following books:',
  'cli.import.confirm_batch': 'Confirm importing these {0} books? (y/N)',
  'cli.import.canceled': '✓ Import canceled',

  'cli.resume.desc': 'Resume last reading',
  'cli.resume.none': '✗ No recent reading record found. Please use `novel import <file>` or `novel open <book-id>` first.',

  'cli.open.desc': 'Open specific book',
  'cli.open.help': 'Book ID or title (fuzzy match)',
  'cli.open.not_found': '✗ Book not found:',

  'cli.library.desc': 'View book list / library',
  'cli.library.help': 'Optional keyword search',
  'cli.library.none': '✗ Library is empty. Use `novel import <file>` to import your first book.',
  'cli.library.search_none': '📚 No books found matching "{0}".',
  'cli.library.search_result': '📚 Search results ({0} books):\n',

  'cli.remove.desc': 'Remove book from library (only deletes records, not source file)',
  'cli.remove.help': 'Book ID or title (fuzzy match)',
  'cli.remove.not_found': '✗ Book not found:',
  'cli.remove.success': '✓ Book removed:',
  'cli.remove.fail': 'Failed to remove book:',

  'cli.lang.desc': 'Switch language',
  'cli.lang.help': 'Language code: zh | en',
  'cli.lang.success': '✓ Language switched to: {0}',
  'cli.lang.unsupported': '✗ Unsupported language: {0}',

  'cli.update.desc': 'Check for the latest version and update automatically',
  'cli.update.checking': 'Checking for updates...',
  'cli.update.latest': '✓ Already up to date (v{0})',
  'cli.update.updating': 'New version v{0} found (current v{1}), updating...',
  'cli.update.success': '✓ Successfully updated! Please restart novel command.',
  'cli.update.fail': '✗ Update failed: {0}',

  // TUI - Library
  'tui.lib.loading': '📚 Loading library...',
  'tui.lib.empty.title': '📚 Library',
  'tui.lib.empty.desc': 'Library is empty. Use `novel import <file>` to import your first book.',
  'tui.lib.title': '📚 Library ({0} books)',
  'tui.lib.tips': '  ↑↓/jk select · Enter open · d/x delete · q quit',

  // TUI - Reader
  'tui.reader.loading': 'Loading...',
  'tui.reader.bookmark_add': '✓ Bookmark added: {0}',
  'tui.reader.status.remaining': 'Est. remaining {0}',

  // TUI - ChapterNav
  'tui.nav.tab.chapters': '[All Chapters]',
  'tui.nav.tab.bookmarks': '[My Bookmarks]',
  'tui.nav.tips': 'Enter jump · Tab switch · Esc/q close',
  'tui.nav.empty': 'No records',
  'tui.nav.page': 'Page {0} / {1}',
};

export default en;
