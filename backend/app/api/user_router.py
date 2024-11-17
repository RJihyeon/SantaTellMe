from typing import Annotated

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
    return jwt.encode({"user_id": user_id, "type": "user_invitation"}, Config.JWT.SECRET_KEY, Config.JWT.ALGORITHM)


@router.get("/invitation/user")
def get_user_id_by_invitation(
    token: str,
    user_repo: Annotated[UserRepository, Depends(get_user_repository)]
) -> int:
    """
    @param 
        token: invitation jwt token
    """
    try:
        user_id: int = int(jwt.decode( token, Config.JWT.SECRET_KEY, Config.JWT.ALGORITHM)["user_id"])
    except InvalidTokenError as e:
        raise HTTPException(401, detail=str(e))
    
    user: User | None= user_repo.find_by_user_id(user_id)
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
