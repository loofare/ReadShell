/**
 * 底部状态栏组件
 * 显示书名、章节名、页码和进度百分比
 */

import React from 'react';
import { Box, Text } from 'ink';
import { t } from '../../locales/index.js';

interface StatusBarProps {
  bookTitle: string;
  chapterTitle?: string;
  percent: number;
  currentPage: number;
  totalPages: number;
  remainingTime?: string;
}

export function StatusBar({
  bookTitle,
  chapterTitle,
  percent,
  currentPage,
  totalPages,
  remainingTime,
}: StatusBarProps) {
  const displayPercent = (percent * 100).toFixed(1);
  const titleDisplay = chapterTitle ? `${bookTitle} · ${chapterTitle}` : bookTitle;

  return (
    <Box flexDirection="row" justifyContent="space-between" borderStyle="single" borderTop={false} borderLeft={false} borderRight={false} paddingX={1}>
      <Box>
        <Text color="gray">📖 {titleDisplay}</Text>
      </Box>

      <Box>
        {remainingTime && (
          <Text dimColor>{t('tui.reader.status.remaining', remainingTime)}  </Text>
        )}
        <Text color="gray">
          {currentPage}/{totalPages}  
        </Text>
        <Text color="gray">
          {displayPercent}%  
        </Text>
        <Text dimColor>{t('common.quit')}</Text>
      </Box>
    </Box>
  );
}
