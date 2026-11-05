import { Card, Text, Group, Badge, Button, Stack, Box, Tooltip, useMantineTheme } from '@mantine/core';
import { IconLock, IconEdit, IconTrash } from '@tabler/icons-react';
import type { Book } from '../../mock/data';
import { getLoansCount, getMaxLoansCount, getOpenReservationsForBook, getPickupPointById } from '../../mock/data';
import { LoansBar } from '../ui/LoansBar';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onRemove: (book: Book) => void;
  onCancelReservation?: (bookId: number) => void;
}

export function BookCard({ book, onEdit, onRemove, onCancelReservation }: BookCardProps) {
  const theme = useMantineTheme();
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
        backgroundColor: theme.other.card,
        borderColor: theme.other.border,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 300,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        ':hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows.md,
        },
      }}
    >
      <Stack gap="sm" style={{ flex: 1 }}>
        <Box>
          <Text
            fw={700}
            size="lg"
            style={{ fontFamily: theme.headings.fontFamily }}
            lineClamp={2}
          >
            {book.title}
          </Text>
          <Text c="dimmed" size="sm" lineClamp={1}>
            {book.author}
          </Text>
        </Box>

        <Text size="xs" c="dimmed" lineClamp={2}>
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

        <Text size="xs" c="dimmed" lineClamp={2}>
          Точки выдачи:{' '}
          {book.pickup_point_ids
            .map((id) => getPickupPointById(id)?.name)
            .filter(Boolean)
            .join(', ')}
        </Text>
      </Stack>

      <Group gap="xs" mt="md" wrap="wrap">
        <Button
          variant="light"
          color="gold"
          size="xs"
          leftSection={<IconEdit size={14} />}
          onClick={() => onEdit(book)}
        >
          Редактировать
        </Button>
        <Tooltip
          label={hasActive ? 'Нельзя изъять: есть активная бронь' : 'Изъять книгу'}
          disabled={!hasActive}
          withArrow
        >
          <Box>
            <Button
              variant="light"
              color="bordeaux"
              size="xs"
              leftSection={hasActive ? <IconLock size={14} /> : <IconTrash size={14} />}
              disabled={hasActive}
              onClick={() => onRemove(book)}
            >
              Изъять
            </Button>
          </Box>
        </Tooltip>
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
    </Card>
  );
}