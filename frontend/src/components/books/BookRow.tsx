import { Group, Text, Button, Box, Stack, useMantineTheme } from '@mantine/core';
import type { Book } from '../../mock/data';
import {
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
  const theme = useMantineTheme();
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
        backgroundColor: theme.other.card,
        border: `1px solid ${theme.other.border}`,
        borderRadius: theme.radius.sm,
        transition: 'all 0.2s ease',
        ':hover': {
          borderColor: theme.colors.gold[6],
          transform: 'translateX(4px)',
        },
      }}
    >
      <Stack gap="sm">
        <Stack gap={4}>
          <Text fw={700} size="lg" style={{ fontFamily: theme.headings.fontFamily }}>
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
        <Box>
          <Button
            color="gold"
            variant="filled"
            size="sm"
            fullWidth
            onClick={() => onReserve(book)}
            style={{ maxWidth: 200 }}
          >
            Забронировать
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}