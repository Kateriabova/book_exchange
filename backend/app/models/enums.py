import enum


class ReservationStatus(str, enum.Enum):
    RESERVED = "reserved"
    ACTIVE = "active"
    RETURNED = "returned"
    CANCELLED = "cancelled"


class BookGenre(str, enum.Enum):
    FICTION = "fiction"
    NON_FICTION = "non_fiction"
    SCIENCE_FICTION = "science_fiction"
    FANTASY = "fantasy"
    MYSTERY = "mystery"
    THRILLER = "thriller"
    ROMANCE = "romance"
    HORROR = "horror"
    BIOGRAPHY = "biography"
    HISTORY = "history"
    SCIENCE = "science"
    TECHNOLOGY = "technology"
    PHILOSOPHY = "philosophy"
    PSYCHOLOGY = "psychology"
    BUSINESS = "business"
    SELF_HELP = "self_help"
    POETRY = "poetry"
    DRAMA = "drama"
    ADVENTURE = "adventure"
    CHILDREN = "children"