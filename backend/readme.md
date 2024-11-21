## 개발환경 세팅 
- docker
- docker compose
- [mysqlclient](https://github.com/PyMySQL/mysqlclient) dependencies
- pipenv

## 실행방법 
```
# cd SantatellMe
curl -o .env https://santatellme-project.s3.ap-northeast-2.amazonaws.com/env_file
docker-compose up -d mysql 
pipenv run python ./backend/app/main.py

실행후 ...

docker-compose downv -v 
```

## 테스트방법
justfile이 깔려 있는 경우[justfile](https://github.com/casey/just)
```
just test 
```
justfile이 깔려 있지 않은 경우

```
# cd SantatellMe
docker-compose up -d mysql
cd ./backend
pipenv run pytest 
cd ..
docker-compose down -v
```

##가상환경 설정

```shell
pip install pipenv
pipenv --python 3.10
```

###가상환경 실행/종료

```shell
pipenv shell
exit
```

###가상환경에 pipenv 패키지 다운

```shell
pipenv install
pipenv install fastapi
```
======
