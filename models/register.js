const db = require('../db/database.js');

const bcrypt = require('bcryptjs');
const saltRounds = 10;


var registerUser = function (res, body) {
    const email = body.email;
    const password = body.password;

    if (!email || !password) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/register",
                title: "Email or password missing",
                detail: "email or password missing in request"
            }
        });
    }
    bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/register",
                    title: "bcrypt error",
                    detail: "bcrypt error"
                }
            });
        }

        db.run("INSERT INTO users (email, password) VALUES (?, ?)",
            email,
            hash, (err) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/register",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }

                res.status(201).json({
                    data: {
                        msg: "User successfully registered"
                    }
                });
            });
    });
};

module.exports = { registerUser };
