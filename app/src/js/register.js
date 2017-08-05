var password;
var cpassword;

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

    var phonePattern = /[0-9]{10}/
    if(phonePattern.test(phone)){
        checks++;
    }else{
        $("#phoneError").html("Enter a valid 10 digit phone number");
    }
    console.log(checks);
    if(checks == 5){
        $.ajax({
            type: 'POST',
            crossDomain: true,
            dataType: 'json',
            url: 'http://auth.nandhithakamal.hasura.me/signup',
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
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if(jqXHR.status == 409){
                    $("#errorMessage").html("Username exists. Choose a different username");
                }
                else{
                    alert("onreadystatechange: " + jqXHR.onreadystatechange + "\nready" +
                        "State: " + jqXHR.readyState + "\nresponseText: " + jqXHR.responseText + "\nresponseXML: " + jqXHR.responseXML + "\nstatus: "
                        + jqXHR.status + "\nstatusText: " + jqXHR.statusText + "\n\ntextStatus: " + textStatus + "\n\nerrorThrown: " + errorThrown);
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
        url: 'http://data.nandhithakamal.hasura.me/v1/query',
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
            window.location.href = "/search";
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("onreadystatechange: " + jqXHR.onreadystatechange + "\nready" +
                "State: " + jqXHR.readyState + "\nresponseText: " + jqXHR.responseText + "\nresponseXML: " + jqXHR.responseXML + "\nstatus: "
                + jqXHR.status + "\nstatusText: " + jqXHR.statusText + "\n\ntextStatus: " + textStatus + "\n\nerrorThrown: " + errorThrown);
        },
        processData: false

    });
}

/*$("#password").keypress(function(){
    password = $("#password").val();
    console.log(password);
    if(password.length < 7){
        $("#passwordError").html("Password should be at least 8 characters long");
    }
    else{
        $("#passwordError").html("");
    }
});

$("#cpassword").keypress(function(){
    cpassword = $("#cpassword").val();
    console.log(cpassword);
    if(cpassword === password){
        $("#cpasswordError").html("");
    }
    else{
        $("#cpasswordError").html("Passwords don't match");
    }
});*/
