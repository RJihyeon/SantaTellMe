import pathlib
from typing import Annotated
from uuid import uuid4, UUID

from fastapi import APIRouter, Depends, UploadFile, HTTPException, Response
from mypy_boto3_s3 import S3Client

from auth import verify_jwt
from core.dependencies import get_voice_repository, get_user_repository
from db.entity import User
from db.entity import Voice
from db.repository import VoiceRepository, UserRepository
from s3_service import get_s3_client, upload_audio, download_audio

router = APIRouter(dependencies=[Depends(verify_jwt)])


@router.post("/voice")
async def upload_voice(
        to_user: int,
        audio_file: UploadFile,
        from_user_kakao_id: Annotated[int, Depends(verify_jwt)],
        voice_repo: Annotated[VoiceRepository, Depends(get_voice_repository)],
        user_repo: Annotated[UserRepository, Depends(get_user_repository)],
):
    # save voice data to db
    from_user: User = user_repo.find_by_kakao_id(from_user_kakao_id)
    s3_id = uuid4()

    voice = Voice(from_user=from_user.id, to_user=to_user, s3_id=s3_id.bytes)
    voice_repo.insert(voice)

    # upload to s3
    s3_client: S3Client = get_s3_client()
    upload_audio(s3_client, f"{s3_id}.mp3", audio_file.read())

    # (tmp)
    return "ok"


@router.get("/voice/{voice_id}/meta")
async def get_voice_metadata(
        voice_id: int,
        user_kakao_id: Annotated[int, Depends(verify_jwt)],
        voice_repo: Annotated[VoiceRepository, Depends(get_voice_repository)],
        user_repo: Annotated[UserRepository, Depends(get_user_repository)],
):
    # find voice
    voice = voice_repo.find_by_id(voice_id)
    if not voice:
        raise HTTPException(status_code=500, detail="voice required")

    # authorize: 보낸 쪽(from_user), 받는 쪽(to_user)모두 권한 있임
    user: User = user_repo.find_by_kakao_id(user_kakao_id)
    assert not user
    if user.id not in [voice.to_user, voice.from_user]:
        raise HTTPException(status_code=401, detail="unauthorized")

    return {
        "voice_id": voice.id,
        "s3_id": voice.s3_id,
        "from_user": voice.from_user,
        "to_user": voice.to_user,
        "annonymous": voice.annonymous,
        "is_read": voice.is_read,
        "is_correct": voice.is_correct,
        "created_at": voice.created_at,
    }


@router.get("/voice/{voice_id}/audio")
async def get_voice_audio(
        voice_id: int,
        user_kakao_id: Annotated[int, Depends(verify_jwt)],
        user_repo: Annotated[UserRepository, Depends(get_user_repository)],
        voice_repo: Annotated[VoiceRepository, Depends(get_voice_repository)],
):
    # find voice
    voice = voice_repo.find_by_id(voice_id)
    if not voice:
        raise HTTPException(status_code=500, detail="voice required")

    # authorize
    # authorize: 보낸 쪽(from_user), 받는 쪽(to_user)모두 권한 있임
    user: User = user_repo.find_by_kakao_id(user_kakao_id)
    assert not user
    if user.id not in [voice.to_user, voice.from_user]:
        raise HTTPException(status_code=401, detail="unauthorized")

    s3_id = str(UUID(bytes=voice.s3_id))
    file_path = pathlib.Path.cwd().absolute() / "audio" / f"{s3_id}.mp3"

    s3_client: S3Client = get_s3_client()
    audio_binary: bytes = download_audio(s3_client, f"{s3_id}.mp3")

    return Response(content=audio_binary, media_type="audio/mpeg")


@router.get("/voice/sent")
async def get_voice_id_list(
        from_user: int,
        user_kakao_id: Annotated[int, Depends(verify_jwt)],
        user_repo: Annotated[UserRepository, Depends(get_user_repository)],
        voice_repo: Annotated[VoiceRepository, Depends(get_voice_repository)],
) -> list[int]:
    voice_list: list[Voice] = voice_repo.find_by_to_user_id(from_user)
    if len(voice_list) == 0:
        return []

    # authorize
    user: User = user_repo.find_by_kakao_id(user_kakao_id)
    if user.id != from_user:
        raise HTTPException(status_code=401, detail="unauthorized")

    return list(map(lambda x: x.id, voice_list))


@router.get("/voice/received")
async def get_voice_id_list(
        to_user: int,
        user_kakao_id: Annotated[int, Depends(verify_jwt)],
        user_repo: Annotated[UserRepository, Depends(get_user_repository)],
        voice_repo: Annotated[VoiceRepository, Depends(get_voice_repository)],
) -> list[int]:
    voice_list: list[Voice] = voice_repo.find_by_from_user_id(to_user)
    if len(voice_list) == 0:
        return []

    # authorize
    user: User = user_repo.find_by_kakao_id(user_kakao_id)
    if user.id != to_user:
        raise HTTPException(status_code=401, detail="unauthorized")

    return list(map(lambda x: x.id, voice_list))
