
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL,
    account REAL DEFAULT 0 NOT NULL,
    UNIQUE(email)
);

INSERT INTO users (email, password, account) VALUES ("test@bjos19.me", "$2a$10$u1XTawLdktfXgHQkTOP9leXHzkPL9Z17EP57f2yOHz3Vt8vVTh/Be", 10);

DROP TABLE IF EXISTS portfolio;

CREATE TABLE IF NOT EXISTS portfolio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user VARCHAR(255) NOT NULL,
    stock VARCHAR(50),
    amount INT DEFAULT 0
);

INSERT INTO portfolio (user, stock, amount) VALUES ("test@bjos19.me", "Häxvrål", 3);
INSERT INTO portfolio (user, stock, amount) VALUES ("test", "Häxvrål", 3);
