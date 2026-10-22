from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from exceptions import AppError
from routers import books, pickup_points, reservations, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title="Book Exchange API",
    description=(
        "Сервис обмена книгами"
    ),
    version="1.0.0",
    lifespan=lifespan,
)


@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message},
    )


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        location = " → ".join(str(loc) for loc in error["loc"])
        errors.append({"field": location, "message": error["msg"]})
    return JSONResponse(
        status_code=422,
        content={"detail": "Ошибка валидации", "errors": errors},
    )


@app.exception_handler(Exception)
async def generic_error_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Внутренняя ошибка сервера"},
    )


app.include_router(users.router)
app.include_router(books.router)
app.include_router(reservations.router)
app.include_router(pickup_points.router)


@app.get(
    "/",
    tags=["Служебное"],
    summary="Проверка работоспособности API",
    response_description="Сообщение о статусе API",
)
async def root():
    return {
        "message": "Book Exchange API работает",
        "docs": "/docs",
        "openapi": "/openapi.json",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )