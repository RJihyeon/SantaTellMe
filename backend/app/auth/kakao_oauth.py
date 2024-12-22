import httpx


def request_access_token(redirect_uri: str, auth_code: str, client_id: str) -> dict:
    try:
        resp = httpx.post(
                "https://kauth.kakao.com/oauth/token",
                data={
                    "client_id": client_id,
                    "redirect_uri": redirect_uri,
                    "code": auth_code,
                    "grant_type": "authorization_code",
                },
            )
        return resp.json()
    except Exception as exc:
        print(f"An unexpected error occurred: {exc}")
    


def request_user_info(access_token: str) -> dict:
    try:
        resp = httpx.post(
            url="https://kapi.kakao.com/v2/user/me",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        return resp.json()
    except Exception as exc:
        print(f"An unexpected error occurred: {exc}")