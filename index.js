let express = require("express"),
    app = express(),
    body_parser = require("body-parser");

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, application/x-www-form-urlencoded, charset=UTF-8');
    next();
});

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

//route
app.use(require(__dirname + "/controller/index"));

app.use(function(req, res, next) {
    res.status(404);
    console.log(`Not found URL: ${req.url}`);
    res.send({ error: 'Not found' });
    next();
});
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(`Internal error(${res.statusCode}): ${err.message}`);
    res.send({ error: err.message });
    return;
});

app.listen(2521, () => {
    console.log("Server started on 2521 port");
});