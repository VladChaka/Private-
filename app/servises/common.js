let bcrypt = require('bcrypt-nodejs');

module.exports = function() {
    self = this;

    self.getCookies = function(cookies) {	
		// let tpl = 'SESSION_ID=%SESSION_ID%; cache_time=%cache_time%; stored_login=%stored_login%; stored_password=%stored_password%; stored_time=%stored_time%; login=%login%; hash=%hash%; stored_files_login=%stored_files_login%; stored_files_password=%stored_files_password%; stored_files_time=%stored_files_time%';

        let tpl = 'login=%login%; hash=%hash%; SESSION_ID=%SESSION_ID%; cache_time=%cache_time%; stored_login=%stored_login%; stored_password=%stored_password%; stored_time=%stored_time%; stored_files_login=%stored_files_login%; stored_files_password=%stored_files_password%; stored_files_time=%stored_files_time%',
            index = 0; 
        	
        var getCookie = function(cookie) {	
            var cookieArray = cookie.split('=');	
            let name = cookieArray[0].trim();	
            let value = cookieArray[1].trim();	
            return tpl.replace(`%${name}%`, value);	
        };	
        
        cookies.map((cookie) => {
            if (index !== 1) {
				cookie = cookie.split(';')[0];	
                tpl = getCookie(cookie);		
            }
            index++;
        });
        
        return tpl;	
    };

    self.hashPassword = function(data, cbSuccess) {
        const user = data;
        if (data.password !== undefined && data.password.length !== 0) {
            if (!checkRegExPassword(data.password)) return cbError({ error: "Incorrect password" }, 400);
            bcrypt.genSalt(5, function(err, salt) {
                if (err) {
                    return;
                }

                bcrypt.hash(user.password, salt, null, function(err, hash) {
                    if (err) {
                        return;
                    }
                    user.password = hash;
                    cbSuccess(user);
                });
            });
        } else {
            cbSuccess(user);
        }
    };

    self.rebuildUserData = function(userData) {
        let user = {
            id: userData._id,
            username: userData.username,
            token: userData.token,
            // cookies: userData.cookies,
            authDate: userData.authDate
        };

        return user;
    }

    function checkRegExPassword(pass) {
        return /^[a-z0-9A-Z](?=.*[\d])(?=.*[a-z]).{8,}$/.test(pass) && pass.length > 7;
    }
}