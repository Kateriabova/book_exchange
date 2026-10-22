class AppError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class NotFoundError(AppError):
    def __init__(self, message: str = "Ресурс не найден"):
        super().__init__(message, status_code=404)


class AuthError(AppError):
    def __init__(self, message: str = "Требуется авторизация"):
        super().__init__(message, status_code=401)