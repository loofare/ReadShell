/**
 * 章节导航浮层组件
 */

import React from 'react';
import { Box, Text } from 'ink';
import type { ChapterRecord } from '../../db/models/Chapter.js';

interface ChapterNavProps {
  chapters: ChapterRecord[];
  currentChapter: number;
  selectedIndex: number;
}

export function ChapterNav({ chapters, currentChapter, selectedIndex }: ChapterNavProps) {
  return (
    <Box flexDirection="column" borderStyle="round" padding={1}>
      <Text bold color="cyan">📑 章节列表</Text>
      <Box flexDirection="column" marginTop={1}>
        {chapters.map((chapter, index) => (
          <Box key={chapter.chapter_no} paddingX={1}>
            <Text
              color={index === selectedIndex ? 'cyan' : chapter.chapter_no === currentChapter ? 'yellow' : undefined}
              bold={index === selectedIndex}
            >
              {index === selectedIndex ? '▸ ' : '  '}
              {chapter.title || `第 ${chapter.chapter_no + 1} 章`}
              {chapter.chapter_no === currentChapter ? ' ◀' : ''}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
