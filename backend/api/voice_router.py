from typing import Annotated
from uuid import uuid4, UUID

from fastapi import APIRouter, Depends, UploadFile, HTTPException, Response

from auth import JwtAuth
from entity import User, Voice
from models import VoiceMetaData, VoiceIds
from repository import (
    get_voice_repository,
    get_user_repository,
    VoiceRepository,
    UserRepository,
)
from s3_service import upload_audio, download_audio

router = APIRouter(dependencies=[Depends(JwtAuth())])


@router.post("/voice")
async def upload_voice(
        to_user_id: int,
        audio_file: UploadFile,
        from_user_id: Annotated[int, Depends(JwtAuth())],
        voice_repo: Annotated[VoiceRepository, Depends(get_voice_repository)],
        user_repo: Annotated[UserRepository, Depends(get_user_repository)],
) -> VoiceMetaData:
    # save voice data to db
    from_user: User = user_repo.find_by_user_id(from_user_id)
    s3_id = uuid4()

    voice = Voice(from_user=from_user.id, to_user=to_user_id, s3_id=s3_id.bytes)
    voice_repo.insert(voice)

    # upload to s3
    upload_audio(f"{s3_id}.mp3", await audio_file.read())

    # (tmp)
    return VoiceMetaData(
        id=voice.id,
        s3_id=UUID(bytes=voice.s3_id),
        from_user=voice.from_user,
        to_user=voice.to_user,
        annonymous=voice.annonymous,
        is_read=voice.is_read,
        is_correct=voice.is_correct,
        created_at=voice.created_at,
    )


@router.get("/voice/{voice_id}/meta")
async def get_voice_metadata(
        voice_id: int,
        user_id: Annotated[int, Depends(JwtAuth())],
        voice_repo: Annotated[VoiceRepository, Depends(get_voice_repository)],
) -> VoiceMetaData:
    # find voice
    voice = voice_repo.find_by_id(voice_id)
    if voice is None:
        raise HTTPException(status_code=500, detail="voice must not be None")

    # authorize: 보낸 쪽(from_user), 받는 쪽(to_user)모두 권한 있임

    if user_id not in [voice.to_user, voice.from_user]:
        raise HTTPException(status_code=401, detail="unauthorized")

    return VoiceMetaData(
        id=voice.id,
        s3_id=UUID(bytes=voice.s3_id),
        from_user=voice.from_user,
        to_user=voice.to_user,
        annonymous=voice.annonymous,
        is_read=voice.is_read,
        is_correct=voice.is_correct,
        created_at=voice.created_at,
    )


@router.get("/voice/{voice_id}/audio")
async def get_voice_audio(
        voice_id: int,
        user_id: Annotated[int, Depends(JwtAuth())],
        voice_repo: Annotated[VoiceRepository, Depends(get_voice_repository)],
):
    # find voice
    voice = voice_repo.find_by_id(voice_id)
    if voice is None:
        raise HTTPException(status_code=500, detail="voice required")

    # authorize
    # authorize: 보낸 쪽(from_user), 받는 쪽(to_user)모두 권한 있임
    if user_id not in [voice.to_user, voice.from_user]:
        raise HTTPException(status_code=401, detail="unauthorized")

    s3_id = str(UUID(bytes=voice.s3_id))

    # TODO: if audio file doesn't exist in bucket
    audio_binary: bytes = download_audio(f"{s3_id}.mp3")

    return Response(content=audio_binary, media_type="audio/mpeg")


@router.get("/user/voices")
async def get_voice_id_list(
        user_id: Annotated[int, Depends(JwtAuth())],
        voice_repo: Annotated[VoiceRepository, Depends(get_voice_repository)],
) -> VoiceIds:
    received_voices: list[Voice] = voice_repo.find_by_to_user_id(user_id)
    sent_voices: list[Voice] = voice_repo.find_by_from_user_id(user_id)

    return VoiceIds(
        received_voice_ids=map(lambda v: v.id, received_voices),
        sent_voice_ids=map(lambda v: v.id, sent_voices),
    )
