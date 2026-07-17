from datetime import UTC, datetime

from sqlmodel import Field, SQLModel


class Category(SQLModel, table=True):
    __tablename__ = "categories"

    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", nullable=False, index=True)
    name: str = Field(nullable=False, index=True)
    description: str | None = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))