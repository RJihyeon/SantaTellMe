import boto3
from mypy_boto3_s3 import S3Client

from core import Config


def get_s3_client() -> S3Client:
    return boto3.client(
        "s3",
        aws_access_key_id=Config.AWS.ACCESS_KEY_ID,
        aws_secret_access_key=Config.AWS.SECREY_ACCESS_KEY,
    )


def upload_audio(object_key: str, audio: bytes):
    try:
        s3_client: S3Client = get_s3_client()
        s3_client.put_object(Bucket=Config.AWS.BUCEKT_NAME, Key=object_key, Body=audio)
    except Exception as e:
        raise e


def download_audio(object_key: str) -> bytes:
    try:
        s3_client: S3Client = get_s3_client()
        resp = s3_client.get_object(Bucket=Config.AWS.BUCEKT_NAME, Key=object_key)
        audio_bytes = resp["Body"].read()
    except Exception as e:
        raise e

    return audio_bytes
