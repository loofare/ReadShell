export default {
  // Common
  'common.yes': '是',
  'common.no': '否',
  'common.confirm': '确认',
  'common.cancel': '取消',
  'common.quit': '按 q 退出',

  // CLI
  'cli.import.desc': '导入本地文件或目录到书架',
  'cli.import.help': '文件或目录路径（支持 .txt / .epub / .md）',
  'cli.import.success': '✓ 已导入:',
  'cli.import.fail': '导入失败:',
  'cli.import.not_found': '路径不存在:',
  'cli.import.unsupported': '不支持的文件格式。目前支持: .txt, .epub, .md',
  'cli.import.scan_dir': '扫描目录',
  'cli.import.found_files': '找到以下书籍：',
  'cli.import.confirm_batch': '是否确认导入上述 {0} 本书？(y/N)',
  'cli.import.canceled': '✓ 导入已取消',

  'cli.resume.desc': '恢复上次阅读',
  'cli.resume.none': '✗ 没有找到最近阅读记录，请先使用 novel import <file> 或 novel open <book-id> 打开一本书。',

  'cli.open.desc': '打开指定书籍',
  'cli.open.help': '书籍 ID 或书名（支持模糊匹配）',
  'cli.open.not_found': '✗ 未找到匹配书籍:',

  'cli.library.desc': '查看书架书籍列表',
  'cli.library.help': '可选关键字搜索',
  'cli.library.none': '✗ 书架为空。使用 novel import <file> 导入你的第一本书。',
  'cli.library.search_none': '📚 未找到匹配「{0}」的书籍。',
  'cli.library.search_result': '📚 搜索结果 ({0} 本):\n',

  'cli.remove.desc': '从书架移除书籍（仅删除记录，不删源文件）',
  'cli.remove.help': '书籍 ID 或书名（支持模糊匹配）',
  'cli.remove.not_found': '✗ 未找到匹配书籍:',
  'cli.remove.success': '✓ 已移除书籍:',
  'cli.remove.fail': '移除书籍失败:',

  'cli.lang.desc': '切换界面语言',
  'cli.lang.help': '目标语言（zh 中文 | en 英文）',
  'cli.lang.success': '✓ 语言已切换为: {0}',
  'cli.lang.unsupported': '✗ 不支持的语言: {0}',

  'cli.config.desc': '修改应用配置',
  'cli.config.line_spacing.desc': '行间距: 0 (紧凑) | 1 (适中) | 2 (宽松)',
  'cli.config.line_spacing.success': '✓ 行间距已设置为: {0}',
  'cli.config.reading_mode.desc': '阅读模式: page (翻页) | scroll (滚动)',

  'cli.update.desc': '检查最新版本并自动更新',
  'cli.update.checking': '正在检查更新...',
  'cli.update.latest': '✓ 当前已是最新版本 (v{0})',
  'cli.update.updating': '发现新版本 v{0} (当前 v{1})，正在更新...',
  'cli.update.success': '✓ 升级成功！请重新运行 novel 命令。',
  'cli.update.fail': '✗ 升级失败: {0}',

  // TUI - Library
  'tui.lib.loading': '📚 加载书架...',
  'tui.lib.empty.title': '📚 书架',
  'tui.lib.empty.desc': '书架为空。使用 novel import <file> 导入你的第一本书。',
  'tui.lib.title': '📚 书架 ({0} 本)',
  'tui.lib.tips': '  ↑↓/jk 选择 · Enter 打开 · d/x 删除 · q 退出',

  // TUI - Reader
  'tui.reader.loading': '读取中...',
  'tui.reader.bookmark_add': '✓ 增加书签: {0}',
  'tui.reader.status.remaining': '预计剩余 {0}',

  'tui.nav.tab.chapters': '[全部章节]',
  'tui.nav.tab.bookmarks': '[我的书签]',
  'tui.nav.tips': 'Enter 跳转 · Tab 切换 · Esc/q 关闭',
  'tui.nav.hint': '按 C 键弹出此清单，按 Tab 切换书签',
  'tui.nav.empty': '没有记录',
  'tui.nav.page': '第 {0} / {1} 页',

  // TUI - Help
  'tui.help.title': '快捷键',
  'tui.help.next': '  Space / j / ↓ / f  下一页',
  'tui.help.prev': '  k / ↑  上一页 · g 首页 · G 末页',
  'tui.help.nav': '  c 章节与书签 · Tab 切换 · m 加书签',
  'tui.help.boss': '  b / Esc 老板键 · q 退出 · ? 帮助',

  // Sync / Stats / Bookmarks
  'cli.sync.desc': '通过同步文件夹在多设备间同步进度、书签与阅读统计',
  'cli.sync.dir': '同步目录路径（如 iCloud Drive / Dropbox / 坚果云 内的文件夹）',
  'cli.sync.with_books': '同时同步书源文件（其他设备可自动导入缺失的书）',
  'cli.sync.off': '关闭文件夹同步',
  'cli.sync.disabled': '✓ 已关闭文件夹同步',
  'cli.sync.dir_set': '✓ 同步目录已设置: {0}',
  'cli.sync.dir_invalid': '✗ 目录不存在或不是文件夹: {0}',
  'cli.sync.no_dir': '尚未设置同步目录。请先运行: novel sync --dir <路径>',
  'cli.sync.running': '同步中...',
  'cli.sync.success': '✓ 同步完成（合并 {0} 条，来自 {1} 台设备）',
  'cli.sync.failed': '同步失败：{0}',
  'cli.stats.desc': '阅读统计：热力图与连续天数',
  'cli.stats.title': '📊 阅读统计',
  'cli.stats.less': '少',
  'cli.stats.more': '多',
  'cli.stats.summary': '阅读天数 {0} · 总时长 {1} 分钟 · 读过 {2} 本 · 当前连续 {3} 天 · 最长连续 {4} 天',
  'cli.bookmarks.desc': '书签管理',
  'cli.bookmarks.export.desc': '导出全部书签',
  'cli.bookmarks.export.format': '输出格式: json | md',
  'cli.bookmarks.export.out': '输出文件路径（默认打印到终端）',
  'cli.bookmarks.export.empty': '没有书签可导出',
  'cli.bookmarks.export.success': '✓ 已导出 {0} 条书签到 {1}',
  'cli.bookmarks.export.fail': '导出书签失败: {0}',
};
