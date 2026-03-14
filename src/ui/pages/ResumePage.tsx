/**
 * 继续阅读页
 * 启动默认页，自动查询最近阅读并跳转到阅读器
 */

import React, { useEffect, useState } from 'react';
import { Box, Text, useApp } from 'ink';
import type { PageRoute } from '../App.js';
import { ProgressService } from '../../services/ProgressService.js';
import { BookModel, type BookRecord } from '../../db/models/Book.js';

interface ResumePageProps {
  onNavigate: (page: PageRoute, bookId?: string, byteOffset?: number) => void;
}

export function ResumePage({ onNavigate }: ResumePageProps) {
  const { exit } = useApp();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const progressService = new ProgressService();
    const lastProgress = progressService.getLastOpenedBook();

    if (!lastProgress) {
      setChecking(false);
      return;
    }

    // 验证书籍存在
    const bookModel = new BookModel();
    const book = bookModel.findById(lastProgress.book_id);

    if (!book) {
      setChecking(false);
      return;
    }

    // 自动跳转到阅读器
    onNavigate('reader', book.id, lastProgress.byte_offset);
  }, [onNavigate]);

  if (checking) {
    return (
      <Box padding={1}>
        <Text color="cyan">📖 检查阅读记录...</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">
        📖 ReadShell — 终端内轻阅读
      </Text>
      <Box marginTop={1} flexDirection="column">
        <Text dimColor>暂无阅读记录。</Text>
        <Text dimColor>使用 novel import &lt;file&gt; 导入一本书开始阅读。</Text>
        <Box marginTop={1}>
          <Text dimColor>按 q 退出</Text>
        </Box>
      </Box>
    </Box>
  );
}
