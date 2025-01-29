import React from 'react';
import { Text, Box } from 'ink';
import Spinner from 'ink-spinner';

export const LoadingSpinner = ({ text }: { text: string }) => (
  <Box>
    <Text color="green">
      <Spinner type="dots" />
    </Text>
    <Text> {text}</Text>
  </Box>
);