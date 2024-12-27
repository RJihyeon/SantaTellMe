import logging
from typing import Optional

from sqlalchemy import select, delete
from sqlalchemy.orm.session import Session

from entity import User

logger = logging.getLogger(__name__)


class UserRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def insert(self, user: User) -> int:
        logger.debug(f"inserting user")
        assert not user.id
        self.db_session.add(user)
        self.db_session.commit()
        self.db_session.refresh(user)
        return user.id

    def find_by_kakao_id(self, kakao_id: int) -> Optional[User]:
        """ "
        :param
            kakao_id: kakao user id
        """
        logger.debug(f"finding use by kakao_id=[{kakao_id}]")
        query = select(User).where(User.kakao_id == kakao_id)
        result = self.db_session.scalars(query).one_or_none()
        return result

    def find_by_user_id(self, user_id: int) -> Optional[User]:
        """ "
        :param
            kakao_id: kakao user id
        """
        logger.debug(f"finding use by user_id=[{user_id}]")
        query = select(User).where(User.id == user_id)
        result = self.db_session.scalars(query).one_or_none()
        return result

    
    def find_by_username(self, username: str) -> User | None:
        """
        주어진 username에 해당하는 User를 반환.
        """
        logger.debug(f"Finding user by username={username}")
        query = select(User).where(User.username == username)
        result = self.db_session.scalars(query).one_or_none()
        return result


    def delete_by_id(self, user_id: int):
        logger.debug(f"deleting use by user_id=[{user_id}]")
        self.db_session.execute(delete(User).where(User.id == user_id))
        self.db_session.commit()

    def update_user(self, user: User):
        """
        Updates the user's information in the database.

        @param user: The user entity with updated fields.
        """
        try:
            self.db_session.add(user)
            self.db_session.commit()
        except Exception as e:
            self.db_session.rollback()
            raise e
        
    def find_by_nickname(self, nickname: str) -> User | None:
        """
        Finds a user by their nickname.

        @param nickname: The nickname to search for.
        @return: User object if found, else None.
        """
        try:
            return self.db_session.query(User).filter(User.nickname == nickname).one_or_none()
        except Exception as e:
            logger.error(f"Error finding user with nickname {nickname}: {e}")
            return None
        
        