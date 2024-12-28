import jwt
import dotenv
from app.core.config import Config

assert dotenv.load_dotenv()

print(jwt.encode(
    {"user_id": 1}, Config.JWT.SECRET_KEY, Config.JWT.ALGORITHM
))