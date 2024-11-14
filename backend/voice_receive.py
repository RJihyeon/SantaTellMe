from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
import uuid
from pydantic import BaseModel

app = FastAPI()


from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, TIMESTAMP, UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
import uuid

Base = declarative_base()

# user 테이블 
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    kakaoid = Column(Integer, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    nickname = Column(String)

# Voice 테이블
class Voice(Base):
    __tablename__ = "voice"
    id = Column(Integer, primary_key=True, index=True)
    s3_id = Column(UUID(as_uuid=True), default=uuid.uuid4)
    from_user_id = Column(Integer, ForeignKey("users.id"))
    to_user_id = Column(Integer, ForeignKey("users.id"))
    anonymous = Column(Boolean, default=False)
    is_read = Column(Boolean, default=False)
    is_correct = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP)

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic 모델 정의
class UserCreate(BaseModel):
    kakaoid: int
    username: str
    nickname: str

class VoiceCreate(BaseModel):
    s3_id: uuid.UUID
    from_user_id: int
    to_user_id: int
    anonymous: bool
    is_read: bool
    is_correct: bool

# 유저 생성
@app.post("/users/", response_model=UserCreate)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(kakaoid=user.kakaoid, username=user.username, nickname=user.nickname)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# 음성 생성
@app.post("/voices/", response_model=VoiceCreate)
def create_voice(voice: VoiceCreate, db: Session = Depends(get_db)):
    db_voice = Voice(
        s3_id=voice.s3_id,
        from_user_id=voice.from_user_id,
        to_user_id=voice.to_user_id,
        anonymous=voice.anonymous,
        is_read=voice.is_read,
        is_correct=voice.is_correct
    )
    db.add(db_voice)
    db.commit()
    db.refresh(db_voice)
    return db_voice