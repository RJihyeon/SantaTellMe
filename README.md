# 🎅 산타텔미 프로젝트
Create a warm year-end with SantaTellMe. Express your heart with voice and words!

## 목차
- [Intro](#Intro)
- [Demo](#DEMO)
- [requirments](#requirments)
- [구동방법](#docker로-service-구동시켜보기)
- [아키텍처](#아키텍처)
- [프로젝트_폴더구조](#-📁-프로젝트-폴더-구조)
- [팀_구성](#Team-Member-Info)

## Intro 
따뜻한 연말을 위한 크리스마스 게릴라 서비스! 기존 트리꾸미기를 발전시켜, 익명의 산타 목소리로 마음을 전하고 맞혀보는 우편함.
- 배포사이트: https://www.santa-tell-me.com/

## Demo 
### [시연 영상으로 이동](https://drive.google.com/file/d/1PZPSdt0HfawlyNDrGGrqZukAlbh1p5Wj/view?usp=sharing)
<img width="1467" alt="스크린샷 2025-01-07 오전 8 34 47" src="https://github.com/user-attachments/assets/42de8357-f28c-4f6f-90d5-f30d189d88a4" />
<img width="1470" alt="스크린샷 2025-01-07 오전 8 35 41" src="https://github.com/user-attachments/assets/e3956074-76ab-4dcc-a9c2-aa0448000946" />
<img width="1470" alt="스크린샷 2025-01-07 오전 8 53 28" src="https://github.com/user-attachments/assets/39a28dcd-e32d-44e9-8169-56ed746611e5" />

## recipes
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

## 아키텍처
<img width="1010" alt="스크린샷 2025-01-07 오전 9 22 45" src="https://github.com/user-attachments/assets/bf4f9871-c7b0-44d7-b902-9ad4dec522d7" />

## 📁 프로젝트 폴더 구조

```plaintext
santatellme/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── api/                     # 라우터와 엔드포인트 관리
│   │   │   ├── __init__.py
│   │   │   ├── auth_router.py       # 카카오 로그인 관련 라우터
│   │   │   ├── user_router.py       # 사용자 관련 API 라우터
│   │   │   └── voice_router.py      # 음성 메시지 관련 API 라우터
│   │   │
│   │   ├── auth/                    # 인증 및 OAuth 관련 로직
│   │   │   ├── __init__.py
│   │   │   ├── jwt_handler.py       # JWT 생성 및 검증 로직
│   │   │   └── kakao_oauth.py       # 카카오 OAuth2.0 인증 처리
│   │   │
│   │   ├── core/                    # 설정 및 유틸리티
│   │   │   ├── __init__.py
│   │   │   ├── config.py            # 환경 설정 (환경변수 관리)
│   │   │   └── utils.py          
│   │   │
│   │   ├── db/                      # 데이터베이스 연결 및 초기화
│   │   │   ├── __init__.py
│   │   │   └── db.py                # DB 연결 설정
│   │   │
│   │   ├── entity/                  # Pydantic 및 SQLAlchemy 모델 정의
│   │   │   ├── __init__.py
│   │   │   ├── user.py              # Base 테이블 정의
│   │   │   ├── user.py              # Users 테이블 모델
│   │   │   └── voice.py             # Voice 테이블 모델
│   │   │
│   │   ├── models/                  
│   │   │   ├── __init__.py
│   │   │   └── models.py            # 모델 MetaData 정의
│   │   │
│   │   ├── repository/     
│   │   │   ├── __init__.py        
│   │   │   ├── dependencies.py
│   │   │   ├── user_repository.py            
│   │   │   └── voice_repository.py           
│   │   │
│   │   ├── rvc/                  # 음성 관련 로직
│   │   │   ├── __init__.py
│   │   │   └── request.py         # 음성 데이터 처리 요청            
│   │   │
│   │   └── s3_service/            # AWS S3 관련 로직
│   │       ├── __init__.py
│   │       └── s3.py    
│   ├── data/
│   │   ├── init-schema.sql         # DB 초기화 SQL 파일
│   │   └── sample-data.sql         # 샘플 데이터 SQL 파일
│   │
│   ├── integrate_test/             # 통합 테스트
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   └── test_server.py
│   │
│   ├── Dockerfile                  # Docker 설정 파일
│   ├── Pipfile                     # Pipenv 패키지 설정 파일
│   ├── Pipfile.lock                # Pipenv 잠금 파일
│   ├── readme.md                   # 백엔드 설명 문서
│   └── requirements                # 추가 의존성 파일
│   
├── frontend/
│   ├── app/                        # Next.js 애플리케이션 디렉토리
│   │   ├── api/                    # API 라우팅 관련 코드
│   │   ├── components/             # 공통 및 페이지별 컴포넌트
│   │   ├── fonts/                  # 폰트 파일
│   │   ├── invite/                 # 초대 페이지
│   │   ├── lib/                    # 공통 유틸리티
│   │   ├── my/                     # 사용자 관련 페이지
│   │   ├── send/                   # 메시지 전송 페이지
│   │   ├── testcookie/             # 테스트용 쿠키 페이지
│   │   ├── favicon.ico             # 아이콘 파일
│   │   ├── globals.css             # 전역 스타일 파일
│   │   ├── layout.tsx              # 레이아웃 파일
│   │   └── page.tsx                # 메인 페이지
│   │   
│   ├── public/                     # 정적 파일
│   │   ├── oauth/                  # OAuth 관련 이미지
│   │   ├── share/                  # 공유 관련 이미지
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── santa.png
│   │   ├── vercel.svg
│   │   └── window.svg
│   │   
│   ├── Dockerfile                  # Docker 설정 파일
│   ├── README.md                   # 프론트엔드 설명 문서
│   ├── env.json                    # 환경 변수 JSON 파일
│   ├── next-env.d.ts               # Next.js 타입 선언
│   ├── next.config.ts              # Next.js 설정 파일
│   ├── package-lock.json           # npm 잠금 파일
│   ├── package.json                # npm 패키지 파일
│   ├── postcss.config.mjs          # PostCSS 설정 파일
│   ├── tailwind.config.ts          # TailwindCSS 설정 파일
│   └── tsconfig.json               # TypeScript 설정 파일
│
├── .env                            # 환경 변수 설정 파일
├── requirements.txt                # Python 의존성 패키지 목록
├── README.md                       # 프로젝트 설명 문서
├── docker-compose.yml              # Docker Compose 설정 파일
└── .gitignore                      # Git 무시 파일

```

## Team Member Info

|이름|팀|역할|
|-|-|-|
|**[류지현](https://github.com/RJihyeon)**|DE|팀장/backend/frontend|
|**[김소윤](https://github.com/)**|DS|modeling|
|**[김예찬](https://github.com/yechance7)**|DE|backend|
|**[방준형](https://github.com/bindingflare)**|DE|frontend|
|**[박준형](https://github.com/jsybf)**|DE|backend/모델 추론 및 배포|
|**[이승준](https://github.com/)**|DS|modeling|
|**[한예지](https://github.com/)**|DA|modeling|
