import { useState, useEffect } from 'react';
import {
  Modal,
  TextInput,
  NumberInput,
  Select,
  MultiSelect,
  Button,
  Group,
  Stack,
  Text,
  Divider,
} from '@mantine/core';
import type { Book } from '../../mock/data';
import { GENRES, pickupPoints } from '../../mock/data';

interface BookFormModalProps {
  opened: boolean;
  onClose: () => void;
  book: Book | null;
  onSave: (book: Omit<Book, 'id'> & { id?: number }) => void;
}

export function BookFormModal({ opened, onClose, book, onSave }: BookFormModalProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [pages, setPages] = useState<number | ''>('');
  const [language, setLanguage] = useState('');
  const [genre, setGenre] = useState<string | null>(null);
  const [maxLoanDays, setMaxLoanDays] = useState(21);
  const [pickupPointIds, setPickupPointIds] = useState<string[]>([]);

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setPublisher(book.publisher);
      setYear(book.year);
      setPages(book.pages);
      setLanguage(book.language);
      setGenre(book.genre);
      setMaxLoanDays(book.max_loan_days);
      setPickupPointIds(book.pickup_point_ids.map(String));
    } else {
      setTitle('');
      setAuthor('');
      setPublisher('');
      setYear('');
      setPages('');
      setLanguage('');
      setGenre(null);
      setMaxLoanDays(21);
      setPickupPointIds([]);
    }
  }, [book, opened]);

  const handleSave = () => {
    if (!title.trim() || !author.trim()) return;
    onSave({
      ...(book ? { id: book.id } : {}),
      owner_id: book?.owner_id ?? 1,
      title: title.trim(),
      author: author.trim(),
      publisher: publisher.trim(),
      year: Number(year) || new Date().getFullYear(),
      pages: Number(pages) || 0,
      language: language.trim(),
      genre: genre || '',
      max_loan_days: maxLoanDays,
      pickup_point_ids: pickupPointIds.map(Number),
    });
    onClose();
  };

  const pointOptions = pickupPoints.map((p) => ({ value: String(p.id), label: p.name }));
  const genreOptions = GENRES.map((g) => ({ value: g, label: g }));

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={book ? 'Редактировать книгу' : 'Добавить книгу'}
      size="lg"
      centered
    >
      <Stack gap="md">
        <TextInput
          label="Название"
          placeholder="Введите название книги"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          required
        />
        <TextInput
          label="Автор"
          placeholder="Введите автора"
          value={author}
          onChange={(e) => setAuthor(e.currentTarget.value)}
          required
        />
        <Group grow>
          <TextInput
            label="Издательство"
            placeholder="Издательство"
            value={publisher}
            onChange={(e) => setPublisher(e.currentTarget.value)}
          />
          <NumberInput
            label="Год"
            placeholder="2024"
            value={year}
            onChange={(v) => setYear(v as number)}
          />
        </Group>
        <Group grow>
          <NumberInput
            label="Страницы"
            placeholder="320"
            value={pages}
            onChange={(v) => setPages(v as number)}
          />
          <TextInput
            label="Язык"
            placeholder="Русский"
            value={language}
            onChange={(e) => setLanguage(e.currentTarget.value)}
          />
        </Group>
        <Select
          label="Жанр"
          placeholder="Выберите жанр"
          data={genreOptions}
          value={genre}
          onChange={setGenre}
          clearable
        />

        <Divider label="Правила выдачи (владелец)" labelPosition="center" />

        <NumberInput
          label="Максимальный срок (дни)"
          value={maxLoanDays}
          onChange={(v) => setMaxLoanDays(v as number)}
          min={1}
          max={60}
        />
        <MultiSelect
          label="Точки выдачи"
          placeholder="Выберите точки"
          data={pointOptions}
          value={pickupPointIds}
          onChange={setPickupPointIds}
        />

        <Text size="xs" c="dimmed">
          Эти правила применяются к новым броням. Существующие брони не изменяются.
        </Text>

        <Group justify="flex-end" mt="md">
          <Button variant="subtle" color="gray" onClick={onClose}>
            Отмена
          </Button>
          <Button
            color="gold"
            onClick={handleSave}
            disabled={!title.trim() || !author.trim()}
          >
            {book ? 'Сохранить' : 'Добавить'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
