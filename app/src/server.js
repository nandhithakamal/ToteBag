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
//var authToken = document.cookie;
//console.log(authToken);
app.get('/', function (req, res) {
    //noinspection JSAnnotator
    //if(localStorage.getItem('token'))
    var cookie = req.cookies['authToken'];
    console.log(cookie);
    console.log(typeof cookie);
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
        res.redirect("/search");
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

/*app.post(
    '/home',
    form(
        field("username").trim().required().is(/\w/),
        field("password").trim().required().is(/\w/)
    ),
    function(req, res){
        if (req.form.isValid){
            username = req.form.username;
            password = req.form.password;
            request({
            	url: 'http://auth.c100.hasura.me/login',
            	method: 'POST',
            	headers: {'Content-Type':'application/json'},
                json:{'username': req.form.username, 'password': req.form.password}

            }, function(error, response, body){
                	if(error) {

                        res.send("Error!\n" + error);
                	} else if (response.statusCode == 200) {
                        authToken = response.body.auth_token;
                        hasuraID = response.body.hasura_id;
                        localStorage.setItem('token', authToken);
                		res.render("find.ejs", {
                            name: username,
                            token: authToken,
                            hid: hasuraID
                        });
                	} else if (response.statusCode == 403){
                        res.send("Invalid Creds!");
                    }
                    else {
                		res.send(response.body);
                	}
            });
        } else {
            console.log("Invalid form details!");
        }
    }
);*/

/*app.post(
    '/signup',
    form(
        field("username").trim().required().is(/\w/),
        field("password").trim().required().is(/\w/)
    ),
     function(req,res){

         request({
             url: 'http://auth.c100.hasura.me/signup',
             method: 'POST',
             headers: {'Content-Type':'application/json'},
             json:{
                 'username': req.form.username,
                 'password': req.form.password
             }

         }, function(error, response, body){
                 if(error) {
                     res.send("Error!\n" + error);
                 } else if (response.statusCode == 200) {

                     res.send(response);
                 } else if (response.statusCode == 400){
                     res.send("Password too short!");
                 } else if (response.statusCode == 409){
                     res.send("Username unavailable!");
                 } else {
                     res.send(response);
                 }
         });

});*/



app.listen(8080, function () {
  console.log('Totebag on 8080');
});
