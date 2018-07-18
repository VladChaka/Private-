let express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser');

mongoose.connect('mongodb://darkmars:weblanser228@ds219100.mlab.com:19100/cookies', { useNewUrlParser: true }, function(err) {
    if (err) throw new Error("Connection error: ", err.message);
    app.listen(2521, () => {
        console.log("Server started on 2521 port");
    });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

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