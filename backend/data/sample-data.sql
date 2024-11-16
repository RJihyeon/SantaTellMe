INSERT INTO users (kakao_id, username, nickname)
VALUES (3794225623, 'jun_hyoung_park', 'jun_hyoung'),
       (3750899522, 'user1', 'nick1'),
       (3750899523, 'user2', 'nick2'),
       (3750899524, 'user3', 'nick3'),
       (3750899525, 'user4', 'nick4');

INSERT INTO voice (s3_id, from_user, to_user)
VALUES (UUID_TO_BIN('da06e564-fc83-44f1-a355-6c1f8d3afac0'), 1, 2),
       (UUID_TO_BIN('da06e564-fc83-44f2-a355-6c1f8d3afac0'), 1, 3),
       (UUID_TO_BIN('da06e564-fc83-44f7-a355-6c1f8d3afac0'), 1, 5),
       (UUID_TO_BIN('da06e564-fc83-44f3-a355-6c1f8d3afac0'), 2, 1),
       (UUID_TO_BIN('da06e564-fc83-44f4-a355-6c1f8d3afac0'), 2, 3),
       (UUID_TO_BIN('da06e564-fc83-44f8-a355-6c1f8d3afac0'), 2, 4),
       (UUID_TO_BIN('da06e564-fc83-44f5-a355-6c1f8d3afac0'), 3, 1),
       (UUID_TO_BIN('da06e564-fc83-44f6-a355-6c1f8d3afac0'), 3, 2),
       (UUID_TO_BIN('da06e564-fc83-44f9-a355-6c1f8d3afac0'), 4, 1);
