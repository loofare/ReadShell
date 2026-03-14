/**
 * 调试日志
 * 仅 DEBUG=1 时输出
 */

const isDebug = process.env['DEBUG'] === '1' || process.env['DEBUG'] === 'true';

export const logger = {
  debug: (...args: unknown[]): void => {
    if (isDebug) {
      console.error('[DEBUG]', ...args);
    }
  },

  info: (...args: unknown[]): void => {
    console.error('[INFO]', ...args);
  },

  warn: (...args: unknown[]): void => {
    console.error('[WARN]', ...args);
  },

  error: (...args: unknown[]): void => {
    console.error('[ERROR]', ...args);
  },
};
