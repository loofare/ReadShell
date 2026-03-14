/**
 * 阅读器核心状态 Hook
 * 管理当前页面、offset、分页等状态
 */

import { useState, useCallback, useMemo } from 'react';
import type { Page } from '../../utils/paginate.js';

interface ReaderState {
  currentPage: number;
  totalPages: number;
}

export function useReader(pages: Page[], initialByteOffset?: number) {
  // 根据 initialByteOffset 找到初始页
  const initialPage = useMemo(() => {
    if (!initialByteOffset || pages.length === 0) return 0;

    // 找到 byte_offset <= initialByteOffset 的最后一页
    let targetPage = 0;
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].byteOffset <= initialByteOffset) {
        targetPage = i;
      } else {
        break;
      }
    }
    return targetPage;
  }, [pages, initialByteOffset]);

  const [state, setState] = useState<ReaderState>({
    currentPage: initialPage,
    totalPages: pages.length,
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

  /**
   * 根据 byte_offset 跳转到对应页
   */
  const goToOffset = useCallback((byteOffset: number) => {
    let targetPage = 0;
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].byteOffset <= byteOffset) {
        targetPage = i;
      } else {
        break;
      }
    }
    setState((prev) => ({
      ...prev,
      currentPage: targetPage,
    }));
  }, [pages]);

  const getCurrentPage = useCallback((): Page | undefined => {
    return pages[state.currentPage];
  }, [state.currentPage, pages]);

  /**
   * 获取当前页的 byte_offset（用于保存进度）
   */
  const getCurrentOffset = useCallback((): number => {
    return pages[state.currentPage]?.byteOffset ?? 0;
  }, [state.currentPage, pages]);

  const getPercent = useCallback((): number => {
    if (state.totalPages === 0) return 0;
    return (state.currentPage + 1) / state.totalPages;
  }, [state.currentPage, state.totalPages]);

  const isFirstPage = state.currentPage === 0;
  const isLastPage = state.currentPage === state.totalPages - 1;

  return {
    ...state,
    nextPage,
    prevPage,
    goToPage,
    goToOffset,
    getCurrentPage,
    getCurrentOffset,
    getPercent,
    isFirstPage,
    isLastPage,
  };
}
