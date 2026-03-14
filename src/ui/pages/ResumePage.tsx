/**
 * 继续阅读页
 * 启动默认页，显示上次阅读书目
 */

import React from 'react';
import { Box, Text } from 'ink';
import type { PageRoute } from '../App.js';

interface ResumePageProps {
  onNavigate: (page: PageRoute, bookId?: string) => void;
}

export function ResumePage({ onNavigate: _onNavigate }: ResumePageProps) {
  // TODO: 获取上次阅读的书籍信息，自动跳转到 reader 页面

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">
        📖 ReadShell — 继续阅读
      </Text>
      <Box marginTop={1}>
        <Text dimColor>暂无阅读记录。使用 novel import &lt;file&gt; 导入一本书开始阅读。</Text>
      </Box>
    </Box>
  );
}
