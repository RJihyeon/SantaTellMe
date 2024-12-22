# SantaTellMe
Create a warm year-end with SantaTellMe. Express your heart with voice and words!

# recipes
#### requirments
- docker, docker compose
- pipenv 
- python 3.10
- .env file
    - **./SantaTellMe/.env 파일을 노션 페이지에서 복사하기. 카카오 로그인 관련 오류는 .env 파일의 내용이 현제 노션 페이지의 .env와 일치하지 않아서 일 수 있음**
#### 참고
- santa-db(mysql container) 띄울시 ./SantaTellMe/backend/data 에 위치한 .sql 파일들 실행됨. table 생성 및 테스트 데이터 추가.

## docker로 service 구동시켜보기
```
# 실행 위치: ./SantaTellMe
# 커맨드: docker-compose up -d <serivce_name or omit> --build

# (ex)
docker-compose up -d santa-db, santa-server --build             # mysql, server 만 띄우기
docker-compose up -d santa-db, santa-server santa-front --build # mysql, server, fe 띄우기 생략과 같은 의미
docker-compose up -d --build                                    # 위와 똑같이 동작
```
- service_name: santa-db(필수), santa-server, santa-front 혹은 모든 서비스를 띄울려면 생략
- `--build`: 코드를 수정하거나 처음 컨테이너를 실행시킬때(이미지가 없을 때) 꼭 붙어야함
- `-d`: detach mode(로그를 출력하지 않음) 로그를 편하게 볼 수 있음으로 오류 원인 파악시  설정 하지 않는 것 추천

## mysql container 데이터 확인해보기
```
mysql -h 127.0.0.1 --port 3306 --user=test_user --password=pass test_db
```
- 위 명령어 입력하면 mysql client로 mysql container 접속
- **mysql client가 깔려있어야 한다**

## server integration test 해보기 
```
# 실행위치: ./SantaTellMe
# 참고: 권한 문제 있으면 chmod u+x test-server.sh 해보기
# 커맨드: ./test-server.sh

# (ex)
./test-server.sh
```
- `3 passed, 1 warning in 0.87s` 중간에 이렇게 뜨면 성공




# 🎅 산타텔미 프로젝트

## 📁 프로젝트 폴더 구조

```plaintext
santatellme/
│
├── backend/
│   ├── __init__.py
│   ├── main.py                  # FastAPI 애플리케이션 시작점
│   │
│   ├── api/                     # 라우터와 엔드포인트 관리
│   │   ├── __init__.py
│   │   ├── user_router.py       # 사용자 관련 API 라우터
│   │   ├── voice_router.py      # 음성 메시지 관련 API 라우터
│   │   └── auth_router.py       # 카카오 로그인 관련 라우터
│   │
│   ├── auth/                    # 인증 및 OAuth 관련 로직
│   │   ├── __init__.py
│   │   ├── kakao_oauth.py       # 카카오 OAuth2.0 인증 처리
│   │   └── jwt_handler.py       # JWT 생성 및 검증 로직
│   │
│   ├── crud/                    # 데이터베이스 CRUD 로직
│   │   ├── __init__.py
│   │   ├── crud_user.py         # 사용자 테이블 관련 CRUD
│   │   └── crud_voice.py        # 음성 테이블 관련 CRUD
│   │
│   ├── models/                  # Pydantic 및 SQLAlchemy 모델 정의
│   │   ├── __init__.py
│   │   ├── user.py              # Users 테이블 모델
│   │   └── voice.py             # Voice 테이블 모델
│   │
│   ├── schemas/                 # 요청/응답 스키마
│   │   ├── __init__.py
│   │   ├── user.py              # 사용자 요청/응답 스키마
│   │   └── voice.py             # 음성 요청/응답 스키마
│   │
│   ├── db/                      # 데이터베이스 연결 및 초기화
│   │   ├── __init__.py
│   │   └── connection.py        # DB 연결 설정
│   │
│   ├── core/                    # 설정 및 유틸리티
│   │   ├── __init__.py
│   │   ├── config.py            # 환경 설정 (환경변수 관리)
│   │   └── security.py          # 보안 관련 설정 (JWT, OAuth 등)
│   │
│   └── tests/                   # 테스트 코드
│       ├── __init__.py
│       ├── test_user.py         # 사용자 테스트
│       └── test_voice.py        # 음성 메시지 테스트
│
├── .env                         # 환경 변수 설정 파일
├── requirements.txt             # Python 의존성 패키지 목록
├── README.md                    # 프로젝트 설명 문서
├── Dockerfile                   # Docker 설정 파일
├── docker-compose.yml           # Docker Compose 설정
└── .gitignore                   # Git 무시 파일
