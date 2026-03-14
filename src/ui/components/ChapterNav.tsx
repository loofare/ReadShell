/**
 * 章节导航浮层组件
 * 允许在阅读器内唤起章节列表，并支持翻页与选择跳转
 */

import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import type { ChapterRecord } from '../../db/models/Chapter.js';

interface ChapterNavProps {
  chapters: ChapterRecord[];
  currentChapterId?: number;
  termHeight: number;
  onSelect: (byteOffset: number) => void;
  onClose: () => void;
}

export function ChapterNav({
  chapters,
  currentChapterId,
  termHeight,
  onSelect,
  onClose,
}: ChapterNavProps) {
  // 找到当前章节的初始索引
  const initialIndex = currentChapterId
    ? Math.max(
        0,
        chapters.findIndex((c) => c.id === currentChapterId),
      )
    : 0;

  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  // 一页展示多少个章节（留出上下边距）
  const pageSize = Math.max(5, termHeight - 6);

  // 计算当前可视窗口的起始和结束索引
  const windowStart = Math.max(0, Math.floor(selectedIndex / pageSize) * pageSize);
  const visibleChapters = chapters.slice(windowStart, windowStart + pageSize);

  const isRawModeSupported = process.stdin.isTTY ?? false;

  useInput(
    (input, key) => {
      // 退出
      if (key.escape || input === 'q') {
        onClose();
        return;
      }

      // 确认
      if (key.return) {
        if (chapters[selectedIndex]) {
          onSelect(chapters[selectedIndex].byte_offset);
        }
        return;
      }

      // 上移
      if (key.upArrow || input === 'k') {
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      }

      // 下移
      if (key.downArrow || input === 'j') {
        setSelectedIndex((prev) => Math.min(chapters.length - 1, prev + 1));
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
        <Text bold color="green">目录 ({chapters.length} 章)</Text>
        <Text dimColor>Enter 跳转 · Esc/q 关闭</Text>
      </Box>

      {visibleChapters.map((ch, idx) => {
        const actualIndex = windowStart + idx;
        const isSelected = actualIndex === selectedIndex;
        return (
          <Text
            key={ch.id}
            color={isSelected ? 'green' : undefined}
            bold={isSelected}
          >
            {isSelected ? '▶ ' : '  '}
            {ch.title}
          </Text>
        );
      })}

      <Box marginTop={1} justifyContent="flex-end">
        <Text dimColor>
          第 {Math.floor(selectedIndex / pageSize) + 1} / {Math.ceil(chapters.length / pageSize)} 页
        </Text>
      </Box>
    </Box>
  );
}
