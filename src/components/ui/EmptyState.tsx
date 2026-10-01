import { Text, Box } from '@mantine/core';

interface EmptyStateProps {
  message: string;
  icon?: string;
}

export function EmptyState({ message, icon = '🕯️' }: EmptyStateProps) {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      <Text size="48px" mb="md">
        {icon}
      </Text>
      <Text c="dimmed" size="lg">
        {message}
      </Text>
    </Box>
  );
}
