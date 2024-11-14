import dotenv

env = dotenv.dotenv_values("../.env")


class Config:
    """
    env file에서 변수들 읽음
    프로젝트 코드내에서는 이 class를 통해서만 변수 접근하기
    """

    class Kakako:
        ACCESS_KEY = env["KAKAO_CLIENT_KEY"]
        REDIRECT_URI = env["REDIRECT_URI"]

    class JWT:
        SECRET_KEY = env["SECRET_KEY"]
        ALGORITHM = env["ALGORITHM"]

    class DB:
        CONN_URL = env["CONNECTION_URL"]

    class AWS:
        ACCESS_KEY_ID = env["AWS_ACCESS_KEY_ID"]
        SECREY_ACCESS_KEY = env["AWS_SECRET_ACCESS_KEY"]
        BUCEKT_NAME = env["BUCKET_NAME"]
