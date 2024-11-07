from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from datetime import datetime
import uuid
import os
from dotenv import load_dotenv
import boto3
from botocore.exceptions import NoCredentialsError

# Load environment variables
load_dotenv()

# Set up AWS S3 client with credentials from environment variables
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")
BUCKET_NAME = os.getenv("BUCKET_NAME")

s3 = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# S3에 파일 업로드하는 함수
def upload_to_s3(file, filename):
    try:
        s3.upload_fileobj(file, BUCKET_NAME, filename)
        return f"https://{BUCKET_NAME}.s3.amazonaws.com/{filename}"
    except NoCredentialsError:
        raise HTTPException(status_code=500, detail="S3 credentials not available")

# 음성 파일을 S3에 업로드하고 DB에 메타데이터 저장하는 API
@app.post("/voices/")
async def create_voice(
    from_user_id: int,
    to_user_id: int,
    anonymous: bool,
    is_correct: bool,
    file: UploadFile,
    db: Session = Depends(get_db)
):
    # S3에 파일 업로드
    filename = f"voices/{uuid.uuid4()}.mp3"  # 고유 파일명 생성
    s3_url = upload_to_s3(file.file, filename)

    # DB에 메타데이터 저장
    db_voice = Voice(
        s3_id=s3_url,
        from_user_id=from_user_id,
        to_user_id=to_user_id,
        anonymous=anonymous,
        is_read=False,
        is_correct=is_correct,
        created_at=datetime.utcnow()
    )
    db.add(db_voice)
    db.commit()
    db.refresh(db_voice)
    return db_voice
