var express = require('express');
var router = express.Router();
const user = require('../models/user.js');
const middleware = require('../middleware/index.js');

router.get('/account/:user', function(req, res) {
    user.getAccount(res, req.params.user);
});

router.put('/account/', (req, res, next) => middleware.checkToken(req, res, next),
    (req, res) => user.updateAccount(res, req.body));

module.exports = router;
