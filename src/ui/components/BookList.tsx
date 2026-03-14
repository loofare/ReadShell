/**
 * 书架列表组件
 */

import React from 'react';
import { Box, Text } from 'ink';
import type { BookRecord } from '../../db/models/Book.js';

interface BookListProps {
  books: BookRecord[];
  selectedIndex: number;
}

export function BookList({ books, selectedIndex }: BookListProps) {
  if (books.length === 0) {
    return (
      <Box padding={1}>
        <Text dimColor>书架为空</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      {books.map((book, index) => (
        <Box key={book.id} paddingX={1}>
          <Text
            color={index === selectedIndex ? 'cyan' : undefined}
            bold={index === selectedIndex}
          >
            {index === selectedIndex ? '▸ ' : '  '}
            {book.title}
          </Text>
          <Text dimColor> ({book.format})</Text>
        </Box>
      ))}
    </Box>
  );
}
