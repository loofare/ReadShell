import type { BossKeyLang } from '../config/AppConfig.js';
import { getConfig } from '../config/AppConfig.js';

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

const fakeLogs: Record<BossKeyLang, string> = {
  nodejs: `
file:///home/user/project/node_modules/vite/dist/node/chunks/dep-BbV93i69.js:43916
      throw new Error(\`[vite] Failed to resolve module import "./App.vue". Check if the file exists.\`);
            ^

Error: [vite] Failed to resolve module import "./App.vue". Check if the file exists.
    at Object.run (file:///home/user/project/node_modules/vite/dist/node/chunks/dep-BbV93i69.js:43916:13)
    at async file:///home/user/project/node_modules/vite/dist/node/cli.js:722:7
    at async startVite (file:///home/user/project/node_modules/vite/dist/node/cli.js:700:5)
    at async Object.handler (file:///home/user/project/node_modules/vite/dist/node/cli.js:650:1)

Node.js v20.11.0
`,

  python: `
Traceback (most recent call last):
  File "/home/user/project/main.py", line 42, in <module>
    result = process_data(df)
  File "/home/user/project/utils/pipeline.py", line 118, in process_data
    return df.groupby("user_id").apply(transform)
  File "/home/user/project/utils/pipeline.py", line 97, in transform
    raise ValueError(f"Missing required column: '{col}'")
ValueError: Missing required column: 'timestamp'

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/home/user/project/main.py", line 47, in <module>
    raise RuntimeError("Pipeline failed. Check logs for details.")
RuntimeError: Pipeline failed. Check logs for details.
`,

  java: `
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.length()" because "str" is null
	at com.example.app.StringUtils.process(StringUtils.java:34)
	at com.example.app.DataProcessor.run(DataProcessor.java:112)
	at com.example.app.Main.main(Main.java:21)

BUILD FAILURE
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin:3.11.0:compile
[ERROR] -> [Help 1] http://cwiki.apache.org/confluence/display/MAVEN/MojoFailureException
`,

  c: `
make[2]: *** [CMakeFiles/app.dir/src/main.c.o] Error 1
make[1]: *** [CMakeFiles/app.dir/all] Error 2
make: *** [all] Error 2

/home/user/project/src/main.c:87:5: error: use of undeclared identifier 'ctx'
    ctx->buffer = malloc(sizeof(Buffer));
    ^
/home/user/project/src/main.c:102:12: warning: implicit declaration of function 'init_buffer' [-Wimplicit-function-declaration]
    result = init_buffer(ctx, DEFAULT_SIZE);
             ^
2 errors, 1 warning generated.
`,

  go: `
# command-line-arguments
./main.go:58:13: undefined: parseConfig
./main.go:74:9: cannot use result (variable of type *Response) as type Handler
./main.go:91:2: declared and not used: errCh

go: github.com/example/app@v1.3.2: reading github.com/example/app/go.mod at revision v1.3.2: unknown revision v1.3.2
exit status 1
`,
};

/**
 * 执行伪装动作（清屏并打印伪装日志）
 * 注意：不再自行退出进程，由 renderApp 在等待退出同步完成后统一退出
 */
export function performBossKeyAction(): void {
  // 1. 彻底清空当前屏幕并清除滚动回放缓冲区 (Scrollback Buffer)
  process.stdout.write('\u001b[3J\u001b[2J\u001b[1;1H');

  // 2. 根据用户配置选择伪装语言
  const lang = getConfig().bossKeyLang ?? 'nodejs';
  const fakeLog = fakeLogs[lang];

  process.stdout.write(fakeLog + '\n');
}
