let express = require("express"),
    app = express(),
    bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/public'));

//route
app.use('/', require('./controller/index'));

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