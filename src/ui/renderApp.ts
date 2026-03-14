/**
 * Ink TUI 渲染启动函数
 * 封装 ink.render(<App />) 的统一入口
 */

import React from 'react';
import { render } from 'ink';
import { App, type PageRoute } from './App.js';

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

  waitUntilExit().catch(() => {
    // Ink 退出时的清理
    process.exit(0);
  });
}
