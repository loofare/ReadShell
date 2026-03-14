/**
 * 书架页
 * 书架 + 最近阅读 + 搜索
 */

import React from 'react';
import { Box, Text } from 'ink';
import type { PageRoute } from '../App.js';

interface LibraryPageProps {
  onNavigate: (page: PageRoute, bookId?: string) => void;
}

export function LibraryPage({ onNavigate: _onNavigate }: LibraryPageProps) {
  // TODO: 从 BookService 获取书架列表

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">
        📚 书架
      </Text>
      <Box marginTop={1}>
        <Text dimColor>书架为空。使用 novel import &lt;file&gt; 导入你的第一本书。</Text>
      </Box>
    </Box>
  );
}
