
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL,
    account REAL DEFAULT 0,
    UNIQUE(email)
);

INSERT INTO users (email, password) VALUES ("test@bjos19.me", "$2a$10$u1XTawLdktfXgHQkTOP9leXHzkPL9Z17EP57f2yOHz3Vt8vVTh/Be");

DROP TABLE IF EXISTS stock;

CREATE TABLE IF NOT EXISTS stock (
    name VARCHAR(50),
    rate REAL DEFAULT 0,
    variance REAL DEFAULT 0,
    startingPoint REAL DEFAULT 0,
    UNIQUE(name)
);
INSERT INTO stock (name, rate, variance, startingPoint) VALUES ("Mandelkubb", 1.006, 0.6, 20);

DROP TABLE IF EXISTS stock_order;

CREATE TABLE IF NOT EXISTS stock_order (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user VARCHAR(255) NOT NULL,
    stock VARCHAR(50),
    price REAL NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO stock_order (user, stock, price) VALUES ("test@bjos19.me", "Mandelkubb", 20.5);
