import { Progress, Tooltip } from '@mantine/core';

interface LoansBarProps {
  count: number;
  max: number;
}

export function LoansBar({ count, max }: LoansBarProps) {
  const value = max > 0 ? Math.round((count / max) * 100) : 0;

  return (
    <Tooltip label={`Броней: ${count}`} withArrow position="top">
      <Progress
        value={value}
        color="gold"
        size="sm"
        radius="sm"
        style={{ minWidth: 80, maxWidth: 160 }}
      />
    </Tooltip>
  );
}
