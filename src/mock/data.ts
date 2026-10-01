import dayjs from 'dayjs';

export interface User {
  id: number;
  login: string;
  display_name: string;
}

export interface PickupPoint {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  owner_id: number;
  title: string;
  author: string;
  publisher: string;
  year: number;
  pages: number;
  language: string;
  genre: string;
  max_loan_days: number;
  pickup_point_ids: number[];
}

export type ReservationStatus = 'reserved' | 'active' | 'returned' | 'cancelled';

export interface Reservation {
  id: number;
  book_id: number;
  borrower_id: number;
  pickup_point_id: number;
  start_date: string;
  due_date: string;
  status: ReservationStatus;
  created_at: string;
}

export const GENRES = [
  'Художественная литература',
  'Научная фантастика',
  'Фэнтези',
  'Детектив',
  'Историческая проза',
  'Научпоп',
  'Философия',
  'Поэзия',
  'Биография',
  'Психология',
  'Бизнес',
  'Технические',
];

export const currentUser: User = {
  id: 1,
  login: 'reader',
  display_name: 'Алексей Книголюбов',
};

export const otherUser: User = {
  id: 2,
  login: 'bookworm',
  display_name: 'Мария Страничкина',
};

export const thirdUser: User = {
  id: 3,
  login: 'pages',
  display_name: 'Дмитрий Томов',
};

export const pickupPoints: PickupPoint[] = [
  { id: 1, name: 'Локер у главного зала' },
  { id: 2, name: 'Кафе «Совиная почта»' },
  { id: 3, name: 'Библиостойка' },
];

export const books: Book[] = [
  {
    id: 1,
    owner_id: 1,
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    publisher: 'АСТ',
    year: 2018,
    pages: 480,
    language: 'Русский',
    genre: 'Художественная литература',
    max_loan_days: 21,
    pickup_point_ids: [1, 2],
  },
  {
    id: 2,
    owner_id: 1,
    title: 'Преступление и наказание',
    author: 'Фёдор Достоевский',
    publisher: 'Азбука',
    year: 2020,
    pages: 608,
    language: 'Русский',
    genre: 'Художественная литература',
    max_loan_days: 14,
    pickup_point_ids: [1, 3],
  },
  {
    id: 3,
    owner_id: 1,
    title: '1984',
    author: 'Джордж Оруэлл',
    publisher: 'ACT',
    year: 2019,
    pages: 320,
    language: 'Русский',
    genre: 'Научная фантастика',
    max_loan_days: 21,
    pickup_point_ids: [2, 3],
  },
  {
    id: 4,
    owner_id: 2,
    title: 'Дюна',
    author: 'Фрэнк Герберт',
    publisher: 'АСТ',
    year: 2021,
    pages: 736,
    language: 'Русский',
    genre: 'Научная фантастика',
    max_loan_days: 28,
    pickup_point_ids: [1, 2, 3],
  },
  {
    id: 5,
    owner_id: 2,
    title: 'Война и мир',
    author: 'Лев Толстой',
    publisher: 'Азбука',
    year: 2017,
    pages: 1216,
    language: 'Русский',
    genre: 'Историческая проза',
    max_loan_days: 30,
    pickup_point_ids: [1, 2],
  },
  {
    id: 6,
    owner_id: 3,
    title: 'Sapiens. Краткая история человечества',
    author: 'Юваль Ной Харари',
    publisher: 'Синдбад',
    year: 2022,
    pages: 520,
    language: 'Русский',
    genre: 'Научпоп',
    max_loan_days: 14,
    pickup_point_ids: [2, 3],
  },
  {
    id: 7,
    owner_id: 3,
    title: 'Маленький принц',
    author: 'Антуан де Сент-Экзюпери',
    publisher: 'АСТ',
    year: 2020,
    pages: 96,
    language: 'Русский',
    genre: 'Художественная литература',
    max_loan_days: 7,
    pickup_point_ids: [1, 2, 3],
  },
  {
    id: 8,
    owner_id: 1,
    title: 'Анна Каренина',
    author: 'Лев Толстой',
    publisher: 'Азбука',
    year: 2019,
    pages: 864,
    language: 'Русский',
    genre: 'Художественная литература',
    max_loan_days: 21,
    pickup_point_ids: [1, 3],
  },
];

const today = dayjs();

