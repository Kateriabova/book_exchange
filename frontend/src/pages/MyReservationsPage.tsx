import { useState } from 'react';
import { Box, Title, Stack } from '@mantine/core';
import {
  reservations,
  currentUser,
  getMyActiveLoans,
  getMyReserved,
  getMyReturned,
} from '../mock/data';
import { ReservationsTable } from '../components/reservations/ReservationsTable';
import { StatsStrip } from '../components/ui/StatsStrip';

export function MyReservationsPage() {
  const [, setReservations] = useState(reservations);

  const myReservations = reservations.filter((r) => r.borrower_id === currentUser.id);
  const activeLoans = getMyActiveLoans();
  const reserved = getMyReserved();
  const returned = getMyReturned();

  const handleCancel = (id: number) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' as const } : r))
    );
  };

  const handleReturn = (id: number) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'returned' as const } : r))
    );
  };

  return (
    <Box p="md" style={{ maxWidth: 960, margin: '0 auto' }}>
      <Stack gap="md">
        <Title
          order={2}
          style={{ fontFamily: '"PT Serif", Georgia, serif', color: '#2E2418' }}
        >
          📜 Мои брони
        </Title>

        <StatsStrip
          items={[
            { label: 'Сейчас на руках', value: activeLoans.length, color: 'bordeaux' },
            { label: 'Зарезервировано', value: reserved.length, color: 'gold' },
            { label: 'Прочитано', value: returned.length, color: 'sage' },
          ]}
        />

        <ReservationsTable
          reservations={myReservations}
          onCancel={handleCancel}
          onReturn={handleReturn}
        />
      </Stack>
    </Box>
  );
}
