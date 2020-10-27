const db = require('../db/database.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let config;

try {
    config = require("../config.json");
} catch (error) {
    console.error(error);
}

const secret = process.env.JWT_SECRET || config.secret;

var loginUser = function(res, body) {
    const email = body.email;
    const password = body.password;

    if (!email || !password) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/login",
                title: "Email or password missing",
                detail: "Email or password missing in request"
            }
        });
    }

    db.get("SELECT * FROM users WHERE email = ?",
        email,
        (err, rows) => {
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

            if (rows === undefined) {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: "/login",
                        title: "User not found",
                        detail: "User with provided email not found."
                    }
                });
            }

            const user = rows;

            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/login",
                            title: "bcrypt error",
                            detail: "bcrypt error"
                        }
                    });
                }

                if (result) {
                    let payload = { email: user.email };
                    let jwtToken = jwt.sign(payload, secret, { expiresIn: '12h' });

                    return res.json({
                        data: {
                            type: "success",
                            message: "User logged in",
                            user: payload,
                            token: jwtToken
                        }
                    });
                }

                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: "/login",
                        title: "Wrong password",
                        detail: "Password is incorrect."
                    }
                });
            });
        });
};

module.exports = { loginUser };
