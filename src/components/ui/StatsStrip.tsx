import { Group, Badge } from '@mantine/core';

interface StatsStripProps {
  items: { label: string; value: number | string; color?: string }[];
}

export function StatsStrip({ items }: StatsStripProps) {
  return (
    <Group gap="sm" wrap="wrap">
      {items.map((item) => (
        <Badge
          key={item.label}
          variant="outline"
          color={item.color || 'gold'}
          size="lg"
          styles={{
            root: {
              padding: '8px 14px',
              fontWeight: 500,
              fontSize: '0.875rem',
            },
          }}
        >
          {item.label}: {item.value}
        </Badge>
      ))}
    </Group>
  );
}
