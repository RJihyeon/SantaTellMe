from typing import Annotated

from fastapi import APIRouter, Depends

from auth.jwt_handler import verify_jwt

router = APIRouter(dependencies=[Depends(verify_jwt)])


@router.get("/voice")
async def upload_voice(kakao_user_id: Annotated[int, Depends(verify_jwt)]):
    return {"user_id": kakao_user_id}
