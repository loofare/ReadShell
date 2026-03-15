/**
 * Ink TUI 渲染启动函数
 * 封装 ink.render(<App />) 的统一入口
 */

import React from 'react';
import { render } from 'ink';
import { App, type PageRoute } from './App.js';
import { isBossKeyActive, performBossKeyAction } from '../utils/bossKey.js';

interface RenderOptions {
  initialPage?: PageRoute;
  bookId?: string;
  initialByteOffset?: number;
}

/**
 * 启动 Ink TUI 应用
 */
export function renderApp(options: RenderOptions = {}): void {
  const { initialPage = 'resume', bookId, initialByteOffset } = options;

  const { waitUntilExit } = render(
    React.createElement(App, {
      initialPage,
      bookId,
      initialByteOffset,
    }),
  );

  waitUntilExit()
    .then(() => {
      // 检查是否是因为老板键退出
      if (isBossKeyActive()) {
        performBossKeyAction();
      }
      process.exit(0);
    })
    .catch(() => {
      // 异常退出清理
      process.exit(1);
    });
}
