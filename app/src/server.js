//node modules used
var express = require('express');
var bodyParser = require('body-parser');
var form = require('express-form');
var request = require('request');
var localStorage = require('localStorage');
var cookieParser = require('cookie-parser');

var app = express();
var field = form.field;

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/css",express.static("css"));
app.use("/assets",express.static("assets"));
app.use("/js",express.static("js"));
app.set('view engine', 'ejs');
app.use(cookieParser());

var root = process.cwd();

app.get('/', function (req, res) {
    //noinspection JSAnnotator
    //if(localStorage.getItem('token'))
    var cookie = req.cookies['authToken'];
    if(cookie === undefined || cookie === "false"){
        res.sendFile('html/landingpage.html', {root});
    }
    else{
        res.redirect("/search");
    }
});

app.get('/login', function (req, res) {
    //noinspection JSAnnotator
    var cookie = req.cookies['authToken'];
    console.log(cookie);
    console.log(typeof cookie);
    if(cookie === undefined || cookie === "false"){
        res.sendFile('html/login.html', {root});
    }
    else{
        res.redirect("/about");
    }

});

app.get('/register', function (req, res) {
    //noinspection JSAnnotator
    var cookie = req.cookies['authToken'];
    console.log(cookie);
    console.log(typeof cookie);
    if(cookie === undefined || cookie === "false"){
        res.sendFile("html/register.html", {root});
    }
    else{
        res.redirect("/search");
    }

});

app.get('/about', function (req, res) {
    //noinspection JSAnnotator
    //if(localStorage.getItem('token'))
    var cookie = req.cookies['authToken'];
    if(cookie === undefined || cookie === "false"){
        res.sendFile('html/landingpage.html', {root});
    }
    else{
        res.render("about.ejs")
    }
});

app.get('/search', function(req, res){
    var cookie = req.cookies['authToken'];
    console.log(cookie);
    console.log(typeof cookie);
    if(cookie === undefined || cookie === "false"){
        res.sendFile("html/landingpage.html", {root});
    }
    else{
        res.render("find.ejs");
    }

});
app.get('/share', function(req, res){
    var cookie = req.cookies['authToken'];
    console.log(cookie);
    console.log(typeof cookie);
    if(cookie === undefined || cookie === "false"){
        res.sendFile("html/landingpage.html", {root});
    }
    else{
        res.render("share.ejs");
    }

});
app.get('/me', function(req, res){
    var cookie = req.cookies['authToken'];
    console.log(cookie);
    console.log(typeof cookie);
    if(cookie === undefined || cookie === "false"){
        res.sendFile("html/landingpage.html", {root});
    }
    else{
        res.render("profile.ejs");
    }
});

app.listen(8080, function () {
  console.log('Totebag on 8080');
});
