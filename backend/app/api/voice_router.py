import logging
from typing import Annotated, List
from uuid import uuid4, UUID
from sqlalchemy.orm import Session
from db import get_session

from fastapi import APIRouter, Depends, UploadFile, HTTPException, Response

from auth import JwtAuth
from entity import User, Voice
from models import VoiceMetaData, GuessInput, VoiceMetaDataWithNames

from repository import (
    get_voice_repository,
    get_user_repository,
    VoiceRepository,
    UserRepository,
)
from rvc.request import rvc_infer_request
from s3_service import upload_audio, download_audio

logger = logging.getLogger(__name__)

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
    from_user: User | None = user_repo.find_by_user_id(from_user_id)
    if from_user is None:
        logger.error(f"can't find user with user_id=[{from_user_id}]")
        raise HTTPException(status_code=404, detail="can't find user")

    s3_id = uuid4()

    voice = Voice(from_user=from_user.id, to_user=to_user_id, s3_id=s3_id.bytes)
    voice_repo.insert(voice)

    # upload to s3
    logger.info("requesting for voice conversion")
    output_wav = rvc_infer_request(await audio_file.read())

    upload_audio(f"{s3_id}.wav", output_wav)

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
        logger.error(f"can't find voice metata data with voice_id=[{voice_id}]")
        raise HTTPException(status_code=404, detail="metadata not found")

    # authorize: 보낸 쪽(from_user), 받는 쪽(to_user)모두 권한 있임

    if user_id not in [voice.to_user, voice.from_user]:
        logger.error(
            f"user is not authorized user_id=[{user_id}] voice.to_user=[{voice.to_user}] voice.from_user=[{voice.from_user}]")
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
) -> Response:
    # find voice
    voice = voice_repo.find_by_id(voice_id)
    if voice is None:
        logger.error(f"can't find voice metata data with voice_id=[{voice_id}]")
        raise HTTPException(status_code=404, detail="metadata not found")

    # authorize
    # authorize: 보낸 쪽(from_user), 받는 쪽(to_user)모두 권한 있임
    if user_id not in [voice.to_user, voice.from_user]:
        logger.error(f"can't find voice metata data with voice_id=[{voice_id}]")
        raise HTTPException(status_code=401, detail="unauthorized")

    s3_id = str(UUID(bytes=voice.s3_id))

    # TODO: if audio file doesn't exist in bucket
    audio_binary: bytes = download_audio(f"{s3_id}.wav")

    return Response(content=audio_binary, media_type="audio/mpeg")


@router.get("/user/voices", response_model=dict[str, List[VoiceMetaDataWithNames]])
async def get_voice_metadata_for_user(
        user_id: Annotated[int, Depends(JwtAuth())],
        voice_repo: Annotated[VoiceRepository, Depends(get_voice_repository)],
        user_repo: Annotated[UserRepository, Depends(get_user_repository)],
) -> dict[str, List[VoiceMetaDataWithNames]]:
    """
    요청한 유저가 from_user_id 또는 to_user_id에 해당하는 음성 메타데이터를 반환,
    추가로 from_user와 to_user의 이름도 포함.
    """
    # voice 테이블에서 요청한 user_id가 from_user_id 또는 to_user_id인 항목 검색
    received_voices: List[Voice] = voice_repo.find_by_to_user_id(user_id)
    sent_voices: List[Voice] = voice_repo.find_by_from_user_id(user_id)

    if not received_voices and not sent_voices:
        logger.info(f"No voices found for user_id=[{user_id}]")
        return {"received": [], "sent": []}


    # received 메타데이터 생성
    received_metadata = []
    for voice in received_voices:
        from_user = user_repo.find_by_user_id(voice.from_user)
        to_user = user_repo.find_by_user_id(voice.to_user)
        received_metadata.append(
            VoiceMetaDataWithNames(
                id=voice.id,
                s3_id=UUID(bytes=voice.s3_id),
                from_user=voice.from_user,
                from_user_name=from_user.username if from_user else "Unknown",
                to_user=voice.to_user,
                to_user_name=to_user.username if to_user else "Unknown",
                annonymous=voice.annonymous,
                is_read=voice.is_read,
                is_correct=voice.is_correct,
                created_at=voice.created_at.isoformat(),
            )
        )

    # sent 메타데이터 생성
    sent_metadata = []
    for voice in sent_voices:
        from_user = user_repo.find_by_user_id(voice.from_user)
        to_user = user_repo.find_by_user_id(voice.to_user)
        sent_metadata.append(
            VoiceMetaDataWithNames(
                id=voice.id,
                s3_id=UUID(bytes=voice.s3_id),
                from_user=voice.from_user,
                from_user_name=from_user.username if from_user else "Unknown",
                to_user=voice.to_user,
                to_user_name=to_user.username if to_user else "Unknown",
                annonymous=voice.annonymous,
                is_read=voice.is_read,
                is_correct=voice.is_correct,
                created_at=voice.created_at.isoformat(),
            )
        )

    # 결과 반환
    return {
        "received": received_metadata,
        "sent": sent_metadata,
    }

