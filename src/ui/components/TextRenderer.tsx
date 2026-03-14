/**
 * 正文渲染组件
 * 显示分页后的文本行
 */

import React from 'react';
import { Box, Text } from 'ink';

interface TextRendererProps {
  lines: string[];
  height?: number;
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
        <Text key={index}>{line || ' '}</Text>
      ))}
    </Box>
  );
}
