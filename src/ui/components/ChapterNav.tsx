/**
 * 章节导航浮层组件
 * 允许在阅读器内唤起章节列表，并支持翻页与选择跳转
 */

import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import type { ChapterRecord } from '../../db/models/Chapter.js';
import type { BookmarkRecord } from '../../db/models/Bookmark.js';
import { t } from '../../locales/index.js';

interface ChapterNavProps {
  chapters: ChapterRecord[];
  bookmarks: BookmarkRecord[];
  currentChapterId?: number;
  termHeight: number;
  onSelect: (byteOffset: number) => void;
  onClose: () => void;
}

export function ChapterNav({
  chapters,
  bookmarks,
  currentChapterId,
  termHeight,
  onSelect,
  onClose,
}: ChapterNavProps) {
  const [activeTab, setActiveTab] = useState<'chapters' | 'bookmarks'>('chapters');
  const isBookmarks = activeTab === 'bookmarks';
  const currentList = isBookmarks ? bookmarks : chapters;

  // 找到当前章节的初始索引
  const initialIndex = currentChapterId && !isBookmarks
    ? Math.max(
        0,
        chapters.findIndex((c) => c.id === currentChapterId),
      )
    : 0;

  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  // 切换 tab 时重置索引
  useEffect(() => {
    setSelectedIndex(isBookmarks ? 0 : initialIndex);
  }, [activeTab, initialIndex, isBookmarks]);

  // 一页展示多少个项（留出上下边距）
  const pageSize = Math.max(5, termHeight - 6);

  // 计算当前可视窗口的起始和结束索引
  const windowStart = Math.max(0, Math.floor(selectedIndex / pageSize) * pageSize);
  const visibleItems = currentList.slice(windowStart, windowStart + pageSize);

  const isRawModeSupported = process.stdin.isTTY ?? false;

  useInput(
    (input, key) => {
      // 退出
      if (key.escape || input === 'q') {
        onClose();
        return;
      }
      
      // 切换视图
      if (key.tab) {
        setActiveTab(prev => prev === 'chapters' ? 'bookmarks' : 'chapters');
        return;
      }

      // 确认
      if (key.return) {
        if (currentList[selectedIndex]) {
          onSelect(currentList[selectedIndex].byte_offset);
        }
        return;
      }

      // 上移
      if (key.upArrow || input === 'k') {
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      }

      // 下移
      if (key.downArrow || input === 'j') {
        setSelectedIndex((prev) => Math.min(currentList.length - 1, prev + 1));
      }
    },
    { isActive: isRawModeSupported },
  );

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="green"
      paddingX={2}
      paddingY={1}
      width="80%"
      alignSelf="center"
      marginTop={2}
    >
      <Box justifyContent="space-between" marginBottom={1}>
        <Box>
          <Text bold color={activeTab === 'chapters' ? 'green' : 'gray'}>{t('tui.nav.tab.chapters')} </Text>
          <Text bold color={activeTab === 'bookmarks' ? 'green' : 'gray'}>{t('tui.nav.tab.bookmarks')}</Text>
        </Box>
        <Text dimColor>{t('tui.nav.tips')}</Text>
      </Box>

      {visibleItems.length === 0 ? (
        <Text dimColor>{t('tui.nav.empty')}</Text>
      ) : (
        visibleItems.map((item, idx) => {
          const actualIndex = windowStart + idx;
          const isSelected = actualIndex === selectedIndex;
          
          return (
            <Text
              key={item.id}
              color={isSelected ? 'green' : undefined}
              bold={isSelected}
            >
              {isSelected ? '▶ ' : '  '}
              {item.title}
            </Text>
          );
        })
      )}

      <Box marginTop={1} justifyContent="flex-end">
        <Text dimColor>
          {t('tui.nav.page', Math.floor(selectedIndex / pageSize) + 1, Math.ceil(currentList.length / pageSize) || 1)}
        </Text>
      </Box>
    </Box>
  );
}
