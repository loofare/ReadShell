/**
 * App 根组件
 * 管理页面路由状态
 */

import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { ResumePage } from './pages/ResumePage.js';
import { LibraryPage } from './pages/LibraryPage.js';
import { ReaderPage } from './pages/ReaderPage.js';

export type PageRoute = 'resume' | 'library' | 'reader';

interface AppProps {
  initialPage?: PageRoute;
  bookId?: string;
}

export function App({ initialPage = 'resume', bookId }: AppProps) {
  const [currentPage, setCurrentPage] = useState<PageRoute>(initialPage);
  const [currentBookId, setCurrentBookId] = useState<string | undefined>(bookId);

  const navigateTo = (page: PageRoute, targetBookId?: string) => {
    setCurrentPage(page);
    if (targetBookId) setCurrentBookId(targetBookId);
  };

  return (
    <Box flexDirection="column" width="100%">
      {currentPage === 'resume' && (
        <ResumePage onNavigate={navigateTo} />
      )}
      {currentPage === 'library' && (
        <LibraryPage onNavigate={navigateTo} />
      )}
      {currentPage === 'reader' && currentBookId && (
        <ReaderPage bookId={currentBookId} onNavigate={navigateTo} />
      )}
      {currentPage === 'reader' && !currentBookId && (
        <Box>
          <Text color="red">错误: 未指定书籍</Text>
        </Box>
      )}
    </Box>
  );
}
