const db = require('../db/database.js');

/**
 * Function to get one report.
 */
var getAccount = function(res, body) {
    let user = body.user;
    let sql = `SELECT account FROM users WHERE email = "${user}"`;

    db.get(
        sql,
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
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

/**
 * Function to edit a report.
 */
var updateAccount = function(res, body) {
    const money = parseFloat(body.money);
    const email = body.user;
    const type = body.type;

    if (type === "insert") {
        db.run("UPDATE users SET account = account + ? WHERE email = ?",
            money,
            email, (err) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/user/account",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }
                return res.status(200).json({
                    data: {
                        msg: "Money inserted successfully"
                    }
                });
            });
    } else if (type === "withdraw") {
        db.get("SELECT account FROM users WHERE email = ?",
            email, (err, rows) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/login",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }
                // console.log(rows.account);
                // console.log(typeof rows.account);
                if (rows.account < money) {
                    return res.status(401).json({
                        errors: {
                            status: 404,
                            source: "/user/account",
                            title: "Not enough money",
                            detail: "Not enough money to withdraw."
                        }
                    });
                }
                let remaining = rows.account - money;

                db.run("UPDATE users SET account = ? WHERE email = ?",
                    remaining,
                    email, (err) => {
                        if (err) {
                            return res.status(500).json({
                                errors: {
                                    status: 500,
                                    source: "/user/account",
                                    title: "Database error",
                                    detail: err.message
                                }
                            });
                        }
                        return res.status(200).json({
                            data: {
                                msg: "Money withdraw was a success"
                            }
                        });
                    });
            });
    } else {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/user/account",
                title: "Unauthorized",
                detail: "No type selected"
            }
        });
    }
};

module.exports = {
    getAccount: getAccount,
    updateAccount: updateAccount
};