@router.post("/guess")
def guess_voice(
        voice_id: int,  # 특정 Voice ID를 입력값으로 추가
        input: GuessInput,
        db: Session = Depends(get_session),
        voice_repo: VoiceRepository = Depends(get_voice_repository),
        user_repo: UserRepository = Depends(get_user_repository),
        user_id: int = Depends(JwtAuth()),  # JWT에서 user_id 추출
):
    """
    Guess API: 입력받은 `voice_id`, `guessed_from_username`에 따라 Voice의 is_correct와 annonymous를 업데이트.
    """
    logger.debug(f"user_id from JWT: {user_id}, voice_id: {voice_id}, guessed_from_username: {input.guessed_from_username}")

    # guessed_from_username으로 ID 검색
    guessed_user = user_repo.find_by_username(input.guessed_from_username)
    if not guessed_user:
        logger.error(f"No user found with username={input.guessed_from_username}")
        raise HTTPException(status_code=404, detail="User not found")

    guessed_from_user_id = guessed_user.id  # 검색된 ID 가져오기

    # Voice 레코드 검색
    voice_record = voice_repo.find_by_id_and_conditions(
        voice_id=voice_id,
        to_user=user_id,  # JWT에서 추출된 user_id를 to_user로 사용
        annonymous=True
    )

    if not voice_record:
        logger.error(f"No voice record found for voice_id={voice_id}, to_user={user_id}, annonymous=True")
        raise HTTPException(status_code=404, detail="Voice record not found")

    # Guess 확인
    if voice_record.from_user == guessed_from_user_id:
        # 정답 처리
        voice_record.is_correct = True
        voice_record.annonymous = False  # 익명 해제
        db.commit()
        db.refresh(voice_record)

        logger.info(f"Correct guess: voice_id={voice_id}, to_user={user_id}, guessed_from_user_id={guessed_from_user_id}")
        return {
            "message": "Correct guess!",
        }
    else:
        logger.info(f"Incorrect guess: voice_id={voice_id}, to_user={user_id}, guessed_from_user_id={guessed_from_user_id}")
        return {"message": "Incorrect guess"}

@router.post("/mark-read")
async def mark_read(id: int, db: Session = Depends(get_session)):
    """
    특정 Voice 메시지를 읽음 상태로 표시합니다.
    """
    try:
        # Voice 메시지 검색
        message = db.query(Voice).filter(Voice.id == id).first()
        if not message:
            raise HTTPException(status_code=404, detail="Message not found")

        # 읽음 상태로 변경
        message.is_read = True
        db.commit()
        db.refresh(message)

        return {"message": f"Message {id} marked as read"}
    except Exception as e:
        logger.error(f"Failed to mark message {id} as read: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")