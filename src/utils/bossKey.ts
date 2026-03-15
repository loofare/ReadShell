/**
 * 防打断老板键 (Boss Key)
 * 瞬间退出并用伪装日志覆盖屏幕
 */

export function triggerBossKey(): void {
  // 1. 彻底清空当前屏幕并清除滚动回放缓冲区 (Scrollback Buffer)
  // \u001b[3J: 清除滚动条历史
  // \u001b[2J: 清除当前可视区域
  // \u001b[1;1H: 移动光标到左上角
  process.stdout.write('\u001b[3J\u001b[2J\u001b[1;1H');
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
