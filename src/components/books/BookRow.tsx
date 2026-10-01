import { Group, Text, Button, Box, Stack } from '@mantine/core';
import {
  Book,
  getUserById,
  getLoansCount,
  getMaxLoansCount,
  isBookAvailableToday,
  getActiveReservationForBook,
  getNextReservedForBook,
} from '../../mock/data';
import { BookStatusBadge } from '../ui/StatusBadge';
import { LoansBar } from '../ui/LoansBar';

interface BookRowProps {
  book: Book;
  onReserve: (book: Book) => void;
}

export function BookRow({ book, onReserve }: BookRowProps) {
  const owner = getUserById(book.owner_id);
  const loansCount = getLoansCount(book.id);
  const maxCount = getMaxLoansCount();
  const available = isBookAvailableToday(book.id);
  const activeRes = getActiveReservationForBook(book.id);
  const nextReserved = getNextReservedForBook(book.id);

  const meta = [book.publisher, book.year, `${book.pages} стр.`, book.language, book.genre]
    .filter(Boolean)
    .join(' • ');

  return (
    <Box
      p="md"
      style={{
        backgroundColor: '#FBF7EE',
        border: '1px solid #D9CDB4',
        borderRadius: 6,
      }}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Stack gap={4} style={{ flex: 1 }}>
          <Text fw={700} size="lg" style={{ fontFamily: '"PT Serif", Georgia, serif' }}>
            {book.title}
          </Text>
          <Text c="dimmed" size="sm">
            {book.author}
          </Text>
          <Text size="xs" c="dimmed">
            {meta}
          </Text>
          <Text size="xs" c="dimmed">
            Владелец: {owner?.display_name}
          </Text>
          <Group gap="xs" mt={4} align="center">
            <LoansBar count={loansCount} max={maxCount} />
            <Text size="xs" c="dimmed">
              {loansCount} брон.
            </Text>
          </Group>
          <Group gap="xs" mt={4} wrap="wrap">
            <BookStatusBadge
              isAvailable={available}
              activeDueDate={activeRes?.due_date}
              reservedStartDate={nextReserved?.start_date}
            />
          </Group>
        </Stack>
        <Button color="gold" variant="filled" size="sm" onClick={() => onReserve(book)}>
          Забронировать
        </Button>
      </Group>
    </Box>
  );
}
