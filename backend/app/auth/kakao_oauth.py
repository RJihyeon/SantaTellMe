import logging

import httpx

logger = logging.getLogger(__name__)


def request_access_token(redirect_uri: str, auth_code: str, client_id: str) -> dict:
    try:
        data = {
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "code": auth_code,
            "grant_type": "authorization_code",
        }
        logger.debug(f"requesting access token to kakao auth. payload: {data}")
        resp = httpx.post("https://kauth.kakao.com/oauth/token", data=data)
        return resp.json()
    except Exception as exc:
        print(f"An unexpected error occurred: {exc}")


def request_user_info(access_token: str) -> dict:
    try:
        logger.debug(f"requesting user_info to kakao auth. hpayload: {access_token}")
        resp = httpx.post(
            url="https://kapi.kakao.com/v2/user/me",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        return resp.json()
    except Exception as exc:
        print(f"An unexpected error occurred: {exc}")
