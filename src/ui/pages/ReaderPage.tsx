/**
 * 阅读器页
 * 阅读器主体
 */

import React from 'react';
import { Box, Text } from 'ink';
import type { PageRoute } from '../App.js';

interface ReaderPageProps {
  bookId: string;
  onNavigate: (page: PageRoute, bookId?: string) => void;
}

export function ReaderPage({ bookId, onNavigate: _onNavigate }: ReaderPageProps) {
  // TODO: 加载书籍内容，实现分页阅读

  return (
    <Box flexDirection="column">
      <Box flexGrow={1} padding={1}>
        <Text>正在加载书籍 {bookId}...</Text>
      </Box>
      {/* TODO: StatusBar 组件 */}
    </Box>
  );
}
