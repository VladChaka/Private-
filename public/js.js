let res;

function zapros() {
    $.post("http://localhost:2521/login", { username: 'VladChaka', password: 'alotep2890' }, function(response) {
        console.log(response);
        res = response.user;
    });
}

function zapros1() {
    console.log(res);

    $.post("http://localhost:2521/message", res, function(response) {
        console.log(response);

    });
}