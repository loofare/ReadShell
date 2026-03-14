/**
 * 底部状态栏组件
 * 显示书名、章节名、页码和进度百分比
 */

import React from 'react';
import { Box, Text } from 'ink';

interface StatusBarProps {
  bookTitle: string;
  percent: number;
  chapterTitle?: string;
  currentPage?: number;
  totalPages?: number;
}

export function StatusBar({ bookTitle, percent, chapterTitle, currentPage, totalPages }: StatusBarProps) {
  const percentStr = `${(percent * 100).toFixed(1)}%`;
  const pageStr = currentPage && totalPages ? `${currentPage}/${totalPages}` : '';

  return (
    <Box paddingX={1} justifyContent="space-between">
      <Box>
        <Text color="gray" dimColor>
          📖 {bookTitle}
        </Text>
        {chapterTitle && (
          <Text color="gray" dimColor> · {chapterTitle}</Text>
        )}
      </Box>
      <Box>
        {pageStr && <Text color="gray" dimColor>{pageStr}  </Text>}
        <Text color="cyan" bold>{percentStr}</Text>
        <Text color="gray" dimColor>  q退出</Text>
      </Box>
    </Box>
  );
}
