import jwt
from fastapi import HTTPException, Request
from jwt.exceptions import InvalidTokenError

from core import Config


async def verify_jwt(request: Request) -> int:
    """
    간단한 jwt 인증구현
    path function에 의존성 주입되어서만 사용됨
    :return: kakao user id
    """
    auth_header: str = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(401, detail=f"require Authorization header")
    try:
        scheme, token = auth_header.split(" ")
        if scheme.lower() != "bearer":
            raise Exception()
    except Exception:
        raise HTTPException(
            401, detail=f"scheme should be bearer current:[{auth_header}] "
        )

    try:
        foo = jwt.decode(token, Config.JWT.SECRET_KEY, Config.JWT.ALGORITHM)
    except InvalidTokenError as e:
        raise HTTPException(401, detail=str(e))

    return int(foo["user_id"])


def create_token(user_id: int) -> str:
    return jwt.encode({"user_id": user_id}, Config.JWT.SECRET_KEY, Config.JWT.ALGORITHM)
