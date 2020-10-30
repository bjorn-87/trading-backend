'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require("body-parser");

const app = express();
const port = 8383;
var http = require('http').createServer(app);
const io = require('socket.io')(http);

const middleware = require("./middleware/index.js");
const index = require('./routes/index');
const register = require('./routes/register');
const login = require('./routes/login');
const user = require('./routes/user');
const order = require('./routes/order');
const stock = require('./models/stock.js');

// io.origins(['https://trading.bjos19.me:443']);
io.origins(['http://localhost:3000']);

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
app.use('/user', user);
app.use('/login', login);
app.use('/order', order);

// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use(middleware.fourOFourHandler);
// Felhanterare
app.use(middleware.errorHandler);

var saltSill = stock.saltSill;
var skolKrita = stock.skolKrita;

var liqourice = [saltSill, skolKrita];

io.on('connection', function(socket) {
    io.emit("stocks", liqourice);
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

if (process.env.NODE_ENV !== 'test') {
    setInterval(function () {
        liqourice.map((candy) => {
            candy["startingPoint"] = Math.round(stock.getStockPrice(candy) * 100) / 100;
            if (candy["startingPoint"] > 1000) {
                console.log(`over 100 ${candy["startingPoint"]}`);
                candy["startingPoint"] = candy["startingPoint"] * 0.5;
                console.log(candy["startingPoint"]);
            } else if (candy["startingPoint"] <= 0) {
                console.log(`under 0 ${candy["startingPoint"]}`);
                candy["startingPoint"] = 1;
                console.log(candy["startingPoint"]);
            }
            return candy;
        });

        io.emit("stocks", liqourice);
    }, 1000);
}

// Start up server
const server = http.listen(port, () => console.log(`Example API listening on port ${port}!`));

module.exports = server;
