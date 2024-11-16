import logging

import uvicorn
from fastapi import FastAPI

from api import auth_router, voice_router, user_router

logging.basicConfig()
logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)

# fastapi
app = FastAPI()
app.include_router(auth_router.router)
app.include_router(voice_router.router)
app.include_router(user_router.router)

uvicorn.run(app, host="0.0.0.0", port=8000)
