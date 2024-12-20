from typing import Annotated

from fastapi import APIRouter, HTTPException, Depends, Response, Request
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
    kakao_auth_url = (
        f"https://kauth.kakao.com/oauth/authorize"
        f"?client_id={Config.Kakako.ACCESS_KEY}"
        f"&redirect_uri={Config.Kakako.REDIRECT_URI}"
        f"&response_type=code"
    )
    return RedirectResponse(url=kakao_auth_url)

    
@router.get("/authenticate")
async def authenticate(
    response: Response,
    user_repo: Annotated[UserRepository, Depends(get_user_repository)],
    code: str | None = None,
    error: str | None = None,
    error_description: str | None = None,
) -> dict:
    """
    Callback function for handling OAuth with Kakao.
    """
    if not code:
        raise HTTPException(
            status_code=400,
            detail={
                "error": error or "Authorization code missing",
                "error_description": error_description or "No further details provided",
            },
        )

    try:
        # Step 1: Exchange the authorization code for an access token
        access_token: str = request_access_token(
            redirect_uri=Config.Kakako.REDIRECT_URI,
            auth_code=code,
            client_id=Config.Kakako.ACCESS_KEY,
        )["access_token"]

        # Step 2: Fetch user info from Kakao API
        user_info = request_user_info(access_token)
        user_kakao_id: int = int(user_info["id"])
        username = user_info.get("properties", {}).get("nickname", "default_username")

        # register new user
        # user: User = User(kakao_id=user_id, username="foo", nickname="foo")
        user: User | None = user_repo.find_by_kakao_id(user_kakao_id)
        if user is None:
            user = User(kakao_id=user_kakao_id, username=username, nickname=username)
            user_repo.insert(user)
        if user.id is None:
            raise Exception("user id must not be None")
        # TODO: expire and path
        jwt_token = JwtAuth.create_token(user.id)

        # Step 5: Set the token in an HttpOnly cookie
        response.set_cookie(
            key="access_token",
            value=jwt_token,
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite="Lax",
            max_age=3600,
        )

        # Step 6: Redirect to frontend dashboard or return a response
        frontend_url = f"http://localhost:3000/dashboard?user_id={user.id}&nickname={user.nickname}"

        return RedirectResponse(url=frontend_url)
    
    except HTTPException as http_exc:
        raise http_exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(exc)}")



@router.get("/protected-data")
async def protected_data(request: Request):
    # 쿠키에서 JWT 가져오기
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # JWT 검증
    try:
        payload = JwtAuth.verify_token(token)
        user_id = payload.get("user_id")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

    return {"message": f"Hello, User {user_id}"}