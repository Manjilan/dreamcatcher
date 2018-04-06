//SERVER SETUP
var express = require('express');
var app = express();

// Allow CORS: to reduce security so we can more easily test our code in the browser.
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//HomePage
app.get('/', function (req, res) {
      res.send('Hello World!');
});

app.listen(process.env.PORT || 3000, function () {
       console.log('Checkout http://localhost:3000/');
});
