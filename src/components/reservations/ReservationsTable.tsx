import {
  Table,
  Group,
  Button,
  Text,
  Box,
  Tabs,
} from '@mantine/core';
import {
  type Reservation,
  getBookById,
  getUserById,
  getPickupPointById,
  currentUser,
} from '../../mock/data';
import { StatusBadge } from '../ui/StatusBadge';

interface ReservationsTableProps {
  reservations: Reservation[];
  onCancel: (id: number) => void;
  onReturn: (id: number) => void;
}

export function ReservationsTable({ reservations, onCancel, onReturn }: ReservationsTableProps) {
  const active = reservations.filter(
    (r) => r.status === 'active' || r.status === 'reserved'
  );
  const history = reservations.filter(
    (r) => r.status === 'returned' || r.status === 'cancelled'
  );

  const renderRow = (r: Reservation, isHistory: boolean) => {
    const book = getBookById(r.book_id);
    const owner = getUserById(book?.owner_id || 0);
    const point = getPickupPointById(r.pickup_point_id);
    const isMine = r.borrower_id === currentUser.id;

    return (
      <Table.Tr
        key={r.id}
        style={{ opacity: isHistory ? 0.6 : 1 }}
      >
        <Table.Td>
          <Text size="sm" fw={500}>
            {book?.title}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm" c="dimmed">
            {owner?.display_name}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm">{point?.name}</Text>
        </Table.Td>
        <Table.Td>
          <Text size="xs">
            {r.start_date} — {r.due_date}
          </Text>
        </Table.Td>
        <Table.Td>
          <StatusBadge
            status={r.status}
            startDate={r.start_date}
            dueDate={r.due_date}
          />
        </Table.Td>
        <Table.Td>
          {isMine && !isHistory && (
            <Group gap="xs">
              {r.status === 'reserved' && (
                <Button
                  variant="subtle"
                  color="bordeaux"
                  size="xs"
                  onClick={() => onCancel(r.id)}
                >
                  Отменить
                </Button>
              )}
              {r.status === 'active' && (
                <Button
                  variant="light"
                  color="sage"
                  size="xs"
                  onClick={() => onReturn(r.id)}
                >
                  Вернуть
                </Button>
              )}
            </Group>
          )}
        </Table.Td>
      </Table.Tr>
    );
  };

  return (
    <Tabs defaultValue="active" color="gold">
      <Tabs.List>
        <Tabs.Tab value="active">Активные ({active.length})</Tabs.Tab>
        <Tabs.Tab value="history">История ({history.length})</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="active" pt="md">
        {active.length === 0 ? (
          <Box p="xl" ta="center">
            <Text c="dimmed">Нет активных броней</Text>
          </Box>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Книга</Table.Th>
                <Table.Th>Владелец</Table.Th>
                <Table.Th>Точка</Table.Th>
                <Table.Th>Период</Table.Th>
                <Table.Th>Статус</Table.Th>
                <Table.Th>Действия</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {active.map((r) => renderRow(r, false))}
            </Table.Tbody>
          </Table>
        )}
      </Tabs.Panel>

      <Tabs.Panel value="history" pt="md">
        {history.length === 0 ? (
          <Box p="xl" ta="center">
            <Text c="dimmed">История пуста</Text>
          </Box>
        ) : (
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Книга</Table.Th>
                <Table.Th>Владелец</Table.Th>
                <Table.Th>Точка</Table.Th>
                <Table.Th>Период</Table.Th>
                <Table.Th>Статус</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {history.map((r) => renderRow(r, true))}
            </Table.Tbody>
          </Table>
        )}
      </Tabs.Panel>
    </Tabs>
  );
}
