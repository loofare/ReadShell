/**
 * 书架页
 * 交互式书架列表，上下键选择，Enter 打开阅读
 */

import React, { useState, useEffect } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import type { PageRoute } from '../App.js';
import { BookService } from '../../services/BookService.js';
import { ProgressService } from '../../services/ProgressService.js';
import { RecentService } from '../../services/RecentService.js';
import type { BookRecord } from '../../db/models/Book.js';

interface LibraryPageProps {
  onNavigate: (page: PageRoute, bookId?: string, byteOffset?: number) => void;
}

export function LibraryPage({ onNavigate }: LibraryPageProps) {
  const { exit } = useApp();
  const [books, setBooks] = useState<BookRecord[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const isRawModeSupported = process.stdin.isTTY ?? false;

  useEffect(() => {
    const recentService = new RecentService();
    const recentBooks = recentService.getRecentBooks();

    if (recentBooks.length > 0) {
      setBooks(recentBooks);
    } else {
      const bookService = new BookService();
      setBooks(bookService.getAllBooks());
    }
    setLoading(false);
  }, []);

  useInput((input, key) => {
    if (input === 'q') {
      exit();
      return;
    }

    if (books.length === 0) return;

    // 上下导航
    if (key.upArrow || input === 'k') {
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    }
    if (key.downArrow || input === 'j') {
      setSelectedIndex((prev) => Math.min(prev + 1, books.length - 1));
    }

    // 删除选中的书 (backspace 键或 d 键)
    if (key.backspace || key.delete || input === 'd' || input === 'x') {
      const selected = books[selectedIndex];
      if (selected) {
        const bookService = new BookService();
        bookService.deleteBook(selected.id);
        
        // 更新列表
        setBooks((prev) => {
          const next = prev.filter((b) => b.id !== selected.id);
          // 调整选中游标，防止越界
          if (selectedIndex >= next.length) {
            setSelectedIndex(Math.max(0, next.length - 1));
          }
          return next;
        });
      }
      return;
    }

    // Enter 打开选中的书
    if (key.return) {
      const selected = books[selectedIndex];
      if (selected) {
        const progressService = new ProgressService();
        const progress = progressService.getProgress(selected.id);
        onNavigate('reader', selected.id, progress?.byte_offset ?? 0);
      }
    }
  }, { isActive: isRawModeSupported });

  if (loading) {
    return (
      <Box padding={1}>
        <Text color="cyan">📚 加载书架...</Text>
      </Box>
    );
  }

  if (books.length === 0) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text bold color="cyan">📚 书架</Text>
        <Box marginTop={1} flexDirection="column">
          <Text dimColor>书架为空。使用 novel import &lt;file&gt; 导入你的第一本书。</Text>
          <Box marginTop={1}>
            <Text dimColor>按 q 退出</Text>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">📚 书架 ({books.length} 本)</Text>
      <Text dimColor>  ↑↓/jk 选择 · Enter 打开 · d/x 删除 · q 退出</Text>
      <Box flexDirection="column" marginTop={1}>
        {books.map((book, index) => {
          const isSelected = index === selectedIndex;
          
          return (
            <Box key={book.id} paddingX={1} justifyContent="space-between">
              <Box>
                <Text
                  color={isSelected ? 'cyan' : undefined}
                  bold={isSelected}
                >
                  {isSelected ? '▸ ' : '  '}
                  {book.title}
                </Text>
                <Text dimColor>  ({book.format})</Text>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
