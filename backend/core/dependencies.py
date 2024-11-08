from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm.session import Session

from db import get_session
from db.repository import UserRepository, VoiceRepository


def get_user_repository(db_session: Annotated[Session, Depends(get_session)]):
    return UserRepository(db_session)


def get_voice_repository(db_session: Annotated[Session, Depends(get_session)]):
    return VoiceRepository(db_session)
