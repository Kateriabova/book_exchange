import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Title,
  TextInput,
  Button,
  Stack,
  Group,
  SimpleGrid,
  Paper,
  Text,
  Divider,
  Skeleton,
  useMantineTheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { Book } from '../mock/data';
import {
  getMyBooks,
  getMyBooksLentOut,
  getMyBooksTotalLoans,
  currentUser,
} from '../mock/data';
import { BookCard } from '../components/books/BookCard';
import { BookFormModal } from '../components/books/BookFormModal';
import { StatsStrip } from '../components/ui/StatsStrip';
import { EmptyState } from '../components/ui/EmptyState';

export function MyLibraryPage() {
  const theme = useMantineTheme();
  const [search, setSearch] = useState('');
  const [formOpened, setFormOpened] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const myBooks = getMyBooks();
  const lentOut = getMyBooksLentOut();
  const totalLoans = getMyBooksTotalLoans();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredBooks = useMemo(() => {
    if (!search.trim()) return myBooks;
    const q = search.toLowerCase();
    return myBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.publisher || '').toLowerCase().includes(q)
    );
  }, [search, myBooks]);

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormOpened(true);
  };

  const handleRemove = (_book: Book) => {
    // Демо
  };

  const handleSave = (_data: unknown) => {
    setFormOpened(false);
    setEditingBook(null);
    notifications.show({
      title: 'Книга сохранена',
      message: 'Изменения успешно применены',
      color: 'sage',
    });
  };

  return (
    <Box p="md" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <Stack gap="md">
        <Group justify="space-between" wrap="wrap">
          <Title order={2} style={{ fontFamily: '"PT Serif", Georgia, serif' }}>
            📜 Мои книги
          </Title>
          <Button
            color="gold"
            onClick={() => {
              setEditingBook(null);
              setFormOpened(true);
            }}
            disabled={isLoading}
          >
            ✨ Добавить книгу
          </Button>
        </Group>

        <TextInput
          placeholder="Поиск по названию, автору, издательству..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          disabled={isLoading}
        />

        <Group align="flex-start" gap="md" wrap="wrap">
          <Paper
            p="md"
            withBorder
            style={{
              backgroundColor: theme.other.card,
              borderColor: theme.other.border,
              flex: '0 0 260px',
              minWidth: 0,
            }}
          >
            <Stack gap="sm">
              <Title order={4} style={{ fontFamily: '"PT Serif", Georgia, serif' }}>
                {currentUser.display_name}
              </Title>
              <Text size="sm" c="dimmed">
                @{currentUser.login}
              </Text>
              <Divider />
              <StatsStrip
                items={[
                  { label: 'Моих книг', value: myBooks.length },
                  { label: 'Сейчас на руках', value: lentOut, color: 'bordeaux' },
                  { label: 'Всего броней', value: totalLoans, color: 'sage' },
                ]}
              />
            </Stack>
          </Paper>

          <Box style={{ flex: 1, minWidth: 0 }}>
            {isLoading ? (
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} height={200} radius="sm" />
                ))}
              </SimpleGrid>
            ) : filteredBooks.length === 0 ? (
              <EmptyState message="Ваша библиотека пуста" icon="📜" />
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onEdit={handleEdit}
                    onRemove={handleRemove}
                  />
                ))}
              </SimpleGrid>
            )}
          </Box>
        </Group>
      </Stack>

      <BookFormModal
        opened={formOpened}
        onClose={() => {
          setFormOpened(false);
          setEditingBook(null);
        }}
        book={editingBook}
        onSave={handleSave}
      />
    </Box>
  );
}