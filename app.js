'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require("body-parser");

const app = express();
const port = 8383;

const middleware = require("./middleware/index.js");
const index = require('./routes/index');
const register = require('./routes/register');
const login = require('./routes/login');

// log incoming to console
// app.use(middleware.logIncoming);

app.use(cors());

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//My imported routes
app.use('/', index);
app.use('/register', register);
app.use('/login', login);

// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use(middleware.fourOFourHandler);
// Felhanterare
app.use(middleware.errorHandler);


// Start up server
const server = app.listen(port, () => console.log(`Example API listening on port ${port}!`));

module.exports = server;
