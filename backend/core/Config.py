import dotenv

env = dotenv.dotenv_values("../.env")

class Config:
    """
    env file에서 변수들 읽음
    프로젝트 코드내에서는 이 class를 통해서만 변수 접근
    모든 변수는 static
    """

    class Kakako:
        ACCESS_KEY = env["KAKAO_CLIENT_KEY"]
        REDIRECT_URI = env["REDIRECT_URI"]
    class JWT:
        SECRET_KEY = env["SECRET_KEY"]
        ALGORITHM = env["ALGORITHM"]