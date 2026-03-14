/**
 * 正文渲染组件
 * 显示分页后的文本行，并支持智能高亮
 */

import React from 'react';
import { Box, Text } from 'ink';

interface TextRendererProps {
  lines: string[];
  height?: number;
}

/**
 * 处理单行内的智能高亮匹配
 * 例如将 「XXX」或 “XXX” 进行暗化或着色，提升大段文字沉浸感
 */
function renderLineWithHighlight(line: string) {
  if (!line) return <Text> </Text>; // 保留空行

  // 匹配对话大纲的正则 (包括中英文常见方括号/双引号)
  // 此处拆分为：对话段落与非对话段落
  // (「.*?」|“.*?”|『.*?』|《.*?》)
  const regex = /(「.*?」|“.*?”|『.*?』|《.*?》)/g;
  const parts = line.split(regex);

  return (
    <Text>
      {parts.map((part, index) => {
        // 如果是正则匹配出的组（即被高亮的部分）
        if (regex.test(part)) {
          // 由于 Regex 的全局状态，test 之后要注意
          // 但其实 split 后，奇数项是捕获组的内容
        }
        
        // 简单判定：如果是奇数项，就是捕获组
        const isHighlight = index % 2 === 1;

        if (isHighlight) {
          // 对话颜色应用 dimColor，让环境和描述语句突出，或者是相反。
          // 这里将对话变暗 (dimColor)，减轻视觉疲劳
          return <Text key={index} dimColor>{part}</Text>;
        }

        // 常规文本
        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
}

export function TextRenderer({ lines, height }: TextRendererProps) {
  // 补齐空行以占满屏幕高度（避免内容跳动）
  const displayLines = [...lines];
  if (height && displayLines.length < height) {
    const padding = height - displayLines.length;
    for (let i = 0; i < padding; i++) {
      displayLines.push('');
    }
  }

  return (
    <Box flexDirection="column">
      {displayLines.map((line, index) => (
        <Box key={index}>
          {renderLineWithHighlight(line)}
        </Box>
      ))}
    </Box>
  );
}
