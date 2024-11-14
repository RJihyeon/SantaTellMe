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

class JwtResponse(BaseModel):
    access_token: str