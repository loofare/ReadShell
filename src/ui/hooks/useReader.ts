/**
 * 阅读器核心状态 Hook
 * 管理当前页面、offset、分页等状态
 */

import { useState, useCallback } from 'react';
import type { Page } from '../../utils/paginate.js';

interface ReaderState {
  currentPage: number;
  totalPages: number;
  pages: Page[];
}

export function useReader(pages: Page[]) {
  const [state, setState] = useState<ReaderState>({
    currentPage: 0,
    totalPages: pages.length,
    pages,
  });

  const nextPage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentPage: Math.min(prev.currentPage + 1, prev.totalPages - 1),
    }));
  }, []);

  const prevPage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentPage: Math.max(prev.currentPage - 1, 0),
    }));
  }, []);

  const goToPage = useCallback((pageNum: number) => {
    setState((prev) => ({
      ...prev,
      currentPage: Math.max(0, Math.min(pageNum, prev.totalPages - 1)),
    }));
  }, []);

  const getCurrentPage = useCallback((): Page | undefined => {
    return state.pages[state.currentPage];
  }, [state.currentPage, state.pages]);

  const getPercent = useCallback((): number => {
    if (state.totalPages === 0) return 0;
    return (state.currentPage + 1) / state.totalPages;
  }, [state.currentPage, state.totalPages]);

  return {
    ...state,
    nextPage,
    prevPage,
    goToPage,
    getCurrentPage,
    getPercent,
  };
}
