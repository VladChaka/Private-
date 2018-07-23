let querystring = require('querystring'),
    request = require('request'),
    User = require('../models/user'),
    common = require('./common'),
    htmlParser = require('./html_parser'),
    jwt = require('jsonwebtoken');

module.exports = function() {
    self = this;
    common.apply(self);
    htmlParser.apply(self);

    self.getCookies = function(cookies) {
		// let tpl = 'SESSION_ID=%SESSION_ID%; cache_time=%cache_time%; stored_login=%stored_login%; stored_password=%stored_password%; stored_time=%stored_time%; login=%login%; hash=%hash%; stored_files_login=%stored_files_login%; stored_files_password=%stored_files_password%; stored_files_time=%stored_files_time%';

		let tpl = 'SESSION_ID=%SESSION_ID%; login=%login%; hash=gynp3k9BJzccmc1x%2BCyusi7GmymNzix39Y%2FAW%2BuStxM%3D; cache_time=%cache_time%; stored_login=%stored_login%; stored_password=%stored_password%; stored_time=%stored_time%; stored_files_login=%stored_files_login%; stored_files_password=%stored_files_password%; stored_files_time=%stored_files_time%'
        
        var getCookie = function(cookie) {
            var cookieArray = cookie.split('=');
            let name = cookieArray[0].trim();
            let value = cookieArray[1].trim();
            return tpl.replace(`%${name}%`, value);
        };

        cookies.map((cookie) => {
			cookie = cookie.split(';')[0];
            tpl = getCookie(cookie);
        });

        return tpl;
    };

    self.auth = function(data, cbSuccess, cbError) {
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
                let cookies = res.headers['set-cookie'];
                cookies = self.getCookies(cookies);
                const user = new User.Schema({
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
                        cbSuccess({ statusText: 'Ok', user: userData }, 200);
                    });
                }, function(err) {
                    cbError({ error: err.message }, 500);
                })
            } else {
                cbError({ error: res.headers }, 500);
            }
        });
    }
    self.getDialogs = function(data, cbSuccess, cbError) {
		var decoded = jwt.decode(data.body.token);	
        User.Schema.find({
            username: decoded.username,
            token: data.body.token
        }, function(err, user) {
            if (err) cbError({ error: err }, 200);
            // let cookies = user[0].cookies,
            //     options = {
            //         method: 'GET',
            //         json: true,
            //         url: 'https://www.weblancer.net/account/contacts/',
            //         headers: {
            //             'Content-Type': 'text/html; charset=windows-1251',
            //             'Upgrade-Insecure-Requests': '1',
            //             'DNT': '1',
            //             'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3495.0 Safari/537.36',
            //             'Sec-Metadata': 'cause="user-activated", destination="document", target="top-level", site="same-origin"',
            //             'Referer': 'https://www.weblancer.net/',
            //             'Cookie': cookies
            //         }
			//     };
			
            let cookies = user[0].cookies,
                options = {
                    method: 'GET',
                    // json: true,
                    url: 'https://www.weblancer.net/account/contacts/',
                    headers: {
						'Upgrade-Insecure-Requests': '1',
						'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
						// 'Accept-Encoding': 'gzip, deflate, br',
						'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                        // 'DNT': '1',
						'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
                        // 'Sec-Metadata': 'cause="user-activated", destination="document", target="top-level", site="same-origin"',
                        'Referer': 'https://www.weblancer.net/',
                        'Cookie': cookies
                    }
				};
				

            request(options, function(err, res, body) {
                if (err) {
                    cbError({ error: err.message }, 500)
                    return;
                }
                if (res.statusCode === 200) {
                    let title = self.parse(body);
                    cbSuccess({ title: title }, res.statusCode);
                } else {
                    cbError({ error: res.headers }, 500);
                }
            });
        });
    }

}