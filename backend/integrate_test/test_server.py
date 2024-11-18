from app.main import app
from fastapi.testclient import TestClient
import httpx

# warning
# this code depends on /backend/data/sample-data.sql
# this code expects myql service in docker-compose.yml running

# user1
client = TestClient(app)
user1_jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxfQ.J8Qj4p5xrAMj0GKjddGky-oeAOlWxjT8KOCisXzSOdU"
user4_jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0fQ.wxnKr5vamZ-Ez0vkVpSWL-bbi1T54glTTrCaJTZeRyQ"


def get_voice_id_list(access_token: str) -> httpx.Response:
    resp: httpx.Response = client.get(
        url="http://0.0.0.0:8000/user/voices",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    return resp


def get_voice_metadata(access_token: str, voice_id: int) -> httpx.Response:
    resp: httpx.Response = client.get(
        url=f"http://0.0.0.0:8000/voice/{voice_id}/meta",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    return resp


def upload_binary(access_token: str, binary: bytes, to_user: int) -> httpx.Response:
    resp: httpx.Response = client.post(
        url=f"http://0.0.0.0:8000/voice?to_user_id={to_user}",
        headers={"Authorization": f"Bearer {access_token}"},
        files={"audio_file": ("foo_binary", binary, "audio/mpeg")},
    )
    return resp


def download_binary(access_token: str, voice_id: int) -> httpx.Response:
    resp: httpx.Response = client.get(
        url=f"http://0.0.0.0:8000/voice/{voice_id}/audio",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    return resp


def test_get_voice_id_list():
    resp: httpx.Response = get_voice_id_list(user1_jwt)
    assert resp.status_code == 200
    assert resp.json() == {"received_voice_ids": [4, 7, 9], "sent_voice_ids": [1, 2, 3]}


def test_get_voice_metadata():
    resp: httpx.Response = get_voice_metadata(user1_jwt, 1)
    assert resp.status_code == 200

    resp: httpx.Response = get_voice_metadata(user4_jwt, 9)
    assert resp.status_code == 200

    resp: httpx.Response = get_voice_metadata(user1_jwt, 100)
    assert resp.status_code == 404

def test_upload_and_download_sinario():
    binary: bytes = b"efsadfsdafsadfsadfsadf"
    resp: httpx.Response = upload_binary(user4_jwt, binary, 1)
    assert resp.status_code == 200

    upload_resp_body = resp.json()
    resp: httpx.Response = download_binary(user4_jwt, upload_resp_body["id"])
    assert resp.status_code == 200
    assert resp.content == binary
