let res;

document.getElementById('first').onclick = function() {
    $.post("http://localhost:2521/api/login", {
        username: 'VladChaka',
        password: 'alotep2890'
    }, function(response) {
		console.log(response);
		res = response.user;
		$("#token").val(res.token);
    });
}

// document.getElementById('second').onclick = function() {
//     console.log(res);

//     $.post("http://localhost:2521/api/dialogs.get", {
//         username: res.username,
// 		password: res.password,
// 		token: res.token
//     }, function(response) {
//         console.log(response);

//     });
// }
