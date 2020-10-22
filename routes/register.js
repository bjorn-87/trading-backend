const express = require('express');
const router = express.Router();

const register = require('../models/register.js');

router.get('/', function(req, res) {
    const data = {
        data: {
            msg: "Register a user"
        }
    };

    res.json(data);
});

router.post('/', function(req, res) {
    register.registerUser(res, req.body);
});

module.exports = router;
