from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from core import Config

"""
sqlalchemy가 비동기, connection-pool 같은 것들을 지원하는 것 같은 데 
일단은 간단하게 구현. 이부분은 프로젝트에서 중요한 부분은 아니지만 공부 목적으로 좋을 것 같습니다
"""

engine = create_engine(Config.DB.CONN_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_session():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        raise e
    finally:
        db.close()
