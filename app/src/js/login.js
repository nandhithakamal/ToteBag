$("#loginButton").on('click', function(){
    var username = $("#username").val();
    var password = $("#password").val();
    var hasuraID, authToken;
    if(username === ""){
        $("#errorMessage").html("Enter your username");
    }
    else if (password === "") {
        $("#errorMessage").html("Enter your password");
    }
    else{
        $.ajax({
            type: 'POST',
            crossDomain: true,
            dataType: 'json',
            url: 'http://auth.c100.hasura.me/login',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                'username': username,
                'password': password
            }),
            success: function(data){
                hasuraID = data["hasura_id"];
                authToken = data["auth_token"];
                localStorage.setItem("hasuraID", hasuraID);
                localStorage.setItem("authToken","Bearer " +  authToken);
                localStorage.setItem("loggedIn", true);
                localStorage.setItem("username", username);
                document.cookie = "authToken = " + authToken;
                window.location.href = "/search";
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if(jqXHR.status == 403)
                    $("#errorMessage").html("Invalid username / password");
                alert("onreadystatechange: " + jqXHR.onreadystatechange + "\nready" +
                    "State: " + jqXHR.readyState + "\nresponseText: " + jqXHR.responseText + "\nresponseXML: " + jqXHR.responseXML + "\nstatus: "
                    + jqXHR.status + "\nstatusText: " + jqXHR.statusText + "\n\ntextStatus: " + textStatus + "\n\nerrorThrown: " + errorThrown);
            },
            processData: false

        });
    }
});
