import logging

import uvicorn
from fastapi import FastAPI

from api import auth_router, voice_router
from core import catch_exceptions_middleware

logging.basicConfig()
logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)

# fastapi
app = FastAPI()
app.include_router(auth_router.router)
app.include_router(voice_router.router)

app.middleware("http")(catch_exceptions_middleware)

uvicorn.run(app, host="0.0.0.0", port=8080)
