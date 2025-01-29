import React from 'react';
import { Box, Text } from 'ink';
import { LoadingSpinner } from './spinner.js';

interface ConfigStepProps {
  step: string;
  status: 'pending' | 'success' | 'error';
  error?: string;
}

export const ConfigStep: React.FC<ConfigStepProps> = ({ step, status, error }) => {
  const getIcon = () => {
    switch (status) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      default:
        return '◦';
    }
  };

  const getColor = () => {
    switch (status) {
      case 'success':
        return 'green';
      case 'error':
        return 'red';
      default:
        return 'yellow';
    }
  };

  return (
    <Box>
      <Text color={getColor()}>
        {status === 'pending' ? <LoadingSpinner text={step} /> : (
          <Text>
            {getIcon()} {step}
            {error && <Text color="red"> - {error}</Text>}
          </Text>
        )}
      </Text>
    </Box>
  );
};