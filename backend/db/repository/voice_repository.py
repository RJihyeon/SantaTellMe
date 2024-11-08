from sqlalchemy import func, update, select, delete
from sqlalchemy.orm.session import Session

from db.entity.entity import Voice


class VoiceRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def find_by_to_user_id(self, user_id: int) -> list[Voice]:
        query = select(Voice).where(Voice.from_user == user_id)
        result = self.db_session.scalars(query).all()
        return result

    def count_unread(self, user_id: int) -> int:
        query = (
            select(func.count()).select_from(Voice).where(Voice.from_user == user_id)
        )
        result = self.db_session.execute(query).one()
        return result

    def insert(self, voice: Voice) -> int:
        assert not voice.id
        self.db_session.add(voice)
        self.db_session.commit()
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
        self.db_session.execute(delete(Voice).where(Voice.id == voice_id))
        self.db_session.commit()
