let express = require("express"),
    router = express.Router();

var querystring = require('querystring');
var http = require('http');

router.post('/login', (req, res) => {
    console.log(req.body);

    let data = querystring.stringify({
        login: req.body.username,
        password: req.body.password,
        stor_login: 1
    });

    const options = {
        hostname: 'www.weblancer.net',
        path: '/account/login/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded, charset=UTF-8',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    const _req = http.request(options, (_res) => {
        console.log("------------------------------------");
        console.log(`STATUS: ${_res.statusCode}`);
        console.log("------------------------------------");
        console.log(`HEADERS: ${JSON.stringify(_res.headers)}`);
        console.log("------------------------------------");
        _res.setEncoding('utf8');
        _res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            console.log("------------------------------------");
        });
        _res.on('end', () => {
            console.log('No more data in response.');
            console.log("------------------------------------");
        });
    });

    _req.on('error', (err) => {
        console.error(`problem with request: ${err.message}`);
    });

    _req.write(data);
    _req.end();
});

module.exports = router;