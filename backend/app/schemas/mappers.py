from datetime import date

from models.book import Book
from models.reservation import Reservation
from models.enums import ReservationStatus
from schemas.book import BookBrief, BookCreate, BookDetail, BookRead, BookStatus, BookUpdate
from schemas.pickup_point import PickupPointBrief
from schemas.reservation import (
    ReservationCreate,
    ReservationDetail,
    ReservationRead,
    ReservationUpdate,
)
from schemas.user import UserBrief, UserCreate

def _book_status(book: Book) -> BookStatus:
    """Вычисляет статус книги на основе её броней."""
    today = date.today()
    
    has_borrowed = False
    has_reserved = False
    
    for res in book.reservations:
        if res.status in (ReservationStatus.RESERVED, ReservationStatus.ACTIVE):
            if res.start_date <= today <= res.due_date:
                has_borrowed = True
            elif res.start_date > today:
                has_reserved = True
    
    if has_borrowed:
        return BookStatus.BORROWED
    if has_reserved:
        return BookStatus.RESERVED
    return BookStatus.AVAILABLE


def _days_until(reservation: Reservation) -> int | None:
    """Дни до начала (RESERVED) или до конца (ACTIVE)."""
    today = date.today()
    
    if reservation.status == ReservationStatus.RESERVED:
        delta = (reservation.start_date - today).days
        return max(0, delta)
    
    if reservation.status == ReservationStatus.ACTIVE:
        delta = (reservation.due_date - today).days
        return max(0, delta)
    
    return None


def book_to_read(book: Book) -> BookRead:
    return BookRead.model_validate(book)


def book_to_detail(book: Book) -> BookDetail:
    status = _book_status(book)
    reservations_count = len(book.reservations)
    
    return BookDetail(
        id=book.id,
        owner_id=book.owner_id,
        title=book.title,
        author=book.author,
        publisher=book.publisher,
        year=book.year,
        pages=book.pages,
        language=book.language,
        genre=book.genre,
        max_loan_days=book.max_loan_days,
        created_at=book.created_at,
        updated_at=book.updated_at,
        owner=UserBrief.model_validate(book.owner),
        pickup_points=[PickupPointBrief.model_validate(pp) for pp in book.pickup_points],
        status=status,
        reservations_count=reservations_count,
    )


def book_to_brief(book: Book) -> BookBrief:
    return BookBrief(
        id=book.id,
        title=book.title,
        owner_login=book.owner.login,
    )


def reservation_to_read(reservation: Reservation) -> ReservationRead:
    days_until = _days_until(reservation)
    
    return ReservationRead(
        id=reservation.id,
        book_id=reservation.book_id,
        borrower_id=reservation.borrower_id,
        pickup_point_id=reservation.pickup_point_id,
        start_date=reservation.start_date,
        due_date=reservation.due_date,
        status=reservation.status,
        days_until=days_until,
        created_at=reservation.created_at,
        updated_at=reservation.updated_at,
    )


def reservation_to_detail(reservation: Reservation) -> ReservationDetail:
    days_until = _days_until(reservation)
    
    return ReservationDetail(
        id=reservation.id,
        book_id=reservation.book_id,
        borrower_id=reservation.borrower_id,
        pickup_point_id=reservation.pickup_point_id,
        start_date=reservation.start_date,
        due_date=reservation.due_date,
        status=reservation.status,
        days_until=days_until,
        created_at=reservation.created_at,
        updated_at=reservation.updated_at,
        book=book_to_brief(reservation.book),
        borrower=UserBrief.model_validate(reservation.borrower),
        pickup_point=PickupPointBrief.model_validate(reservation.pickup_point),
    )

def book_create_to_dict(data: BookCreate, owner_id: int) -> dict:
    """Преобразует схему создания книги в словарь для репозитория."""
    return {
        "owner_id": owner_id,
        "title": data.title,
        "author": data.author,
        "publisher": data.publisher,
        "year": data.year,
        "pages": data.pages,
        "language": data.language,
        "genre": data.genre,
        "max_loan_days": data.max_loan_days,
    }


def book_update_to_dict(data: BookUpdate) -> dict:
    """Преобразует схему обновления книги в словарь для репозитория."""
    return {
        "title": data.title,
        "author": data.author,
        "publisher": data.publisher,
        "year": data.year,
        "pages": data.pages,
        "language": data.language,
        "genre": data.genre,
        "max_loan_days": data.max_loan_days,
    }


def reservation_create_to_dict(data: ReservationCreate, borrower_id: int) -> dict:
    """Преобразует схему создания брони в словарь для репозитория."""
    return {
        "book_id": data.book_id,
        "borrower_id": borrower_id,
        "pickup_point_id": data.pickup_point_id,
        "start_date": data.start_date,
        "due_date": data.due_date,
    }


def reservation_update_to_dict(data: ReservationUpdate) -> dict:
    """Преобразует схему обновления брони в словарь для репозитория."""
    return {
        "pickup_point_id": data.pickup_point_id,
        "start_date": data.start_date,
        "due_date": data.due_date,
    }


def user_create_to_dict(data: UserCreate, password_hash: str) -> dict:
    """Преобразует схему регистрации в словарь для репозитория."""
    return {
        "login": data.login,
        "password_hash": password_hash,
        "display_name": data.display_name,
    }