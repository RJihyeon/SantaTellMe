from datetime import datetime

from sqlalchemy import String, BINARY, Boolean, TIMESTAMP, ForeignKey, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    kakao_id: Mapped[int] = mapped_column(unique=True)
    username: Mapped[str] = mapped_column(String(30))
    nickname: Mapped[str] = mapped_column(String(30))

    __table_args__ = (UniqueConstraint("kakao_id"),)


class Voice(Base):
    __tablename__ = "voice"
    id: Mapped[int] = mapped_column(primary_key=True)
    s3_id: Mapped[bytes] = mapped_column(BINARY(16))
    from_user: Mapped[int] = mapped_column(ForeignKey("users.id"))
    to_user: Mapped[int] = mapped_column(ForeignKey("users.id"))
    annonymous: Mapped[bool] = mapped_column(Boolean, default=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.utcnow)
