//node modules used
var express = require('express');
var bodyParser = require('body-parser');
var form = require('express-form');
var request = require('request');


var app = express();
var field = form.field;


app.use(bodyParser.urlencoded({ extended: true }));
app.use("/css",express.static("css"));
app.use("/assets",express.static("assets"));


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

app.post(
    '/home',
    form(
        field("username").trim().required().is(/\w/),
        field("password").trim().required().is(/\w/)
    ),
    function(req, res){
        if (req.form.isValid){
            var username = req.form.username;
            var password = req.form.password;
            request({
            	url: 'http://auth.c100.hasura.me/login',
            	method: 'POST',
            	headers: {'Content-Type':'application/json'},
                json:{'username': req.form.username, 'password': req.form.password}

            }, function(error, response, body){
                	if(error) {

                        res.send("Error!\n" + error);
                	} else if (response.statusCode == 200) {
                        var authToken = response.body.auth_token;
                        var hasuraID = response.body.hasure_id;
                		res.sendFile("html/about.html", {root});
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
);

app.post(
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
                     res.send("Username unavailable!s");
                 } else {
                     res.send(response);
                 }
         });

});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
