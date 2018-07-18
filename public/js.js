let res;

document.getElementById('first').onclick = function() {
    $.post("http://localhost:2521/login", {
        username: 'VladChaka',
        password: 'alotep2890'
    }, function(response) {
        console.log(response);
        res = response.user;
        let cookie = response.user.cookies[0];
        console.log(response.user.cookies[0]);
        document.cookie = cookie;
    });
}

document.getElementById('second').onclick = function() {
    console.log(res);
    console.log(res.cookies);
    let cookie1 = res.cookies[0];
    let stringCookies = res.cookies;
    stringCookies = stringCookies.join(' ');
    console.log(stringCookies);
    let cookie = stringCookies;
    document.cookie = cookie;

    $.post("http://localhost:2521/message", res, function(response) {
        console.log(response);

    });
}