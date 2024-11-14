from traceback import print_exception

from starlette.requests import Request
from starlette.responses import Response


async def catch_exceptions_middleware(request: Request, call_next):
    """
    fastapi를 제외한 다른 라이브러리 exception이나 파이썬 코드내의 exception을
    기본적으로 fastapi가 출력하지 않아 디버깅이 어렵다. 따라서 gobally하게 exception
    을 잡는 middleware 추가
    """
    try:
        return await call_next(request)
    except Exception as e:
        # you probably want some kind of logging here
        print_exception(e)
        return Response("Internal server error", status_code=500)
