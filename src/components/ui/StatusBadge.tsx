import { Badge } from '@mantine/core';
import dayjs from 'dayjs';
import { Reservation, ReservationStatus } from '../../mock/data';

interface StatusBadgeProps {
  status: ReservationStatus;
  startDate?: string;
  dueDate?: string;
}

export function StatusBadge({ status, startDate, dueDate }: StatusBadgeProps) {
  const today = dayjs();

  if (status === 'returned') {
    return (
      <Badge color="sage" variant="light" size="sm">
        Возвращена
      </Badge>
    );
  }

  if (status === 'cancelled') {
    return (
      <Badge color="gray" variant="light" size="sm">
        Отменена
      </Badge>
    );
  }

  if (status === 'reserved' && startDate) {
    const daysUntil = dayjs(startDate).diff(today, 'day');
    return (
      <Badge color="gold" variant="light" size="sm">
        Начнётся через {daysUntil} дн.
      </Badge>
    );
  }

  if (status === 'active' && dueDate) {
    const daysLeft = dayjs(dueDate).diff(today, 'day');
    return (
      <Badge color="bordeaux" variant="light" size="sm">
        Осталось {daysLeft} дн.
      </Badge>
    );
  }

  return null;
}

interface BookStatusBadgeProps {
  isAvailable: boolean;
  activeDueDate?: string;
  reservedStartDate?: string;
}

export function BookStatusBadge({ isAvailable, activeDueDate, reservedStartDate }: BookStatusBadgeProps) {
  if (isAvailable) {
    return (
      <Badge color="sage" variant="light" size="sm">
        Доступна сейчас
      </Badge>
    );
  }

  const parts: React.ReactNode[] = [];

  if (activeDueDate) {
    const daysLeft = dayjs(activeDueDate).diff(dayjs(), 'day');
    parts.push(
      <Badge key="active" color="bordeaux" variant="light" size="sm">
        На руках до {dayjs(activeDueDate).format('DD.MM')}
      </Badge>
    );
  }

  if (reservedStartDate) {
    parts.push(
      <Badge key="reserved" color="gold" variant="light" size="sm">
        Зарезервирована с {dayjs(reservedStartDate).format('DD.MM')}
      </Badge>
    );
  }

  return <>{parts}</>;
}
