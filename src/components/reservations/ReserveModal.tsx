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
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import {
  Book,
  getPickupPointById,
  getOccupiedDates,
  currentUser,
} from '../../mock/data';

interface ReserveModalProps {
  opened: boolean;
  onClose: () => void;
  book: Book | null;
  onReserve: ( {
    book_id: number;
    borrower_id: number;
    pickup_point_id: number;
    start_date: string;
    due_date: string;
  }) => void;
}

export function ReserveModal({ opened, onClose, book, onReserve }: ReserveModalProps) {
  const [pickupPointId, setPickupPointId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [loanDays, setLoanDays] = useState<number>(7);

  const occupiedDates = useMemo(() => {
    if (!book) return [];
    return getOccupiedDates(book.id);
  }, [book]);

  const pointOptions = useMemo(() => {
    if (!book) return [];
    return book.pickup_point_ids.map((id) => {
      const point = getPickupPointById(id);
      return { value: String(id), label: point?.name || '' };
    });
  }, [book]);

  const dueDate = useMemo(() => {
    if (!startDate) return null;
    return dayjs(startDate).add(loanDays, 'day').toDate();
  }, [startDate, loanDays]);

  const handleReserve = () => {
    if (!book || !pickupPointId || !startDate) return;
    onReserve({
      book_id: book.id,
      borrower_id: currentUser.id,
      pickup_point_id: Number(pickupPointId),
      start_date: dayjs(startDate).format('YYYY-MM-DD'),
      due_date: dayjs(startDate).add(loanDays, 'day').format('YYYY-MM-DD'),
    });
    onClose();
  };

  const loanChips = [7, 14, book?.max_loan_days || 21].filter(
    (v, i, arr) => arr.indexOf(v) === i
  );

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
        <Box
          p="sm"
          style={{
            backgroundColor: '#F5EFE3',
            borderRadius: 6,
            border: '1px solid #D9CDB4',
          }}
        >
          <Text fw={700} style={{ fontFamily: '"PT Serif", Georgia, serif' }}>
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
        />

        <DatePickerInput
          label="Дата начала"
          placeholder="Выберите дату"
          value={startDate}
          onChange={setStartDate}
          minDate={new Date()}
          excludeDate={(date) => occupiedDates.includes(dayjs(date).format('YYYY-MM-DD'))}
          required
          clearable
        />

        <Divider label="Срок" labelPosition="center" />

        <Box>
          <Text size="sm" mb="xs" fw={500}>
            Срок (дней):
          </Text>
          <Group gap="xs">
            {loanChips.map((days) => (
              <Button
                key={days}
                variant={loanDays === days ? 'filled' : 'outline'}
                color="gold"
                size="sm"
                onClick={() => setLoanDays(days)}
              >
                {days} дн.
              </Button>
            ))}
          </Group>
          <Text size="xs" c="dimmed" mt="xs">
            Максимум: {book.max_loan_days} дней (правило владельца)
          </Text>
        </Box>

        {startDate && dueDate && (
          <Box
            p="sm"
            style={{
              backgroundColor: '#F5EFE3',
              borderRadius: 6,
              border: '1px solid #D9CDB4',
            }}
          >
            <Text size="sm">
              Вернуть до:{' '}
              <strong>{dayjs(dueDate).format('DD.MM.YYYY')}</strong>
            </Text>
          </Box>
        )}

        <Group justify="flex-end" mt="md">
          <Button variant="subtle" color="gray" onClick={onClose}>
            Отмена
          </Button>
          <Button
            color="gold"
            onClick={handleReserve}
            disabled={!pickupPointId || !startDate || loanDays > book.max_loan_days}
          >
            Забронировать
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
