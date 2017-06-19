//node modules used
var express = require('express');
var bodyParser = require('body-parser');
var form = require('express-form');
var request = require('request');


var app = express();
var field = form.field;


app.use(bodyParser.urlencoded({ extended: true }));


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
    '/check',
    form(
        field("username").trim().required().is(/\w/),
        field("password").trim().required().is(/\w/)
    ),
    function(req, res){
        if (req.form.isValid){
            request({
            	url: 'http://auth.c100.hasura.me/login',
            	method: 'POST',
            	headers: {'Content-Type':'application/json'},
                json:{'username': req.form.username, 'password': req.form.password}

            }, function(error, response, body){
                	if(error) {
                        res.send("Error!\n" + error);
                	} else if (response.statusCode == 200) {

                		res.send("Hello, user!");
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
