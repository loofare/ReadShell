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
import { useReader } from '../hooks/useReader.js';
import { useKeyboard } from '../hooks/useKeyboard.js';
import { paginate, type Page } from '../../utils/paginate.js';
import { readFileWithEncoding } from '../../utils/encoding.js';
import { BookModel, type BookRecord } from '../../db/models/Book.js';
import { ProgressService } from '../../services/ProgressService.js';
import { ChapterService } from '../../services/ChapterService.js';
import { RecentService } from '../../services/RecentService.js';
import { logger } from '../../utils/logger.js';

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

  const progressServiceRef = useRef(new ProgressService());
  const chapterServiceRef = useRef(new ChapterService());

  const reader = useReader(pages, initialByteOffset);

  // 更新当前章节标题
  useEffect(() => {
    const currentOffset = reader.getCurrentOffset();
    const chapter = chapterServiceRef.current.getChapterByOffset(bookId, currentOffset);
    setChapterTitle(chapter?.title ?? undefined);
  }, [reader.currentPage, bookId]);

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

  // 键盘事件
  useKeyboard({
    onNext: () => reader.nextPage(),
    onPrev: () => reader.prevPage(),
    onQuit: () => exit(),
  });

  const currentPage = reader.getCurrentPage();
  const currentLines = currentPage?.lines ?? [];

  return (
    <Box flexDirection="column" height={termHeight}>
      {/* 正文内容区域 */}
      <Box flexDirection="column" flexGrow={1} paddingX={1}>
        <TextRenderer lines={currentLines} height={contentHeight} />
      </Box>

      {/* 状态栏 */}
      <StatusBar
        bookTitle={book.title}
        percent={reader.getPercent()}
        chapterTitle={chapterTitle}
        currentPage={reader.currentPage + 1}
        totalPages={reader.totalPages}
      />
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

      // 读取文件内容
      const content = readFileWithEncoding(bookRecord.file_path);

      // 分页
      const paginatedPages = paginate(content, termWidth - 2, contentHeight);
      setPages(paginatedPages);

      logger.debug(`加载完成: ${bookRecord.title}, ${paginatedPages.length} 页`);
    } catch (err) {
      setError(`加载失败: ${err instanceof Error ? err.message : String(err)}`);
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
        <Text dimColor>按 q 退出</Text>
      </Box>
    );
  }

  // 加载中
  if (!book || !pages) {
    return (
      <Box padding={1}>
        <Text color="cyan">📖 正在加载...</Text>
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
