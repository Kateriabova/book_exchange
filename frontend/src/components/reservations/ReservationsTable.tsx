import { Table, Group, Button, Text, Box, useMantineTheme, Tooltip } from '@mantine/core';
import { IconCalendar, IconUser, IconMapPin, IconX, IconCheck } from '@tabler/icons-react';
import dayjs from 'dayjs';
import type { Reservation } from '../../mock/data';
import {
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
  const theme = useMantineTheme();

  const renderRow = (r: Reservation) => {
    const book = getBookById(r.book_id);
    const owner = getUserById(book?.owner_id || 0);
    const point = getPickupPointById(r.pickup_point_id);
    const isMine = r.borrower_id === currentUser.id;
    const isHistory = r.status === 'returned' || r.status === 'cancelled';

    const daysLeft = dayjs(r.due_date).diff(dayjs(), 'day');
    const daysUntilStart = dayjs(r.start_date).diff(dayjs(), 'day');

    return (
      <Table.Tr
        key={r.id}
        style={{ 
          opacity: isHistory ? 0.6 : 1,
          transition: 'background-color 0.15s ease',
        }}
      >
        <Table.Td>
          <Text size="sm" fw={500}>
            {book?.title}
          </Text>
          {owner && (
            <Text size="xs" c="dimmed">
              {owner.display_name}
            </Text>
          )}
        </Table.Td>
        <Table.Td>
          <Group gap={4}>
            <IconMapPin size={14} color={theme.colors.gray[6]} />
            <Text size="sm">{point?.name}</Text>
          </Group>
        </Table.Td>
        <Table.Td>
          <Group gap={4}>
            <IconCalendar size={14} color={theme.colors.gray[6]} />
            <Text size="xs">
              {dayjs(r.start_date).format('DD.MM')} — {dayjs(r.due_date).format('DD.MM.YYYY')}
            </Text>
          </Group>
          {!isHistory && r.status === 'reserved' && daysUntilStart > 0 && (
            <Text size="xs" c="gold" mt={2}>
              Начнётся через {daysUntilStart} дн.
            </Text>
          )}
          {!isHistory && r.status === 'active' && daysLeft > 0 && (
            <Text size="xs" c="bordeaux" mt={2}>
              Осталось {daysLeft} дн.
            </Text>
          )}
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
                <Tooltip label="Отменить бронь" withArrow>
                  <Button
                    variant="subtle"
                    color="bordeaux"
                    size="xs"
                    leftSection={<IconX size={14} />}
                    onClick={() => onCancel(r.id)}
                  >
                    Отменить
                  </Button>
                </Tooltip>
              )}
              {r.status === 'active' && (
                <Tooltip label="Подтвердить возврат" withArrow>
                  <Button
                    variant="light"
                    color="sage"
                    size="xs"
                    leftSection={<IconCheck size={14} />}
                    onClick={() => onReturn(r.id)}
                  >
                    Вернуть
                  </Button>
                </Tooltip>
              )}
            </Group>
          )}
        </Table.Td>
      </Table.Tr>
    );
  };

  if (reservations.length === 0) {
    return (
      <Box p="xl" ta="center">
        <Text c="dimmed">Нет данных для отображения</Text>
      </Box>
    );
  }

  return (
    <Table striped highlightOnHover verticalSpacing="sm">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Книга</Table.Th>
          <Table.Th>Точка выдачи</Table.Th>
          <Table.Th>Период</Table.Th>
          <Table.Th>Статус</Table.Th>
          <Table.Th>Действия</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{reservations.map(renderRow)}</Table.Tbody>
    </Table>
  );
}