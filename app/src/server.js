var express = require('express');
var app = express();

//your routes here
var root = process.cwd();
app.get('/', function (req, res) {
    res.sendFile('html/landingpage.html', {root});


});
app.get('/login', function (req, res) {
    res.sendFile('html/login.html', {root});
});

app.get('/register', function (req, res) {
    res.sendFile("html/register.html", {root});
});
app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
