/**
 * 阅读器页 — 核心阅读体验
 *
 * 功能:
 * - 加载书籍文件内容，按终端尺寸分页
 * - 键盘翻页（空格/j/↓ 下一页, k/↑ 上一页）
 * - 状态栏显示书名 + 进度百分比
 * - 退出时（q）自动保存进度
 * - resume 进入时根据 byte_offset 定位到对应页
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Text, useApp, useStdout } from 'ink';
import type { PageRoute } from '../App.js';
import { TextRenderer } from '../components/TextRenderer.js';
import { StatusBar } from '../components/StatusBar.js';
import { ChapterNav } from '../components/ChapterNav.js';
import { useReader } from '../hooks/useReader.js';
import { useKeyboard } from '../hooks/useKeyboard.js';
import { paginate, type Page } from '../../utils/paginate.js';
import { BookModel, type BookRecord } from '../../db/models/Book.js';
import { parseFile, type ParsedBook } from '../../parsers/index.js';
import { ProgressService } from '../../services/ProgressService.js';
import { ChapterService } from '../../services/ChapterService.js';
import { RecentService } from '../../services/RecentService.js';
import { BookmarkService } from '../../services/BookmarkService.js';
import type { ChapterRecord } from '../../db/models/Chapter.js';
import type { BookmarkRecord } from '../../db/models/Bookmark.js';
import { triggerBossKey } from '../../utils/bossKey.js';
import { estimateReadingTime, formatReadingTime } from '../../utils/time.js';
import { logger } from '../../utils/logger.js';
import { t } from '../../locales/index.js';

interface ReaderPageProps {
  bookId: string;
  initialByteOffset?: number;
  onNavigate: (page: PageRoute, bookId?: string, byteOffset?: number) => void;
}

/**
 * 阅读器内部组件 — 在 pages 准备好后渲染
 */
