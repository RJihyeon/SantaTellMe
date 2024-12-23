import logging
from typing import Annotated

import jwt
from fastapi import APIRouter, Depends, HTTPException
from jwt.exceptions import InvalidTokenError

from auth import JwtAuth
from core import Config
from entity import User
from models import UserInvitationUrl, UpdateNicknameRequest
from repository import get_user_repository, UserRepository

router = APIRouter(dependencies=[Depends(JwtAuth())])

logger = logging.getLogger(__name__)


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
        logger.error(f"can't decode jwt. token=[{token}]")
        raise HTTPException(401, detail=str(e))

    user: User | None = user_repo.find_by_user_id(user_id)
    if user is None:
        logger.error(f"can't find user with user_id=[{user_id}]")
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



@router.put("/user/nickname")
def update_nickname(
        request: UpdateNicknameRequest,
        user_id: Annotated[int, Depends(JwtAuth())],
        user_repo: Annotated[UserRepository, Depends(get_user_repository)],
):
    """
    Updates the nickname of the authenticated user.

    @param request: UpdateNicknameRequest containing the new nickname
    @param user_id: Extracted from JWT (authenticated user)
    @param user_repo: UserRepository for database interaction
    """
    # Validate nickname length
    if len(request.nickname) < 3 or len(request.nickname) > 30:
        raise HTTPException(status_code=400, detail="Nickname must be between 3 and 30 characters.")

    # Fetch the user from the database
    user = user_repo.find_by_user_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    # Update the user's nickname
    user.nickname = request.nickname
    try:
        user_repo.update_user(user)
        return {"message": "Nickname updated successfully.", "nickname": user.nickname}
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while updating the nickname.")