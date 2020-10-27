'use strict';

const jwt = require('jsonwebtoken');

let config;

try {
    config = require("../config.json");
} catch (error) {
    console.error(error);
}

const secret = process.env.JWT_SECRET || config.secret;

// Log incoming request
var logIncoming = function(req, res, next) {
    console.info(`Got request on ${req.path} (${req.method}).`);
    next();
};

// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
var fourOFourHandler = (req, res, next) => {
    var err = new Error("Not Found");

    err.status = 404;
    next(err);
};

// Felhanterare
var errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title": err.message,
                "detail": err.message
            }
        ]
    });
};

/**
 * Function to check if jwt token is valid
 */
var checkToken = function(req, res, next) {
    const token = req.headers['x-access-token'];

    jwt.verify(token, secret, function(err) {
        if (err) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/register",
                    title: "Authentication failed",
                    detail: err.message
                }
            });
        }
        // console.log(token);
        next();
    });
};


/**
 * create a token.
 */
var createToken = function(email) {
    let payload = {email: email};
    let jwtToken = jwt.sign(payload, secret, { expiresIn: '12h' });

    return jwtToken;
};


module.exports = {
    logIncoming: logIncoming,
    fourOFourHandler: fourOFourHandler,
    errorHandler: errorHandler,
    checkToken: checkToken,
    createToken: createToken
};
