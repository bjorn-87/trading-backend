var express = require('express');
var router = express.Router();
const order = require('../models/order.js');
const middleware = require('../middleware/index.js');

router.get('/:user', function(req, res) {
    order.getOrders(res, req.params.user);
});

router.post("/buy", (req, res, next) => middleware.checkToken(req, res, next),
    (req, res) => order.buyStock(res, req.body));

router.put("/sell", (req, res, next) => middleware.checkToken(req, res, next),
    (req, res) => order.sellStock(res, req.body));

module.exports = router;
