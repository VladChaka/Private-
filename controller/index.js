let express = require("express"),
    router = express.Router(),
    Service = require('../servise/index'),
    service = new Service(),
    jwt = require('jsonwebtoken'),
    token__module = require("../token/index"),
    path = require('path');

router.post('/login', (req, res) => {
    const data = {
        token: jwt.sign({ username: req.username }, 'darkmarweblanser228', { expiresIn: '1 h' }),
        username: req.body.username,
        password: req.body.password
    };
    service.auth(data,
        function(success, status) {
            res.status(status).json(success);
        },
        function(err, status) {
            res.status(status).json(err);
        });
});

router.post('/message', token__module.isValid, (req, res) => {
    service.getMessage(req.body, function(success) {
            res.status(200).json(success);
        },
        function(err, status) {
            res.status(status).json(err);
        });
});

module.exports = router;