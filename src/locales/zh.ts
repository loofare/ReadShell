export default {
  // Common
  'common.yes': '是',
  'common.no': '否',
  'common.confirm': '确认',
  'common.cancel': '取消',
  'common.quit': '按 q 退出',

  // CLI
  'cli.import.desc': '导入本地文件或目录到书架',
  'cli.import.help': '文件或目录路径（支持 .txt / .epub）',
  'cli.import.success': '✓ 已导入:',
  'cli.import.fail': '导入失败:',
  'cli.import.not_found': '路径不存在:',
  'cli.import.unsupported': '不支持的文件格式。目前支持: .txt, .epub',
  'cli.import.scan_dir': '扫描目录',
  'cli.import.found_files': '找到以下书籍：',
  'cli.import.confirm_batch': '是否确认导入上述 {0} 本书？(y/N)',
  'cli.import.canceled': '✓ 导入已取消',

  'cli.resume.desc': '恢复上次阅读',
  'cli.resume.none': '✗ 没有找到最近阅读记录，请先使用 novel import <file> 或 novel open <book-id> 打开一本书。',

  'cli.open.desc': '打开指定书籍',
  'cli.open.help': '书籍 ID 或书名（支持模糊匹配）',
  'cli.open.not_found': '✗ 未找到匹配书籍:',

  'cli.library.desc': '查看书架列表',
  'cli.library.help': '可选关键字搜索',
  'cli.library.none': '✗ 书架为空。使用 novel import <file> 导入你的第一本书。',
  'cli.library.search_none': '📚 未找到匹配「{0}」的书籍。',
  'cli.library.search_result': '📚 搜索结果 ({0} 本):\n',

  'cli.remove.desc': '从书架移除书籍（仅删除记录，不删源文件）',
  'cli.remove.help': '书籍 ID 或书名（支持模糊匹配）',
  'cli.remove.not_found': '✗ 未找到匹配书籍:',
  'cli.remove.success': '✓ 已移除书籍:',
  'cli.remove.fail': '移除书籍失败:',

  'cli.lang.desc': '切换语言',
  'cli.lang.help': '语言代码: zh | en',
  'cli.lang.success': '✓ 语言已切换为: {0}',
  'cli.lang.unsupported': '✗ 不支持的语言: {0}',

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

  // TUI - ChapterNav
  'tui.nav.tab.chapters': '[全部章节]',
  'tui.nav.tab.bookmarks': '[我的书签]',
  'tui.nav.tips': 'Enter 跳转 · Tab 切换 · Esc/q 关闭',
  'tui.nav.empty': '没有记录',
  'tui.nav.page': '第 {0} / {1} 页',
};
