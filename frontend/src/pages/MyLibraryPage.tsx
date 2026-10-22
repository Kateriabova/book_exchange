import { useState, useMemo } from 'react';
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
} from '@mantine/core';
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
  const [search, setSearch] = useState('');
  const [formOpened, setFormOpened] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const myBooks = getMyBooks();
  const lentOut = getMyBooksLentOut();
  const totalLoans = getMyBooksTotalLoans();

  const filteredBooks = useMemo(() => {
    if (!search.trim()) return myBooks;
    const q = search.toLowerCase();
    return myBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.publisher.toLowerCase().includes(q)
    );
  }, [search]);

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormOpened(true);
  };

  const handleRemove = (_book: Book) => {
    // Демо: ничего не делаем
  };

  const handleSave = (_data: unknown) => {
    // Демо: просто закрываем форму
    setFormOpened(false);
    setEditingBook(null);
  };

  return (
    <Box p="md" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <Stack gap="md">
        <Group justify="space-between" wrap="wrap">
          <Title
            order={2}
            style={{ fontFamily: '"PT Serif", Georgia, serif', color: '#2E2418' }}
          >
            📜 Мои книги
          </Title>
          <Button
            color="gold"
            onClick={() => {
              setEditingBook(null);
              setFormOpened(true);
            }}
          >
            ✨ Добавить книгу
          </Button>
        </Group>

        <TextInput
          placeholder="Поиск по названию, автору, издательству..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />

        <Group align="flex-start" gap="md" wrap="wrap">
          {/* Sidebar */}
          <Paper
            p="md"
            withBorder
            style={{
              backgroundColor: '#FBF7EE',
              borderColor: '#D9CDB4',
              flex: '0 0 260px',
              minWidth: 0,
            }}
          >
            <Stack gap="sm">
              <Title
                order={4}
                style={{ fontFamily: '"PT Serif", Georgia, serif', color: '#2E2418' }}
              >
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
                  { label: 'Общее количество броней', value: totalLoans, color: 'sage' },
                ]}
              />
            </Stack>
          </Paper>

          {/* Main content */}
          <Box style={{ flex: 1, minWidth: 0 }}>
            {filteredBooks.length === 0 ? (
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
