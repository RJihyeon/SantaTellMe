import json
import logging

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import auth_router, voice_router, user_router
from core.config import Config

logging.basicConfig(level="INFO", force=False,
                    format="[%(asctime)s][%(filename)-25s:%(lineno)5s][%(funcName)-30s][%(message)s]")
# logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)
logger = logging.getLogger(__name__)

logger.info(f""" loaded env
{json.dumps(Config.inspect_env_variable(), indent=4)}
""")

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
    uvicorn.run(app, host="0.0.0.0", port=8000)
