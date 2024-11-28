## developement requirments
- docker
- docker compose
- [mysqlclient](https://github.com/PyMySQL/mysqlclient) dependencies
- pipenv

---

## run in docker
- only require docker, docker compose
```
cd SantatellMe
curl -o .env https://santatellme-project.s3.ap-northeast-2.amazonaws.com/env_file

docker-compose up --build -d

실행후 ...

docker-compose down -v 
```

---

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

---

