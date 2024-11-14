from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas import Voice
from typing import Optional
from uuid import uuid4
import boto3
import os

app = FastAPI()

# AWS S3 설정
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)
bucket_name = os.getenv("S3_BUCKET_NAME")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/upload_voice/")
async def upload_voice(
    from_user_id: int,
    to_user_id: int,
    anonymous: bool,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # S3에 업로드할 파일 ID 생성
    s3_id = str(uuid4())
    s3_key = f"voices/{s3_id}"

    # 파일을 S3에 업로드
    try:
        s3_client.upload_fileobj(file.file, bucket_name, s3_key)
    except Exception as e:
        raise HTTPException(status_code=500, detail="S3 upload failed")

    # 데이터베이스에 업로드 정보 저장
    db_voice = Voice(
        s3_id=s3_id,
        from_user_id=from_user_id,
        to_user_id=to_user_id,
        anonymous=anonymous,
        is_read=False,
        is_correct=False
    )
    db.add(db_voice)
    db.commit()
    db.refresh(db_voice)
    
    return {"message": "Voice uploaded successfully", "s3_id": s3_id}
