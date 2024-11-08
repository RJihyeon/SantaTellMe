from typing import Annotated

from fastapi import APIRouter, Depends

from auth import verify_jwt
from core.dependencies import get_voice_repository, get_user_repository
from db.entity import User
from db.entity import Voice
from db.repository import VoiceRepository, UserRepository

router = APIRouter(dependencies=[Depends(verify_jwt)])


# TODO:
#   1. receive audio file by multipart
#   2. persist audio file to s3
@router.post("/voice")
async def upload_voice(
    voice_repo: Annotated[VoiceRepository, Depends(get_voice_repository)],
    user_repo: Annotated[UserRepository, Depends(get_user_repository)],
    from_user_kakao_id: Annotated[int, Depends(verify_jwt)],
    to_user: int,
):
    from_user: User = user_repo.find_by_kakao_id(from_user_kakao_id)
    voice = Voice(from_user=from_user.id, to_user=to_user)

    voice_repo.insert(voice)
    return {"user_id": from_user.id}
