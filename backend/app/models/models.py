from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class VoiceIds(BaseModel):
    received_voice_ids: list[int]
    sent_voice_ids: list[int]


class VoiceMetaData(BaseModel):
    id: int
    s3_id: UUID
    from_user: int
    to_user: int
    annonymous: bool = False
    is_read: bool = False
    is_correct: bool = False
    created_at: datetime


# VoiceMetaData 모델 확장
class VoiceMetaDataWithNames(BaseModel):
    id: int
    s3_id: UUID
    from_user: int
    from_user_name: str
    from_user_nickname: str
    to_user: int
    to_user_name: str
    annonymous: bool
    is_read: bool
    is_correct: bool
    created_at: str


class JwtResponse(BaseModel):
    access_token: str

class UserIdResponse(BaseModel):
    user_id: int


class UserInvitationUrl(BaseModel):
    url: str


class GuessInput(BaseModel):
    guessed_from_username: str


class UpdateNicknameRequest(BaseModel):
    nickname: str