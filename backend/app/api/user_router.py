from typing import Annotated, Dict

import jwt
from fastapi import APIRouter, Depends, HTTPException
from jwt.exceptions import InvalidTokenError

from auth import JwtAuth
from models import UserInvitationUrl
from core import Config
from repository import get_user_repository, UserRepository
from entity import User

router = APIRouter(dependencies=[Depends(JwtAuth())])


def create_invitation_token(user_id: int) -> str:
    return jwt.encode(
        {"user_id": user_id, "type": "user_invitation"},
        Config.JWT.SECRET_KEY,
        Config.JWT.ALGORITHM,
    )


@router.get("/invitation/user")
def get_user_id_by_invitation(
    token: str, user_repo: Annotated[UserRepository, Depends(get_user_repository)]
) -> int:
    """
    @param
        token: invitation jwt token
    """
    try:
        user_id: int = int(
            jwt.decode(token, Config.JWT.SECRET_KEY, Config.JWT.ALGORITHM)["user_id"]
        )
    except InvalidTokenError as e:
        raise HTTPException(401, detail=str(e))

    user: User | None = user_repo.find_by_user_id(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="user not found")

    return user_id


@router.get("/user/invitation")
def generate_invitation_url(
    user_id: Annotated[int, Depends(JwtAuth())],
) -> UserInvitationUrl:
    """
    invitation url format: ${server_host}/invitation?token=${jwt}
    example: http://0.0.0.0:8000/invitation?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ0eXBlIjoidXNlcl9pbnZpdGF0aW9uIn0.LpR5N0xMXGr9Yn8UjsNVm6kcdkdH78HTvMId2f-47gY"
    """
    jwt: str = create_invitation_token(user_id)
    invitation_url = f"{Config.ENV.SERVER_HOST}/invitation?token={jwt}"
    return UserInvitationUrl(url=invitation_url)

@router.get("/profile", response_model=Dict[str, str])
def read_user(
    id: int,
    user_repo: UserRepository = Depends(get_user_repository),
    current_user: User = Depends(JwtAuth()),
):
    """
    Retrieve user details by ID. Requires valid JWT.

    :param id: User ID to fetch details for
    :param db: Database session
    :param user_repo: User repository for database access
    :param current_user: User authenticated via JwtAuth
    :return: User details as a dictionary
    """
    # Ensure the current user has access to the requested ID
    try:
        user_id: int = int(
            jwt.decode(token, Config.JWT.SECRET_KEY, Config.JWT.ALGORITHM)["user_id"]
        )
    except InvalidTokenError as e:
        raise HTTPException(401, detail=str(e))

    user: User | None = user_repo.find_by_user_id(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="user not found")

    # Fetch the user from the database
    user = user_repo.find_by_user_id(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Return user details
    return {
        "id": user.id,
        "kakao_id": user.kakao_id,
        "username": user.username,
        "nickname": user.nickname,
    }

@router.get("/user/{id}", response_model=Dict[str, str])
def read_user(
    id: int,
    user_repo: UserRepository = Depends(get_user_repository),
    current_user: User = Depends(JwtAuth()),
):
    """
    Retrieve user details by ID. Requires valid JWT.

    :param id: User ID to fetch details for
    :param db: Database session
    :param user_repo: User repository for database access
    :param current_user: User authenticated via JwtAuth
    :return: User details as a dictionary
    """
    # Ensure the current user has access to the requested ID
    if current_user.id != id:
        raise HTTPException(status_code=403, detail="Not authorized to access this user")

    # Fetch the user from the database
    user = user_repo.find_by_user_id(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Return user details
    return {
        "id": user.id,
        "kakao_id": user.kakao_id,
        "username": user.username,
        "nickname": user.nickname,
    }