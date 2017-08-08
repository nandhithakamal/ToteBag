var password;
var cpassword;

var url;
var protocol = "http";

if(window.location.host === "app.c100.hasura.me" || window.location.host === "localhost:8080")
{
    url = "c100.hasura.me";
}
else if(window.location.host === "app.nandhithakamal.hasura.me"){
    url = "nandhithakamal.hasura.me";
}
else if(window.location.host === "totebag.gristmill14.hasura-app.io"){
    protocol = "https";
    url = "gristmill14.hasura-app.io";
}

var errorScreen = `<h2 class = "text-center">
    Oops! Something went wrong and we don't know what. :(
    </h2>
    <hr>
    <style>
      @import url('https://fonts.googleapis.com/css?family=Saira');
      body{
          background-image: url("");
          font-family: 'Saira', sans-serif;
      }
    </style>`;

$("#registerButton").on("click", function(){
    var username = $("#username").val();
    var password = $("#password").val();
    var cpassword = $("#cpassword").val();
    var phone = $("#phone").val();
    var email = $("#email").val();
    var name = $("name").val();
    var checks = 0;

    if(username.length < 3){
        $("#usernameError").html("Username shoule be at least 3 characters long!");
    }
    else{
        checks++;
    }

    var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(emailPattern.test(email)){
        checks++;
    }
    else{
        $("#emailError").html("Enter a valid email address");
    }

    if(password.length <= 7){
        $("#passwordError").html("Password should be at least 8 characters long");
    }
    else{
        checks++;
    }

    if(password !== cpassword){
        $("#cpasswordError").html("Passwords don't match!");
    }
    else{
        checks++;
    }

    var phonePattern = /[789][0-9]{9}/
    if(phonePattern.test(phone)){
        checks++;
    }else{
        $("#phoneError").html("Enter a valid 10 digit phone number");
    }

    if(checks == 5){
        $.ajax({
            type: 'POST',
            crossDomain: true,
            dataType: 'json',
            url: protocol + '://auth.' + url + '/signup',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                'username': username,
                'password': password,
                'email': email,
                'mobile': phone
            }),
            success: function(data){
                hasuraID = data["hasura_id"];
                authToken = data["auth_token"];
                var date = new Date();
                date.setTime(date.getTime() + (30 * 24 * 60 * 60  * 1000));
                date.toGMTString();
                localStorage.setItem("hasuraID", hasuraID);
                localStorage.setItem("authToken","Bearer " +  authToken);
                localStorage.setItem("loggedIn", true);
                localStorage.setItem("username", username);
                document.cookie = "authToken = " + authToken + "; expires = " + date;
                updateUserTable(hasuraID, username);
                $("#successMessage").html("Hooray! Your account has been created!");

            },
            error: function(jqXHR, textStatus, errorThrown) {
                if(jqXHR.status == 409){
                    $("#errorMessage").html("Username / Email ID / Phone is already in use. Please choose different credentials");
                }
                else{
                    $("body").html(errorScreen);
                }
            },
            processData: false

        });
    }

});
function updateUserTable(hasuraID, username){
    $.ajax({
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        url: protocol + '://data.' + url + '/v1/query',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + authToken

        },
        data: JSON.stringify({
            "type": "insert",
            "args": {
                "table": "user",
                "objects": [
                    {
                        "userID": hasuraID,
                        "name": username

                    }
                ],
                "returning": ["userID"]
            }
        }),
        success: function(data){
            window.location.href = "/about";
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $("body").html(errorScreen);
        },
        processData: false

    });
}
