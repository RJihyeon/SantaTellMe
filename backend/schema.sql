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
    created_at TIMESTAMP
);

# test data
INSERT INTO users (kakao_id, username, nickname)
VALUES (3750899517, 'user1', 'nick1'),
       (3750899518, 'user2', 'nick2'),
       (3750899519, 'user3', 'nick3');

INSERT INTO voice (s3_id, from_user, to_user)
VALUES (UUID_TO_BIN('da06e564-fc83-44f3-a355-6c1f8d3afac0'), 1, 2),
       (UUID_TO_BIN('da06e564-fc83-44f4-a355-6c1f8d3afac0'), 1, 3),
       (UUID_TO_BIN('da06e564-fc83-44f5-a355-6c1f8d3afac0'), 2, 1);