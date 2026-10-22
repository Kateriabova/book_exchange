CREATE TYPE reservation_status AS ENUM (
    'reserved',
    'active',
    'returned',
    'cancelled'
);

CREATE TYPE book_genre AS ENUM (
    'fiction',         -- художественная литература
    'non_fiction',     -- документальная литература
    'science_fiction', -- научная фантастика
    'fantasy',         -- фэнтези
    'mystery',         -- детектив
    'thriller',        -- триллер
    'romance',         -- романтика
    'horror',          -- ужасы
    'biography',       -- биография
    'history',         -- история
    'science',         -- наука
    'technology',      -- технологии
    'philosophy',      -- философия
    'psychology',      -- психология
    'business',        -- бизнес
    'self_help',       -- саморазвитие
    'poetry',          -- поэзия
    'drama',           -- драма
    'adventure',       -- приключения
    'children'         -- детская литература
);


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_users_login ON users(login);


CREATE TABLE pickup_points (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(150) NOT NULL,
    publisher VARCHAR(150),
    year INTEGER CHECK (year > 0 AND year <= 2100),
    pages INTEGER CHECK (pages > 0),
    language VARCHAR(50) DEFAULT 'ru',
    genre book_genre,
    max_loan_days INTEGER DEFAULT 21 CHECK (max_loan_days > 0 AND max_loan_days <= 365),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_books_owner ON books(owner_id);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_genre ON books(genre);
CREATE INDEX idx_books_year ON books(year);


CREATE TABLE book_pickup_points (
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    pickup_point_id INTEGER NOT NULL REFERENCES pickup_points(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, pickup_point_id)
);

CREATE INDEX idx_book_pickup_points_book ON book_pickup_points(book_id);
CREATE INDEX idx_book_pickup_points_pickup ON book_pickup_points(pickup_point_id);

CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    borrower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pickup_point_id INTEGER NOT NULL REFERENCES pickup_points(id),
    start_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status reservation_status DEFAULT 'reserved' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    		
    CHECK (start_date >= CURRENT_DATE),
    CHECK (due_date >= start_date),
    CHECK (due_date - start_date <= 365)
);

CREATE INDEX idx_reservations_book ON reservations(book_id);
CREATE INDEX idx_reservations_borrower ON reservations(borrower_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_dates ON reservations(start_date, due_date);
CREATE INDEX idx_reservations_pickup ON reservations(pickup_point_id);

CREATE INDEX idx_reservations_book_status_dates ON reservations(book_id, status, start_date, due_date);

INSERT INTO pickup_points (name) VALUES
    ('Три метлы: Автозаводская ул., 23Б, к.2'),
    ('Чулан под лестницей: Лубянский пр., 5, стр 1'),
    ('Хижина Хагрида: д. Огарково, 7'),
    ('Тайная комнаты:. ул. Солянка 1/2, стр. 1');

