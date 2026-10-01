import { useState, useMemo } from 'react';
import {
  Box,
  Title,
  TextInput,
  Select,
  Checkbox,
  Stack,
  Group,
} from '@mantine/core';
import {
  books,
  type Book,
  isBookAvailableToday,
} from '../mock/data';
import { BookRow } from '../components/books/BookRow';
import { ReserveModal } from '../components/reservations/ReserveModal';
import { EmptyState } from '../components/ui/EmptyState';

type SortOption = 'loans' | 'title' | 'year';

export function CatalogPage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('loans');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [reserveBook, setReserveBook] = useState<Book | null>(null);

  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Поиск
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      );
    }

    // Только доступные
    if (onlyAvailable) {
      result = result.filter((b) => isBookAvailableToday(b.id));
    }

    // Сортировка
    if (sort === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'year') {
      result.sort((a, b) => b.year - a.year);
    }
    // По умолчанию — по loans_count (не меняем порядок, т.к. данные уже в нужном порядке для демо)

    return result;
  }, [search, sort, onlyAvailable]);

  return (
    <Box p="md" style={{ maxWidth: 960, margin: '0 auto' }}>
      <Stack gap="md">
        <Title
          order={2}
          style={{ fontFamily: '"PT Serif", Georgia, serif', color: '#2E2418' }}
        >
          Каталог книг
        </Title>

        <Group gap="md" wrap="wrap" align="flex-end">
          <TextInput
            label="Поиск"
            placeholder="По названию или автору..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1, minWidth: 200 }}
          />
          <Select
            label="Сортировка"
            value={sort}
            onChange={(v) => setSort((v as SortOption) || 'loans')}
            data={[
              { value: 'loans', label: 'По популярности' },
              { value: 'title', label: 'По названию' },
              { value: 'year', label: 'По году' },
            ]}
            style={{ width: 200 }}
          />
          <Checkbox
            label="Только доступные сейчас"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.currentTarget.checked)}
            color="gold"
          />
        </Group>

        {filteredBooks.length === 0 ? (
          <EmptyState message="Ничего не найдено" icon="🔍" />
        ) : (
          <Stack gap="sm">
            {filteredBooks.map((book) => (
              <BookRow
                key={book.id}
                book={book}
                onReserve={setReserveBook}
              />
            ))}
          </Stack>
        )}
      </Stack>

      <ReserveModal
        opened={!!reserveBook}
        onClose={() => setReserveBook(null)}
        book={reserveBook}
        onReserve={() => {
          // Демо: просто закрываем модалку
          setReserveBook(null);
        }}
      />
    </Box>
  );
}
