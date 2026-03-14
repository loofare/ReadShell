/**
 * 正文渲染组件
 * 分页逻辑
 */

import React from 'react';
import { Box, Text } from 'ink';

interface TextRendererProps {
  lines: string[];
}

export function TextRenderer({ lines }: TextRendererProps) {
  return (
    <Box flexDirection="column">
      {lines.map((line, index) => (
        <Text key={index}>{line || ' '}</Text>
      ))}
    </Box>
  );
}
