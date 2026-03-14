/**
 * 字符串宽度计算
 * 处理中文字符宽度为 2
 */

/**
 * 获取字符串在终端中的显示宽度
 */
export function getStringWidth(str: string): number {
  let width = 0;
  for (const char of str) {
    width += isFullWidth(char) ? 2 : 1;
  }
  return width;
}

/**
 * 判断字符是否为全角字符
 * CJK 统一表意字符 + 全角标点
 */
function isFullWidth(char: string): boolean {
  const code = char.codePointAt(0);
  if (code === undefined) return false;

  return (
    // CJK 统一表意字符
    (code >= 0x4e00 && code <= 0x9fff) ||
    // CJK 统一表意字符扩展 A
    (code >= 0x3400 && code <= 0x4dbf) ||
    // CJK 统一表意字符扩展 B
    (code >= 0x20000 && code <= 0x2a6df) ||
    // CJK 兼容表意字符
    (code >= 0xf900 && code <= 0xfaff) ||
    // 全角 ASCII、全角标点
    (code >= 0xff01 && code <= 0xff60) ||
    (code >= 0xffe0 && code <= 0xffe6) ||
    // CJK 标点符号
    (code >= 0x3000 && code <= 0x303f) ||
    // 日文平假名/片假名
    (code >= 0x3040 && code <= 0x30ff) ||
    // 韩文音节
    (code >= 0xac00 && code <= 0xd7af)
  );
}
