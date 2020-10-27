const db = require('../db/database.js');


// select count(id) from stock_order where user = 'test@bjos19.me' and stock = ?;

/**
 * Function to get one report.
 */
var getOrders = function(res, user) {
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
            } else if (row === undefined) {
                return res.status(404).json({
                    data: {
                        status: 404,
                        text: "404 Page not found"
                    }
                });
            }
            // console.log(row);
            res.status(200).json( { data: row } );
        });
};


//
// /**
//  * Function to edit a report.
//  */
// var editReport = function(res, body) {
//     const week = parseInt(body.week);
//     const text = body.text;
//
//     // console.log(week);
//     // console.log(text);
//     db.run("UPDATE reports SET text = ? WHERE week = ?",
//         text,
//         week, (err) => {
//             if (err) {
//                 return res.status(500).json({
//                     error: {
//                         status: 500,
//                         source: "/register/edit",
//                         title: "Databas error",
//                         detail: err.message
//                     }
//                 });
//             }
//             return res.status(200).json({
//                 data: {
//                     msg: "Report successfully updated"
//                 }
//             });
//         });
// };
//
/**
 * Function to add a report.
 */
var buyStock = function(res, body) {
    const stock = body.stock;
    const user = body.user;
    const amount = parseInt(body.amount);
    const price = parseInt(body.price);
    let sql;

    db.get("SELECT account FROM users WHERE email = ?",
        user, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register/edit",
                        title: "Databas error",
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
                        source: "/register/edit",
                        title: "Databas error",
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
                                source: "/order/",
                                title: "Databas error",
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
                                        source: "/register/edit",
                                        title: "Databas error",
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
                                                    source: "/register/edit",
                                                    title: "Databas error",
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
                                                    source: "/register/edit",
                                                    title: "Databas error",
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
                            }
                        });
                });
        });
};
// /**
//  * Function to add a report.
//  */
// var buyStock = function(res, body) {
//     const price = parseFloat(body.price);
//     const stock = body.stock;
//     const user = body.user;
//
//     db.run("INSERT INTO stock_order (user, stock, price) VALUES (?, ?, ?)",
//         user,
//         stock,
//         price, (err) => {
//             if (err) {
//                 return res.status(500).json({
//                     errors: {
//                         status: 500,
//                         source: "/register/edit",
//                         title: "Databas error",
//                         detail: err.message
//                     }
//                 });
//             }
//             res.status(201).json({
//                 data: {
//                     msg: "order successfully registered"
//                 }
//             });
//         }
//     );
// };

/**
 * Function to add a report.
 */
var sellStock = function(res, body) {
    // const amount = parseInt(body.amount);
    const stock = body.stock;
    const user = body.user;
    let sql = `DELETE FROM "stock_order" WHERE user = "${user}" AND stock = "${stock}"`;

    console.log(sql);
    db.run(
        sql, (err) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/order/",
                        title: "Databas error",
                        detail: err.message
                    }
                });
            }
            res.status(201).json({
                data: {
                    msg: "order successfully deleted"
                }
            });
        }
    );
};

// /**
//  * Function to add a report.
//  */
// var sellStock = function(res, body) {
//     const amount = parseInt(body.amount);
//     const stock = body.stock;
//     const user = body.user;
//     let sql = `DELETE FROM "stock_order" WHERE user = "${user}" AND stock = "${stock}"`;
//
//     console.log(sql);
//     db.run(
//         sql, (err) => {
//             if (err) {
//                 return res.status(500).json({
//                     errors: {
//                         status: 500,
//                         source: "/order/",
//                         title: "Databas error",
//                         detail: err.message
//                     }
//                 });
//             }
//             res.status(201).json({
//                 data: {
//                     msg: "order successfully deleted"
//                 }
//             });
//         }
//     );
// };

module.exports = {
    getOrders: getOrders,
    buyStock: buyStock,
    sellStock: sellStock
};
