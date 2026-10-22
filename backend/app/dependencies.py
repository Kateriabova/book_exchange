from fastapi import Header

from exceptions import AuthError


async def get_current_user_id(x_user_id: int = Header(..., description="ID текущего пользователя")) -> int:
    """
    Получение ID текущего пользователя из заголовка.
    """
    if x_user_id <= 0:
        raise AuthError("Некорректный ID пользователя")
    return x_user_id