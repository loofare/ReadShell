/**
 * 退出前待完成的文件夹同步 Promise 注册表
 * ReaderPage 卸载时注册，renderApp 在 process.exit 前等待（带超时）
 */

let pendingSync: Promise<unknown> | null = null;

export function registerPendingSync(promise: Promise<unknown>): void {
  pendingSync = promise;
}

/**
 * 等待已注册的同步完成，最多 wait timeoutMs；无注册或超时都立即返回
 */
export async function drainPendingSync(timeoutMs = 2000): Promise<void> {
  if (!pendingSync) return;
  await Promise.race([
    pendingSync.catch(() => {}),
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}