export const reservations: Reservation[] = [
  {
    id: 1,
    book_id: 4,
    borrower_id: 1,
    pickup_point_id: 2,
    start_date: today.subtract(3, 'day').format('YYYY-MM-DD'),
    due_date: today.add(18, 'day').format('YYYY-MM-DD'),
    status: 'active',
    created_at: today.subtract(10, 'day').format('YYYY-MM-DD'),
  },
  {
    id: 2,
    book_id: 1,
    borrower_id: 2,
    pickup_point_id: 1,
    start_date: today.add(5, 'day').format('YYYY-MM-DD'),
    due_date: today.add(26, 'day').format('YYYY-MM-DD'),
    status: 'reserved',
    created_at: today.subtract(2, 'day').format('YYYY-MM-DD'),
  },
  {
    id: 3,
    book_id: 1,
    borrower_id: 3,
    pickup_point_id: 2,
    start_date: today.subtract(30, 'day').format('YYYY-MM-DD'),
    due_date: today.subtract(9, 'day').format('YYYY-MM-DD'),
    status: 'returned',
    created_at: today.subtract(35, 'day').format('YYYY-MM-DD'),
  },
  {
    id: 4,
    book_id: 2,
    borrower_id: 1,
    pickup_point_id: 3,
    start_date: today.subtract(20, 'day').format('YYYY-MM-DD'),
    due_date: today.subtract(6, 'day').format('YYYY-MM-DD'),
    status: 'returned',
    created_at: today.subtract(25, 'day').format('YYYY-MM-DD'),
  },
  {
    id: 5,
    book_id: 6,
    borrower_id: 1,
    pickup_point_id: 2,
    start_date: today.add(10, 'day').format('YYYY-MM-DD'),
    due_date: today.add(24, 'day').format('YYYY-MM-DD'),
    status: 'reserved',
    created_at: today.subtract(1, 'day').format('YYYY-MM-DD'),
  },
  {
    id: 6,
    book_id: 3,
    borrower_id: 2,
    pickup_point_id: 3,
    start_date: today.subtract(15, 'day').format('YYYY-MM-DD'),
    due_date: today.subtract(1, 'day').format('YYYY-MM-DD'),
    status: 'returned',
    created_at: today.subtract(20, 'day').format('YYYY-MM-DD'),
  },
  {
    id: 7,
    book_id: 5,
    borrower_id: 1,
    pickup_point_id: 1,
    start_date: today.subtract(40, 'day').format('YYYY-MM-DD'),
    due_date: today.subtract(10, 'day').format('YYYY-MM-DD'),
    status: 'returned',
    created_at: today.subtract(45, 'day').format('YYYY-MM-DD'),
  },
  {
    id: 8,
    book_id: 7,
    borrower_id: 3,
    pickup_point_id: 2,
    start_date: today.subtract(5, 'day').format('YYYY-MM-DD'),
    due_date: today.add(2, 'day').format('YYYY-MM-DD'),
    status: 'cancelled',
    created_at: today.subtract(8, 'day').format('YYYY-MM-DD'),
  },
];

// Helper functions
export function getBookById(id: number): Book | undefined {
  return books.find((b) => b.id === id);
}

export function getPickupPointById(id: number): PickupPoint | undefined {
  return pickupPoints.find((p) => p.id === id);
}

export function getUserById(id: number): User | undefined {
  if (id === 1) return currentUser;
  if (id === 2) return otherUser;
  if (id === 3) return thirdUser;
  return undefined;
}

export function getReservationsForBook(bookId: number): Reservation[] {
  return reservations.filter((r) => r.book_id === bookId);
}

export function getOpenReservationsForBook(bookId: number): Reservation[] {
  return reservations.filter(
    (r) => r.book_id === bookId && (r.status === 'reserved' || r.status === 'active')
  );
}

export function getLoansCount(bookId: number): number {
  return reservations.filter((r) => r.book_id === bookId && r.status !== 'cancelled').length;
}

export function isBookAvailableToday(bookId: number): boolean {
  const todayStr = today.format('YYYY-MM-DD');
  const openReservations = getOpenReservationsForBook(bookId);
  return !openReservations.some(
    (r) => r.start_date <= todayStr && r.due_date >= todayStr
  );
}

export function getActiveReservationForBook(bookId: number): Reservation | undefined {
  const todayStr = today.format('YYYY-MM-DD');
  return reservations.find(
    (r) =>
      r.book_id === bookId &&
      r.status === 'active' &&
      r.start_date <= todayStr &&
      r.due_date >= todayStr
  );
}

export function getNextReservedForBook(bookId: number): Reservation | undefined {
  const todayStr = today.format('YYYY-MM-DD');
  return reservations
    .filter(
      (r) =>
        r.book_id === bookId && r.status === 'reserved' && r.start_date > todayStr
    )
    .sort((a, b) => a.start_date.localeCompare(b.start_date))[0];
}

export function getOccupiedDates(bookId: number): string[] {
  const openReservations = getOpenReservationsForBook(bookId);
  const dates: string[] = [];
  for (const r of openReservations) {
    let d = dayjs(r.start_date);
    const end = dayjs(r.due_date);
    while (d.isBefore(end) || d.isSame(end, 'day')) {
      dates.push(d.format('YYYY-MM-DD'));
      d = d.add(1, 'day');
    }
  }
  return dates;
}

export function getMaxLoansCount(): number {
  return Math.max(...books.map((b) => getLoansCount(b.id)), 1);
}

export function getMyBooks(): Book[] {
  return books.filter((b) => b.owner_id === currentUser.id);
}

export function getMyActiveLoans(): Reservation[] {
  return reservations.filter(
    (r) => r.borrower_id === currentUser.id && r.status === 'active'
  );
}

export function getMyReserved(): Reservation[] {
  return reservations.filter(
    (r) => r.borrower_id === currentUser.id && r.status === 'reserved'
  );
}

export function getMyReturned(): Reservation[] {
  return reservations.filter(
    (r) => r.borrower_id === currentUser.id && r.status === 'returned'
  );
}

export function getMyBooksLentOut(): number {
  const myBookIds = getMyBooks().map((b) => b.id);
  return reservations.filter(
    (r) => myBookIds.includes(r.book_id) && r.status === 'active'
  ).length;
}

export function getMyBooksTotalLoans(): number {
  const myBookIds = getMyBooks().map((b) => b.id);
  return myBookIds.reduce((sum, id) => sum + getLoansCount(id), 0);
}
