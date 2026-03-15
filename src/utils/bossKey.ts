let isBossKeyEnabled = false;

/**
 * 标记老板键已触发
 */
export function triggerBossKey(): void {
  isBossKeyEnabled = true;
}

/**
 * 检查老板键是否处于激活状态
 */
export function isBossKeyActive(): boolean {
  return isBossKeyEnabled;
}

/**
 * 执行最终的伪装动作（清屏、打印伪装日志并退出进程）
 */
export function performBossKeyAction(): void {
  // 1. 彻底清空当前屏幕并清除滚动回放缓冲区 (Scrollback Buffer)
  process.stdout.write('\u001b[3J\u001b[2J\u001b[1;1H');
  
  // 2. 打印极度逼真的伪装日志（终端报错风格）
  const fakeLog = `
file:///Users/yindawei/project/node_modules/vite/dist/node/chunks/dep-BbV93i69.js:43916
      throw new Error(\`[vite] Failed to resolve module import "./App.vue". Check if the file exists.\`);
            ^

Error: [vite] Failed to resolve module import "./App.vue". Check if the file exists.
    at Object.run (file:///Users/yindawei/project/node_modules/vite/dist/node/chunks/dep-BbV93i69.js:43916:13)
    at async file:///Users/yindawei/project/node_modules/vite/dist/node/cli.js:722:7
    at async startVite (file:///Users/yindawei/project/node_modules/vite/dist/node/cli.js:700:5)
    at async Object.handler (file:///Users/yindawei/project/node_modules/vite/dist/node/cli.js:650:1)

Node.js v20.11.0
`;

  process.stdout.write(fakeLog + '\n');

  // 3. 强制安静终止应用
  process.exit(0);
}
