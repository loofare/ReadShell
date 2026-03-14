/**
 * 防打断老板键 (Boss Key)
 * 瞬间退出并用伪装日志覆盖屏幕
 */

export function triggerBossKey(): void {
  // 1. 清空屏幕
  console.clear();

  // 2. 打印极度逼真的伪装日志（例如 Vite 启动成功日志）
  const fakeLog = `
  VITE v5.2.8  ready in 213 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
`;

  console.log(fakeLog);

  // 3. 强制安静终止应用，不留痕迹
  process.exit(0);
}
