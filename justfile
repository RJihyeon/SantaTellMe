dc-up-mysql:
    docker compose up -d mysql

m-shell:
    mysql -h 127.0.0.1 --port 3306 --user=test_user --password=pass test_db 

dc-down:
    docker compose down -v

test:
    @just dc-up-mysql
    sleep 6;
    pytest ./backend/test/test.py || true
    @just dc-down