function ReaderContent({
  book,
  bookId,
  pages,
  initialByteOffset,
  termHeight,
  contentHeight,
}: {
  book: BookRecord;
  bookId: string;
  pages: Page[];
  initialByteOffset?: number;
  termHeight: number;
  contentHeight: number;
}) {
  const { exit } = useApp();
  const [chapterTitle, setChapterTitle] = useState<string | undefined>();
  const [currentChapter, setCurrentChapter] = useState<ChapterRecord | undefined>();
  const [showChapterNav, setShowChapterNav] = useState(false);
  const [allChapters, setAllChapters] = useState<ChapterRecord[]>([]);
  const [allBookmarks, setAllBookmarks] = useState<BookmarkRecord[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const progressServiceRef = useRef(new ProgressService());
  const chapterServiceRef = useRef(new ChapterService());
  const bookmarkServiceRef = useRef(new BookmarkService());

  const reader = useReader(pages, initialByteOffset);

  // 加载并更新当前章节信息
  useEffect(() => {
    const currentOffset = reader.getCurrentOffset();
    const chapter = chapterServiceRef.current.getChapterByOffset(bookId, currentOffset);
    setCurrentChapter(chapter ?? undefined);
    setChapterTitle(chapter?.title ?? undefined);
  }, [reader.currentPage, bookId]);

  // 获取该书全部章节及书签用于渲染导航
  useEffect(() => {
    const chaptersList = chapterServiceRef.current.getChaptersByBookId(bookId);
    setAllChapters(chaptersList);
    
    if (showChapterNav) {
      setAllBookmarks(bookmarkServiceRef.current.getBookmarksByBookId(bookId));
    }
  }, [bookId, showChapterNav]);

  /**
   * 取当前页首行生成书签名
   */
  const handleAddBookmark = () => {
    const currentPageInfo = reader.getCurrentPage();
    if (!currentPageInfo) return;

    let markTitle = '无标题书签';
    for (const line of currentPageInfo.lines) {
      const stripped = line.trim();
      if (stripped.length > 0) {
        markTitle = stripped.slice(0, 15) + (stripped.length > 15 ? '...' : '');
        break;
      }
    }

    const currentOffset = reader.getCurrentOffset();
    bookmarkServiceRef.current.addBookmark(bookId, markTitle, currentOffset);
    
    setToastMessage(t('tui.reader.bookmark_add', markTitle));
    setTimeout(() => setToastMessage(null), 2000);
  };

  /**
   * 自动在组件卸载时保存进度
   */
  useEffect(() => {
    return () => {
      const offset = reader.getCurrentOffset();
      const percent = reader.getPercent();
      const chapter = chapterServiceRef.current.getChapterByOffset(bookId, offset);
      const chapterNo = chapter?.chapter_no ?? 0;

      progressServiceRef.current.saveProgress(bookId, chapterNo, offset, percent);
      logger.debug(`进度已保存: offset=${offset}, ${(percent * 100).toFixed(1)}%`);
    };
  }, [bookId, reader]);

  // 拦截全局键盘事件
  useKeyboard(
    {
      onNext: () => reader.nextPage(),
      onPrev: () => reader.prevPage(),
      onQuit: () => exit(),
      onChapterList: () => setShowChapterNav(true),
      onBossKey: () => triggerBossKey(),
      onBookmarkAdd: handleAddBookmark,
    },
    !showChapterNav, // 如果浮层显示，则停止普通的阅读快捷键
  );

  const currentPage = reader.getCurrentPage();
  const currentLines = currentPage?.lines ?? [];
  // The contentHeight prop is already passed, but the instruction redefines it.
  // Assuming the user intends to use this new calculation for contentHeight within ReaderContent.
  const calculatedContentHeight = Math.max(1, termHeight - 2);

  // 计算剩余阅读时间：总字符近似于字节数的 1/3 (utf-8 场景下)，中文字符占绝大部分
  const totalChars = (book.file_size ?? 0) / 3;
  const remainingChars = Math.max(0, totalChars * (1 - reader.getPercent()));
  const remainingMinutes = estimateReadingTime(remainingChars, true);
  const remainingTimeStr = formatReadingTime(remainingMinutes);

  return (
    <Box flexDirection="column" height={termHeight}>
      {/* 相对定位于容器中，使用 flex 布局进行展现。章节模式下隐藏正文 */}
      {!showChapterNav ? (
        <>
          <Box flexDirection="column" flexGrow={1} paddingX={1}>
            <TextRenderer lines={currentLines} height={calculatedContentHeight} />
          </Box>
          <StatusBar
            bookTitle={book.title}
            percent={reader.getPercent()}
            chapterTitle={chapterTitle}
            currentPage={reader.currentPage + 1}
            totalPages={reader.totalPages}
            remainingTime={remainingTimeStr}
          />
          {toastMessage && (
            <Box alignSelf="flex-end" marginTop={-2} marginRight={1} borderStyle="round" borderColor="green" paddingX={1}>
              <Text color="green">{toastMessage}</Text>
            </Box>
          )}
        </>
      ) : (
        <ChapterNav
          chapters={allChapters}
          bookmarks={allBookmarks}
          currentChapterId={currentChapter?.id}
          termHeight={termHeight}
          onSelect={(offset) => {
            reader.goToOffset(offset);
            setShowChapterNav(false);
          }}
          onClose={() => setShowChapterNav(false)}
        />
      )}
    </Box>
  );
}

export function ReaderPage({ bookId, initialByteOffset, onNavigate: _onNavigate }: ReaderPageProps) {
  const { exit } = useApp();
  const { stdout } = useStdout();

  const [book, setBook] = useState<BookRecord | null>(null);
  const [pages, setPages] = useState<Page[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const termWidth = stdout?.columns ?? 80;
  const termHeight = stdout?.rows ?? 24;
  const contentHeight = Math.max(termHeight - 3, 5);

  // 加载书籍内容
  useEffect(() => {
    try {
      const bookModel = new BookModel();
      const bookRecord = bookModel.findById(bookId);

      if (!bookRecord) {
        setError(`书籍不存在: ${bookId}`);
        return;
      }

      setBook(bookRecord);

      // 记录打开事件
      const recentService = new RecentService();
      recentService.recordOpen(bookId);

      // 异步读取并解析文件内容 (支持 TXT 和 EPUB)
      parseFile(bookRecord.file_path, bookRecord.format as 'txt' | 'epub')
        .then((parsed: ParsedBook) => {
          // 分页
          const paginatedPages = paginate(parsed.content, termWidth - 2, contentHeight);
          setPages(paginatedPages);
          logger.debug(`加载完成: ${bookRecord.title}, ${paginatedPages.length} 页`);
        })
        .catch((err: Error) => {
          setError(`内容解析失败: ${err instanceof Error ? err.message : String(err)}`);
        });
    } catch (err) {
      setError(`加载过程出错: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [bookId, termWidth, contentHeight]);

  // 非 TTY 下支持 q 退出
  useKeyboard({
    onQuit: () => exit(),
  });

  // 错误
  if (error) {
    return (
      <Box padding={1} flexDirection="column">
        <Text color="red">✗ {error}</Text>
        <Text dimColor>{t('common.quit')}</Text>
      </Box>
    );
  }

  // 加载中
  if (!book || !pages) {
    return (
      <Box padding={1}>
        <Text color="cyan">📖 {t('tui.reader.loading')}</Text>
      </Box>
    );
  }

  // pages 准备好后渲染阅读器内容
  return (
    <ReaderContent
      book={book}
      bookId={bookId}
      pages={pages}
      initialByteOffset={initialByteOffset}
      termHeight={termHeight}
      contentHeight={contentHeight}
    />
  );
}
