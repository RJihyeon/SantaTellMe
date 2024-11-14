import jwt
from fastapi import HTTPException, Request
from fastapi.security import HTTPBearer
from jwt.exceptions import InvalidTokenError

from core import Config


class JwtAuth(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JwtAuth, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request) -> int:
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
            request.state.token_info = jwt.decode(token, Config.JWT.SECRET_KEY, Config.JWT.ALGORITHM)['user_id']
        except InvalidTokenError as e:
            raise HTTPException(401, detail=str(e))

        return int(request.state.token_info)

    @staticmethod
    def create_token(user_id: int) -> str:
        return jwt.encode({"user_id": user_id}, Config.JWT.SECRET_KEY, Config.JWT.ALGORITHM)
