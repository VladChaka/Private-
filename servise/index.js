let querystring = require('querystring'),
    request = require('request'),
    User = require('../model/user'),
    common = require('./common'),
    cookieParser = require('cookie-parser');

module.exports = function() {
    self = this;
    common.apply(self);

    self.auth = function(data, cbSucces, cbError) {
        let dataJson = querystring.stringify({
                login: data.username,
                password: data.password,
                store_login: 1
            }),
            options = {
                method: 'POST',
                body: dataJson,
                json: true,
                url: 'https://www.weblancer.net/account/login/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded, charset=UTF-8',
                    'Content-Length': Buffer.byteLength(dataJson)
                }
            };

        request(options, function(err, res) {
            if (err) {
                cbError({ error: err.message }, 500)
                return;
            }
            if (res.statusCode === 200) {
                const cookies = res.headers['set-cookie'],
                    user = new User.Schema({
                        username: data.username,
                        password: data.password,
                        cookies: cookies,
                        token: data.token,
                        authDate: Date.now()
                    });

                self.hashPassword(user, function(user) {
                    user.save(function(err, user) {
                        if (err) {
                            cbError({ error: err.message }, 500);
                            return;
                        }
                        let userData = self.rebuildUserData(user);
                        cbSucces({ statusText: 'Ok', user: userData }, 200);
                    });
                }, function(err) {
                    cbError({ error: err.message }, 500);
                })
            } else {
                cbError({ error: res.headers }, 500);
            }
        });
    }

    self.getMessage = function(data, cbSucces, cbError) {
        // var cookie = parseCookie.parseCookie(data['cookies[]']);
        // var cookieText = 'sid=' + cookie;
        let stringCookies = data['cookies[]'];
        stringCookies = stringCookies.join(' ');
        let cookie = stringCookies,
            options = {
                method: 'GET',
                json: true,
                url: 'https://www.weblancer.net/account/contacts/',
                headers: {
                    'Cookie': cookie
                }
            };
        // console.log(cookie);


        request(options, function(err, res, body) {
            if (err) {
                cbError({ error: err.message }, 500)
                return;
            }
            // if (res.statusCode === 200) {

            console.log(`STATUS: ${res.statusCode}`);
            console.log("------------------------------------");
            // console.log(`HEADERS A: ${JSON.stringify(res.headers)}`);
            console.log("------------------------------------");

            // console.log(`COOKIES A: ${res.cookie}`);
            // console.log(`COOKIES B: ${res.cookies}`);
            // console.log(`COOKIES C: ${res}`);
            // for (const key in res) {
            //     console.log(key);

            // }



            cbSucces({ status: 'ok' }, res.statusCode);

            // } else {
            //     cbError({ error: res.headers }, 500);
            // }
        });
    }

}