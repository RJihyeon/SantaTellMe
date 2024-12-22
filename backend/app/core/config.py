import os
from inspect import ismethod

from dotenv import load_dotenv

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
        SERVER_HOST = os.getenv("SERVER_HOST")

    class FRONTEND:
        NEXT_PUBLIC_BASE_URL = os.getenv("NEXT_PUBLIC_BASE_URL")

    @classmethod
    def inspect_env_variable(cls) -> dict[str, str]:
        return cls._inspect_env_variables(cls)

    @classmethod
    def _inspect_env_variables(cls, config_cls) -> dict[str, str]:

        env_variables: dict[str, str] = {}
        for attr_name in dir(config_cls):
            if attr_name.startswith("_"):
                continue

            attr_value = getattr(config_cls, attr_name)
            if ismethod(attr_value):
                break
            if isinstance(attr_value, type):
                nested_result = cls._inspect_env_variables(attr_value)
                env_variables = env_variables | nested_result
            elif isinstance(attr_value, str):
                env_variables[attr_name] = attr_value
            else:
                raise Exception(
                    f"[{attr_name}]=[{attr_value}] should be str type. note that Config and nested class of Config should not have method")
        return env_variables
