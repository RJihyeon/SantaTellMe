import logging

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from api import auth_router, voice_router, user_router

logging.basicConfig()
logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)

# fastapi
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router.router)
app.include_router(voice_router.router)
app.include_router(user_router.router)

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
