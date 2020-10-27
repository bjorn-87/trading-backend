const db = require('../db/database.js');

/**
 * Function to get portfolio.
 */
var getOrders = function(res, body) {
    let user = body.user;
    let sql = `SELECT * FROM portfolio WHERE user = "${user}"`;

    db.all(
        sql,
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/order",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }
            res.status(200).json( { data: row } );
        });
};


/**
 * Function to buy stocks.
 */
var buyStock = function(res, body) {
    const stock = body.stock;
    const user = body.user;
    const amount = parseInt(body.amount);
    const price = parseFloat(body.price) * amount;
    let sql;

    if (!stock || !user || amount <= 0) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/order/buy",
                title: "Unauthorized",
                detail: "Enter the correct values"
            }
        });
    }
    db.get("SELECT account FROM users WHERE email = ?",
        user, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/order/buy",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }
            // console.log(rows);
            // console.log(price);
            if ( rows === undefined || rows.account < price) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/order/buy",
                        title: "Database error",
                        detail: "Not enough money"
                    }
                });
            }
            db.run("UPDATE users SET account = account - ? WHERE email = ?",
                price,
                user, (err) => {
                    if (err) {
                        return res.status(500).json({
                            errors: {
                                status: 500,
                                source: "/order/buy",
                                title: "Database error",
                                detail: err.message
                            }
                        });
                    }
                    db.get("SELECT * FROM portfolio WHERE user = ? AND stock = ?",
                        user,
                        stock, (err, rows) => {
                            if (err) {
                                return res.status(500).json({
                                    errors: {
                                        status: 500,
                                        source: "/order/buy",
                                        title: "Database error",
                                        detail: err.message
                                    }
                                });
                            }
                            // console.log(rows);
                            if (rows === undefined) {
                                sql = "INSERT INTO portfolio " +
                                    "(user, stock, amount) VALUES (?, ?, ?)";
                                db.run(sql,
                                    user,
                                    stock,
                                    amount, (err) => {
                                        if (err) {
                                            return res.status(500).json({
                                                errors: {
                                                    status: 500,
                                                    source: "/order/buy",
                                                    title: "Database error",
                                                    detail: err.message
                                                }
                                            });
                                        }
                                        res.status(201).json({
                                            data: {
                                                msg: "order successfully registered"
                                            }
                                        });
                                    }
                                );
                            } else {
                                sql = "UPDATE portfolio SET amount = amount + ? " +
                                "WHERE user = ? AND stock = ?";
                                db.run(sql,
                                    amount,
                                    user,
                                    stock, (err) => {
                                        if (err) {
                                            return res.status(500).json({
                                                errors: {
                                                    status: 500,
                                                    source: "/order/buy",
                                                    title: "Database error",
                                                    detail: err.message
                                                }
                                            });
                                        }
                                        res.status(200).json({
                                            data: {
                                                msg: "order successfully registered"
                                            }
                                        });
                                    }
                                );
                            }
                        });
                });
        });
};


/**
 * Function to sell stocks
 */
var sellStock = function(res, body) {
    const amount = parseInt(body.amount);
    const price = parseFloat(body.price) * amount;
    const stock = body.stock;
    const user = body.user;
    let sql;

    if (!stock || !user || amount <= 0) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/order/buy",
                title: "Unauthorized",
                detail: "Enter the correct values"
            }
        });
    }
    db.get("SELECT amount FROM portfolio WHERE user = ? AND stock = ?",
        user,
        stock, (err, row) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/order/sell",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }
            if (row === undefined || row.amount < amount) {
                return res.status(404).json({
                    errors: {
                        status: 404,
                        source: "/order/sell",
                        title: "Not found",
                        detail: "No more stocks to sell"
                    }
                });
            }
            db.get("SELECT * FROM users WHERE email = ?",
                user, (err, row) => {
                    if (err) {
                        return res.status(500).json({
                            errors: {
                                status: 500,
                                source: "/order/sell",
                                title: "Database error",
                                detail: err.message
                            }
                        });
                    }
                    if (row === undefined) {
                        return res.status(404).json({
                            errors: {
                                status: 404,
                                source: "/order/sell",
                                title: "Not found",
                                detail: "User not found"
                            }
                        });
                    }
                    db.run("UPDATE users SET account = account + ? WHERE email = ?",
                        price,
                        user, (err) => {
                            if (err) {
                                return res.status(500).json({
                                    errors: {
                                        status: 500,
                                        source: "/order/sell",
                                        title: "Database error",
                                        detail: err.message
                                    }
                                });
                            }
                            sql = "UPDATE portfolio SET amount = amount - ? " +
                                "WHERE user = ? AND stock = ?";
                            db.run(sql,
                                amount,
                                user,
                                stock, (err) => {
                                    if (err) {
                                        return res.status(500).json({
                                            errors: {
                                                status: 500,
                                                source: "/order/sell",
                                                title: "Database error",
                                                detail: err.message
                                            }
                                        });
                                    }
                                    res.status(200).json({
                                        data: {
                                            msg: "Order successfully sold"
                                        }
                                    });
                                }
                            );
                        }
                    );
                }
            );
        });
};


module.exports = {
    getOrders: getOrders,
    buyStock: buyStock,
    sellStock: sellStock
};
