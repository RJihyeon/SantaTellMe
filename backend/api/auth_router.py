from typing import Annotated

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import RedirectResponse

from auth import JwtAuth, request_access_token, request_user_info
from core import utils, Config
from entity import User
from models import JwtResponse
from repository import UserRepository, get_user_repository

router = APIRouter()


@router.get("/login")
async def login() -> RedirectResponse:
    """
    login main entry point
    책임
        - kakao oauth server로 redirect
    """
    kakao_login_url = "https://kauth.kakao.com/oauth/authorize"
    query_param = {
        "client_id": Config.Kakako.ACCESS_KEY,
        "redirect_uri": Config.Kakako.REDIRECT_URI,
        "response_type": "code",
    }
    return RedirectResponse(
        kakao_login_url + "?" + utils.build_query_param(query_param)
    )


@router.get("/authenticate")
async def auhtenticate(
        user_repo: Annotated[UserRepository, Depends(get_user_repository)],
        code: str | None = None,
        error: str | None = None,
        error_description: str | None = None,
) -> JwtResponse:
    """
    (참고) 인증 흐름
    1. /login 에서 kauth.kakako.com/oauth/authroize로 redirect
    2. 카카오톡 서버에서 이 api를 호출하며 query param으로 인증코드와 에러 코드들을 넘겨준다.

    책임
        - 카카오톡 서버로부터 전달받은 인증코드로 access_token 요청 보내기
        - access_token으로 user info 요청 보내기
    :param
        code: 카카오톡 access_token 인증코드
    """
    if not code:
        raise HTTPException(
            status_code=400, detail={"error": error, "error_desc": error_description}
        )

    access_token: str = request_access_token(
        redirect_uri=Config.Kakako.REDIRECT_URI,
        auth_code=code,
        client_id=Config.Kakako.ACCESS_KEY,
    )["access_token"]
    user_id: int = int(request_user_info(access_token)["id"])

    # register new user
    if not user_repo.find_by_kakao_id(user_id):
        user_repo.insert(User(kakao_id=user_id, username="foo", nickname="foo"))

    # TODO: expire and path
    access_jwt = JwtAuth.create_token(user_id)
    return JwtResponse(access_token=access_jwt)
