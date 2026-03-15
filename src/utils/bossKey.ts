/**
 * 防打断老板键 (Boss Key)
 * 瞬间退出并用伪装日志覆盖屏幕
 */

export function triggerBossKey(): void {
  // 1. 清空屏幕
  console.clear();

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

  console.log(fakeLog);

  // 3. 强制安静终止应用，不留痕迹
  process.exit(0);
}
