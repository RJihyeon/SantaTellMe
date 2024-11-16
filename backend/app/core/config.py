from dotenv import load_dotenv
import os

load_dotenv()


class Config:
    """
    env file에서 변수들 읽음
    프로젝트 코드내에서는 이 class를 통해서만 변수 접근하기
    """

    class Kakako:
        ACCESS_KEY = os.getenv("KAKAO_CLIENT_KEY")
        REDIRECT_URI = os.getenv("REDIRECT_URI")

    class JWT:
        SECRET_KEY = os.getenv("SECRET_KEY")
        ALGORITHM = os.getenv("ALGORITHM")

    class DB:
        CONN_URL = os.getenv("CONNECTION_URL")

    class AWS:
        ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
        SECREY_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
        BUCEKT_NAME = os.getenv("BUCKET_NAME")
    class ENV:
        SERVER_HOST = os.getenv("ENV_SERVER_HOST") 
