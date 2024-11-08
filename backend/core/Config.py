import dotenv

env = dotenv.dotenv_values("../.env")

class Config:
    class Kakako:
        ACCESS_KEY = env["KAKAO_CLIENT_KEY"]
        REDIRECT_URI = env["REDIRECT_URI"]
    class JWT:
        SECRET_KEY = env["SECRET_KEY"]
        ALGORITHM = env["ALGORITHM"]