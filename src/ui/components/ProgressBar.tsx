/**
 * 进度条组件
 */

import React from 'react';
import { Box, Text } from 'ink';

interface ProgressBarProps {
  percent: number;
  width?: number;
}

export function ProgressBar({ percent, width = 30 }: ProgressBarProps) {
  const filled = Math.round(percent * width);
  const empty = width - filled;

  return (
    <Box>
      <Text color="cyan">{'█'.repeat(filled)}</Text>
      <Text dimColor>{'░'.repeat(empty)}</Text>
      <Text color="gray"> {(percent * 100).toFixed(1)}%</Text>
    </Box>
  );
}
