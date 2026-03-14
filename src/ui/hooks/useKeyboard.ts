/**
 * 键盘事件统一管理 Hook
 * 在非 TTY 环境下安全降级
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
  const isRawModeSupported = process.stdin.isTTY ?? false;

  useInput((input, key) => {
    // 翻页：空格 / j / 下箭头 → 下一页
    if (input === ' ' || input === 'j' || key.downArrow || input === 'f') {
      handlers.onNext?.();
    }

    // 上一页：k / 上箭头 / b
    if (input === 'k' || key.upArrow || input === 'b') {
      handlers.onPrev?.();
    }

    // 退出：q
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
  }, { isActive: isRawModeSupported });
}
