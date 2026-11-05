import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Title,
  TextInput,
  Select,
  Checkbox,
  Stack,
  Group,
  Skeleton,
} from '@mantine/core';
import type { Book } from '../mock/data';
import { books, isBookAvailableToday } from '../mock/data';
import { BookRow } from '../components/books/BookRow';
import { ReserveModal } from '../components/reservations/ReserveModal';
import { EmptyState } from '../components/ui/EmptyState';

type SortOption = 'loans' | 'title' | 'author' | 'year';

export function CatalogPage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('loans');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [reserveBook, setReserveBook] = useState<Book | null>(null);
  
  // Состояние загрузки (имитация запроса к API)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }

    if (onlyAvailable) {
      result = result.filter((b) => isBookAvailableToday(b.id));
    }

    if (sort === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'author') {
      result.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sort === 'year') {
      result.sort((a, b) => b.year - a.year);
    }

    return result;
  }, [search, sort, onlyAvailable]);

  return (
    <Box p="md" style={{ maxWidth: 960, margin: '0 auto' }}>
      <Stack gap="md">
        <Title order={2} style={{ fontFamily: '"PT Serif", Georgia, serif' }}>
          Каталог книг
        </Title>

        <Stack gap="sm">
          <TextInput
            label="Поиск"
            placeholder="По названию или автору..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            disabled={isLoading}
          />
          <Group gap="md" wrap="wrap" align="flex-end">
            <Select
              label="Сортировка"
              value={sort}
              onChange={(v) => setSort((v as SortOption) || 'loans')}
              data={[
                { value: 'loans', label: 'По популярности' },
                { value: 'title', label: 'По названию' },
                { value: 'author', label: 'По автору' },
                { value: 'year', label: 'По году издания' },
              ]}
              style={{ minWidth: 180 }}
              disabled={isLoading}
            />
            <Checkbox
              label="Только свободные сейчас"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.currentTarget.checked)}
              color="gold"
              disabled={isLoading}
            />
          </Group>
        </Stack>

        {isLoading ? (
          <Stack gap="sm">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height={80} radius="sm" />
            ))}
          </Stack>
        ) : filteredBooks.length === 0 ? (
          <EmptyState message="Ничего не найдено" icon="📜" />
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
        onReserve={() => setReserveBook(null)}
      />
    </Box>
  );
}