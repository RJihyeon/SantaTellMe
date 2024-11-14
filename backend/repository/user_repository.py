from typing import Optional

from sqlalchemy import select, delete
from sqlalchemy.orm.session import Session

from entity import User


class UserRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def insert(self, user: User) -> int:
        assert not user.id
        self.db_session.add(user)
        self.db_session.commit()
        return user.id

    def find_by_kakao_id(self, kakao_id: int) -> Optional[User]:
        """ "
        :param
            kakao_id: kakao user id
        """
        query = select(User).where(User.kakao_id == kakao_id)
        result = self.db_session.scalars(query).one_or_none()
        return result

    def delete_by_id(self, user_id: int):
        self.db_session.execute(delete(User).where(User.id == user_id))
        self.db_session.commit()
