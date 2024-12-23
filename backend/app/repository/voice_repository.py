import logging

from sqlalchemy import func, update, select, delete
from sqlalchemy.orm.session import Session

from entity import Voice

logger = logging.getLogger(__name__)


class VoiceRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def find_by_id(self, voice_id: int) -> Voice | None:
        logger.debug(f"finding voice by id voice_id:[{voice_id}]")
        query = select(Voice).where(Voice.id == voice_id)
        result = self.db_session.scalars(query).one_or_none()
        return result

    def find_by_to_user_id(self, user_id: int) -> list[Voice]:
        logger.debug(f"finding voice by id to_user_id:[{user_id}]")
        query = select(Voice).where(Voice.to_user == user_id)
        result = self.db_session.scalars(query).all()
        return result
    
   
    
    def find_by_id_and_conditions(self, voice_id: int, to_user: int, annonymous: bool) -> Voice | None:
        """
        특정 voice_id와 to_user, annonymous 조건을 만족하는 Voice 레코드를 반환.
        """
        logger.debug(f"Finding voice by voice_id={voice_id}, to_user={to_user}, annonymous={annonymous}")
        query = select(Voice).where(
            Voice.id == voice_id,
            Voice.to_user == to_user,
            Voice.annonymous == annonymous
        )
        result = self.db_session.scalars(query).one_or_none()
        return result


    def find_by_from_user_id(self, user_id: int) -> list[Voice]:
        logger.debug(f"finding voice by id from_user_id:[{user_id}]")
        query = select(Voice).where(Voice.from_user == user_id)
        result = self.db_session.scalars(query).all()
        return result

    def count_unread(self, user_id: int) -> int:
        logger.debug(f"find unread_voice_count user_id:[{user_id}]")
        query = (
            select(func.count()).select_from(Voice).where(Voice.from_user == user_id)
        )
        result = self.db_session.execute(query).one()
        return result

    def insert(self, voice: Voice) -> int:
        logger.debug("inserting voice")
        assert not voice.id
        self.db_session.add(voice)
        self.db_session.commit()
        self.db_session.refresh(voice)
        return voice.id

    def update(self, voice: Voice):
        """
        updatable column
            - annonymous
            - is_read
            - is_correct
        rest of column : delete then insert
            - id
            - s3_id
            - from_user
            - to_user
            - created_at
        """
        logger.debug("updating voice")
        self.db_session.execute(
            update(Voice),
            {
                "id": voice.id,
                "annonymous": voice.annonymous,
                "is_read": voice.is_read,
                "is_correct": voice.is_correct,
            },
        )
        self.db_session.commit()

    def delete_by_id(self, voice_id: int):
        logger.debug(f"deleting voice with id=[{voice_id}]")
        self.db_session.execute(delete(Voice).where(Voice.id == voice_id))
        self.db_session.commit()
