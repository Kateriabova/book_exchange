import { useState, useMemo } from 'react';
import {
  Modal,
  Select,
  Group,
  Button,
  Stack,
  Text,
  Box,
  Divider,
  useMantineTheme,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { Book } from '../../mock/data';
import { getPickupPointById, getOccupiedDates, currentUser } from '../../mock/data';

interface ReserveModalProps {
  opened: boolean;
  onClose: () => void;
  book: Book | null;
  onReserve: (data: {
    book_id: number;
    borrower_id: number;
    pickup_point_id: number;
    start_date: string;
    due_date: string;
  }) => void;
}

export function ReserveModal({ opened, onClose, book, onReserve }: ReserveModalProps) {
  const theme = useMantineTheme();

  const [pickupPointId, setPickupPointId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [loanDays, setLoanDays] = useState<number>(7);

  const occupiedDates = useMemo(() => {
    if (!book) return [];
    return getOccupiedDates(book.id);
  }, [book]);

  const pointOptions = useMemo(() => {
    if (!book) return [];
    return book.pickup_point_ids.map((id) => {
      const point = getPickupPointById(id);
      return { value: String(id), label: point?.name || 'Неизвестная точка' };
    });
  }, [book]);

  const dueDate = useMemo(() => {
    if (!startDate) return null;
    return dayjs(startDate).add(loanDays, 'day');
  }, [startDate, loanDays]);

  const loanChips = useMemo(() => {
    const max = book?.max_loan_days || 21;
    const options = [7, 14, max];
    return [...new Set(options)].sort((a, b) => a - b);
  }, [book]);

  const handleReserve = () => {
    if (!book || !pickupPointId || !startDate) return;
    onReserve({
      book_id: book.id,
      borrower_id: currentUser.id,
      pickup_point_id: Number(pickupPointId),
      start_date: startDate,
      due_date: dayjs(startDate).add(loanDays, 'day').format('YYYY-MM-DD'),
    });
    onClose();
  };

  const isDateDisabled = (date: string) => {
    const isPast = dayjs(date).isBefore(dayjs(), 'day');
    const isOccupied = occupiedDates.includes(date);
    return isPast || isOccupied;
  };

  const parchmentBoxStyle = {
    backgroundColor: theme.other.card,
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.other.border}`,
  };

  if (!book) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Забронировать книгу"
      size="md"
      centered
    >
      <Stack gap="md">
        <Box p="sm" style={parchmentBoxStyle}>
          <Text fw={700} style={{ fontFamily: theme.headings.fontFamily }}>
            {book.title}
          </Text>
          <Text size="sm" c="dimmed">
            {book.author}
          </Text>
          <Text size="xs" c="dimmed" mt={4}>
            Лимит владельца: до {book.max_loan_days} дней
          </Text>
        </Box>
        <Select
          label="Точка выдачи"
          placeholder="Выберите точку"
          data={pointOptions}
          value={pickupPointId}
          onChange={setPickupPointId}
          required
          nothingFoundMessage="Нет доступных точек"
        />
        <DatePickerInput
          label="Дата начала"
          placeholder="Выберите дату"
          value={startDate}
          onChange={setStartDate}
          minDate={new Date()}
          excludeDate={isDateDisabled}
          required
          clearable
          valueFormat="YYYY-MM-DD"
        />
        <Divider label="Срок аренды" labelPosition="center" color={theme.other.border} />
        <Box>
          <Text size="sm" mb="xs" fw={500}>
            Выберите срок (дней):
          </Text>
          <Group gap="xs">
            {loanChips.map((days) => {
              const isDisabled = days > book.max_loan_days;
              return (
                <Button
                  key={days}
                  variant={loanDays === days ? 'filled' : 'outline'}
                  color="gold"
                  size="sm"
                  disabled={isDisabled}
                  onClick={() => setLoanDays(days)}
                >
                  {days} дн.
                </Button>
              );
            })}
          </Group>
        </Box>
        {startDate && dueDate && (
          <Box p="sm" style={parchmentBoxStyle}>
            <Text size="sm">
              Вернуть до:{' '}
              <strong style={{ color: theme.colors.gold[6] }}>
                {dueDate.format('DD.MM.YYYY')}
              </strong>
            </Text>
          </Box>
        )}
        <Group justify="flex-end" mt="md">
          <Button variant="subtle" color="gray" onClick={onClose}>
            Отмена
          </Button>
          <Button
            onClick={handleReserve}
            disabled={!pickupPointId || !startDate || loanDays > book.max_loan_days}
          >
            Подтвердить бронь
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}