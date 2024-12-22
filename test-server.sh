docker-compose up -d santa-db santa-server --build
cd ./backend && pipenv run pytest
docker-compose down -v

