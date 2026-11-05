import { useState, useMemo } from 'react';
import {
  Box,
  Title,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  reservations as initialReservations,
  currentUser,
  getMyActiveLoans,
  getMyReserved,
  getMyReturned,
} from '../mock/data';
import { ReservationsTable } from '../components/reservations/ReservationsTable';
import { StatsStrip } from '../components/ui/StatsStrip';

export function MyReservationsPage() {
  const [reservations, setReservations] = useState(initialReservations);

  const myReservations = useMemo(
    () => reservations.filter((r) => r.borrower_id === currentUser.id),
    [reservations]
  );

  const activeLoans = getMyActiveLoans();
  const reserved = getMyReserved();
  const returned = getMyReturned();

  const handleCancel = (id: number) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' as const } : r))
    );
    notifications.show({
      title: 'Бронь отменена',
      message: 'Книга снова доступна для других читателей',
      color: 'bordeaux',
    });
  };

  const handleReturn = (id: number) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'returned' as const } : r))
    );
    notifications.show({
      title: 'Книга возвращена',
      message: 'Спасибо, что вовремя вернули книгу!',
      color: 'sage',
    });
  };

  const activeReservations = myReservations.filter(
    (r) => r.status === 'reserved' || r.status === 'active'
  );
  const historyReservations = myReservations.filter(
    (r) => r.status === 'returned' || r.status === 'cancelled'
  );

  return (
    <Box p="md" style={{ maxWidth: 960, margin: '0 auto' }}>
      <Stack gap="md">
        <Title order={2} style={{ fontFamily: '"PT Serif", Georgia, serif' }}>
          📜 Мои брони
        </Title>

        <StatsStrip
          items={[
            { label: 'Сейчас на руках', value: activeLoans.length, color: 'bordeaux' },
            { label: 'Зарезервировано', value: reserved.length, color: 'gold' },
            { label: 'Прочитано', value: returned.length, color: 'sage' },
          ]}
        />

        <Tabs defaultValue="active" variant="pills" color="gold">
          <Tabs.List>
            <Tabs.Tab value="active">Активные</Tabs.Tab>
            <Tabs.Tab value="history">История</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="active" pt="md">
            {activeReservations.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">У вас нет активных броней</Text>
            ) : (
              <ReservationsTable
                reservations={activeReservations}
                onCancel={handleCancel}
                onReturn={handleReturn}
              />
            )}
          </Tabs.Panel>

          <Tabs.Panel value="history" pt="md">
            {historyReservations.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">История пуста</Text>
            ) : (
              <ReservationsTable
                reservations={historyReservations}
                onCancel={handleCancel}
                onReturn={handleReturn}
              />
            )}
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Box>
  );
}