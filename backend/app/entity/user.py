from sqlalchemy import String, UniqueConstraint
from sqlalchemy.orm import mapped_column, Mapped

from .base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    kakao_id: Mapped[int] = mapped_column(unique=True)
    username: Mapped[str] = mapped_column(String(30))
    nickname: Mapped[str] = mapped_column(String(30))

    __table_args__ = (UniqueConstraint("kakao_id"),)
