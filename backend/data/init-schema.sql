create table users
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    kakao_id BIGINT UNIQUE,
    username VARCHAR(30),
    nickname VARCHAR(30)
);

create table voice
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    s3_id      BINARY(16) UNIQUE,
    from_user  INT references users (id),
    to_user    INT references users (id),
    annonymous BOOLEAN DEFAULT FALSE,
    is_read    BOOLEAN DEFAULT FALSE,
    is_correct BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);