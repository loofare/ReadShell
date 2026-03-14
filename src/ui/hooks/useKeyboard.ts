/**
 * 键盘事件统一管理 Hook
 */

import { useInput } from 'ink';

interface KeyboardHandlers {
  onNext?: () => void;
  onPrev?: () => void;
  onQuit?: () => void;
  onChapterList?: () => void;
  onHelp?: () => void;
}

export function useKeyboard(handlers: KeyboardHandlers) {
  useInput((input, key) => {
    // 翻页：空格 / j / 下箭头 / PageDown → 下一页
    if (input === ' ' || input === 'j' || key.downArrow || input === 'f') {
      handlers.onNext?.();
    }

    // 上一页：k / 上箭头 / b / PageUp
    if (input === 'k' || key.upArrow || input === 'b') {
      handlers.onPrev?.();
    }

    // 退出：q / Ctrl+C
    if (input === 'q') {
      handlers.onQuit?.();
    }

    // 章节列表：c
    if (input === 'c') {
      handlers.onChapterList?.();
    }

    // 帮助：?
    if (input === '?') {
      handlers.onHelp?.();
    }
  });
}
