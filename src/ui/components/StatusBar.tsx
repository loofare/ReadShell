/**
 * 底部状态栏组件
 */

import React from 'react';
import { Box, Text } from 'ink';

interface StatusBarProps {
  bookTitle: string;
  percent: number;
  chapterTitle?: string;
}

export function StatusBar({ bookTitle, percent, chapterTitle }: StatusBarProps) {
  const percentStr = `${(percent * 100).toFixed(1)}%`;

  return (
    <Box borderStyle="single" borderTop borderBottom={false} borderLeft={false} borderRight={false} paddingX={1}>
      <Box flexGrow={1}>
        <Text color="gray">{bookTitle}</Text>
        {chapterTitle && (
          <Text color="gray"> · {chapterTitle}</Text>
        )}
      </Box>
      <Text color="cyan">{percentStr}</Text>
    </Box>
  );
}
