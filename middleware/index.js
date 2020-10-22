'use strict';

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

module.exports = {
    logIncoming: logIncoming,
    fourOFourHandler: fourOFourHandler,
    errorHandler: errorHandler
};
