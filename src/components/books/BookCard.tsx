import { Card, Text, Group, Badge, Button, Stack, Box } from '@mantine/core';
import { type Book, getLoansCount, getMaxLoansCount, getOpenReservationsForBook, getPickupPointById } from '../../mock/data';
import { LoansBar } from '../ui/LoansBar';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onRemove: (book: Book) => void;
  onCancelReservation?: (bookId: number) => void;
}

export function BookCard({ book, onEdit, onRemove, onCancelReservation }: BookCardProps) {
  const loansCount = getLoansCount(book.id);
  const maxCount = getMaxLoansCount();
  const openReservations = getOpenReservationsForBook(book.id);
  const hasActive = openReservations.some((r) => r.status === 'active');
  const hasReserved = openReservations.filter((r) => r.status === 'reserved');

  const meta = [book.publisher, book.year, `${book.pages} стр.`, book.language, book.genre]
    .filter(Boolean)
    .join(' • ');

  return (
    <Card
      shadow="xs"
      padding="md"
      withBorder
      style={{
        backgroundColor: '#FBF7EE',
        borderColor: '#D9CDB4',
      }}
    >
      <Stack gap="sm">
        <Box>
          <Text fw={700} size="lg" style={{ fontFamily: '"PT Serif", Georgia, serif' }}>
            {book.title}
          </Text>
          <Text c="dimmed" size="sm">
            {book.author}
          </Text>
        </Box>

        <Text size="xs" c="dimmed">
          {meta}
        </Text>

        <Group gap="xs" wrap="wrap">
          {hasActive && (
            <Badge color="bordeaux" variant="light" size="sm">
              На руках
            </Badge>
          )}
          {hasReserved.length > 0 && (
            <Badge color="gold" variant="light" size="sm">
              {hasReserved.length} бронь(ей)
            </Badge>
          )}
          {!hasActive && hasReserved.length === 0 && (
            <Badge color="sage" variant="light" size="sm">
              Свободна
            </Badge>
          )}
        </Group>

        <Group gap="xs" align="center">
          <Text size="xs" c="dimmed">
            Популярность:
          </Text>
          <LoansBar count={loansCount} max={maxCount} />
          <Text size="xs" c="dimmed">
            {loansCount}
          </Text>
        </Group>

        <Text size="xs" c="dimmed">
          Точки выдачи:{' '}
          {book.pickup_point_ids
            .map((id) => getPickupPointById(id)?.name)
            .filter(Boolean)
            .join(', ')}
        </Text>

        <Group gap="xs" mt="xs">
          <Button variant="light" color="gold" size="xs" onClick={() => onEdit(book)}>
            Редактировать
          </Button>
          <Button
            variant="light"
            color="bordeaux"
            size="xs"
            leftSection={hasActive ? '🔒' : undefined}
            disabled={hasActive}
            onClick={() => onRemove(book)}
          >
            Изъять
          </Button>
          {hasReserved.length > 0 && onCancelReservation && (
            <Button
              variant="subtle"
              color="bordeaux"
              size="xs"
              onClick={() => onCancelReservation(book.id)}
            >
              Отменить бронь
            </Button>
          )}
        </Group>
      </Stack>
    </Card>
  );
}
