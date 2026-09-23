/**
 * Ink TUI 渲染启动函数
 * 封装 ink.render(<App />) 的统一入口
 */

import React from 'react';
import { render } from 'ink';
import { App, type PageRoute } from './App.js';
import { isBossKeyActive, performBossKeyAction } from '../utils/bossKey.js';
import { drainPendingSync } from '../utils/pendingSync.js';

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
    .then(async () => {
      // 检查是否是因为老板键退出：先输出伪装画面，再静默等待同步
      if (isBossKeyActive()) {
        performBossKeyAction();
      }
      // 等待退出前注册的同步完成（最多 2s），保证进度/书签/会话不丢
      await drainPendingSync(2000);
      process.exit(0);
    })
    .catch(() => {
      // 异常退出清理
      process.exit(1);
    });
}
