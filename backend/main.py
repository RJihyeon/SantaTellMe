import uvicorn
from fastapi import FastAPI

from api import auth_router, voice_router

app = FastAPI()
app.include_router(auth_router.router)
app.include_router(voice_router.router)

uvicorn.run(app, host="0.0.0.0", port=8080)
