var password;
var cpassword;

$("#registerButton").on("click", function(){
    var username = $("#username").val();
    var password = $("#password").val();
    var cpassword = $("#cpassword").val();
    var phone = $("#phone").val();
    var email = $("#email").val();
    var name = $("name").val();

    if(password === cpassword){
        $.ajax({
            type: 'POST',
            crossDomain: true,
            dataType: 'json',
            url: 'http://auth.c100.hasura.me/signup',
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
                alert("onreadystatechange: " + jqXHR.onreadystatechange + "\nready" +
                    "State: " + jqXHR.readyState + "\nresponseText: " + jqXHR.responseText + "\nresponseXML: " + jqXHR.responseXML + "\nstatus: "
                    + jqXHR.status + "\nstatusText: " + jqXHR.statusText + "\n\ntextStatus: " + textStatus + "\n\nerrorThrown: " + errorThrown);
            },
            processData: false

        });
    }
    else{
        $("#cpasswordError").html("Passwords don't match!");
    }
});
function updateUserTable(hasuraID, username){
    $.ajax({
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        url: 'http://data.c100.hasura.me/v1/query',
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
