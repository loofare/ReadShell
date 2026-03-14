/**
 * 阅读时间估算
 */

/**
 * 估算阅读时间（分钟）
 * @param charCount 字符数
 * @param isChinese 是否中文内容
 * @returns 估计阅读分钟数
 */
export function estimateReadingTime(charCount: number, isChinese: boolean = true): number {
  // 中文平均阅读速度约 500 字/分钟
  // 英文平均阅读速度约 250 词/分钟（约 1250 字符/分钟）
  const charsPerMinute = isChinese ? 500 : 1250;
  return Math.ceil(charCount / charsPerMinute);
}

/**
 * 格式化时间显示
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} 分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} 小时 ${mins} 分钟` : `${hours} 小时`;
}
