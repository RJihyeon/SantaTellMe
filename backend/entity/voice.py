from datetime import datetime

from sqlalchemy import BINARY, Boolean, TIMESTAMP, ForeignKey, text
from sqlalchemy.orm import mapped_column, Mapped

from .base import Base


class Voice(Base):
    __tablename__ = "voice"
    id: Mapped[int] = mapped_column(primary_key=True)
    s3_id: Mapped[bytes] = mapped_column(BINARY(16))
    from_user: Mapped[int] = mapped_column(ForeignKey("users.id"))
    to_user: Mapped[int] = mapped_column(ForeignKey("users.id"))
    annonymous: Mapped[bool] = mapped_column(Boolean, default=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
