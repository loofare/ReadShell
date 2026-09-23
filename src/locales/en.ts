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
  'cli.import.help': 'File or directory path (supports .txt / .epub / .md)',
  'cli.import.success': '✓ Imported:',
  'cli.import.fail': 'Import failed:',
  'cli.import.not_found': 'Path not found:',
  'cli.import.unsupported': 'Unsupported file format. Currently supports: .txt, .epub, .md',
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

  'cli.lang.desc': 'Switch interface language',
  'cli.lang.help': 'Target language (zh Chinese | en English)',
  'cli.lang.success': '✓ Language switched to: {0}',
  'cli.lang.unsupported': '✗ Unsupported language: {0}',

  'cli.config.desc': 'Modify application configuration',
  'cli.config.line_spacing.desc': 'Line spacing: 0 (tight) | 1 (medium) | 2 (loose)',
  'cli.config.line_spacing.success': '✓ Line spacing set to: {0}',
  'cli.config.reading_mode.desc': 'Reading mode: page (paging) | scroll (scrolling)',

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
  'tui.nav.hint': 'Press C to open this list, press Tab to switch to bookmarks',
  'tui.nav.empty': 'No records',
  'tui.nav.page': 'Page {0} / {1}',

  // TUI - Help
  'tui.help.title': 'Keyboard shortcuts',
  'tui.help.next': '  Space / j / ↓ / f  next page',
  'tui.help.prev': '  k / ↑  prev page · g first · G last',
  'tui.help.nav': '  c chapters & bookmarks · Tab switch · m bookmark',
  'tui.help.boss': '  b / Esc boss key · q quit · ? help',

  // Sync / Stats / Bookmarks
  'cli.sync.desc': 'Sync progress, bookmarks and reading stats across devices via a synced folder',
  'cli.sync.dir': 'Sync folder path (e.g. a folder inside iCloud Drive / Dropbox / Syncthing)',
  'cli.sync.with_books': 'Also sync book files (other devices auto-import missing books)',
  'cli.sync.off': 'Disable folder sync',
  'cli.sync.disabled': '✓ Folder sync disabled',
  'cli.sync.dir_set': '✓ Sync folder set: {0}',
  'cli.sync.dir_invalid': '✗ Path does not exist or is not a directory: {0}',
  'cli.sync.no_dir': 'No sync folder configured. Run: novel sync --dir <path>',
  'cli.sync.running': 'Syncing...',
  'cli.sync.success': '✓ Sync complete (merged {0} items from {1} devices)',
  'cli.sync.failed': 'Sync failed: {0}',
  'cli.stats.desc': 'Reading stats: heatmap and streaks',
  'cli.stats.title': '📊 Reading Stats',
  'cli.stats.less': 'Less',
  'cli.stats.more': 'More',
  'cli.stats.summary': '{0} reading days · {1} minutes total · {2} books · current streak {3}d · longest {4}d',
  'cli.bookmarks.desc': 'Manage bookmarks',
  'cli.bookmarks.export.desc': 'Export all bookmarks',
  'cli.bookmarks.export.format': 'Output format: json | md',
  'cli.bookmarks.export.out': 'Output file path (defaults to stdout)',
  'cli.bookmarks.export.empty': 'No bookmarks to export',
  'cli.bookmarks.export.success': '✓ Exported {0} bookmarks to {1}',
  'cli.bookmarks.export.fail': 'Failed to export bookmarks: {0}',
};

export default en;
