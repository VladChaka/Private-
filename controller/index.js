let express = require("express"),
    router = express.Router();

var querystring = require('querystring');
var http = require('http');
var request = require('request');

router.post('/login', (req, res) => {
    console.log(req.body);

    let data = querystring.stringify({
        login: req.body.username,
        password: req.body.password,
        store_login: 1
    });

    var options = {
        method: 'post',
        body: data,
        json: true,
        url: 'https://www.weblancer.net/account/login/',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded, charset=UTF-8',
            'Content-Length': Buffer.byteLength(data)
        }
    }

    request(options, function(err, res, body) {
        if (err) {
            console.log('Error :', err)
            return
        }
        let b = res.headers;
        // let cookie = b[set - cookie];
        console.log(`STATUS: ${res.statusCode}`);
        console.log("------------------------------------");
        console.log(`HEADERS A: ${JSON.stringify(res.headers)}`);
        console.log("------------------------------------");
        for (const key in b) {
            console.log("BBBBBBBBBBBBBBBBB", b[key]);
            console.log("KKKKKKKKKKKKKKKKK", key);
        }
        console.log("------------------------------------");
        // console.log(cookie);
        console.log("------------------------------------");
        console.log(' Body :', body)

    });
});

module.exports = router;