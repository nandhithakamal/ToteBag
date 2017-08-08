$("#loginButton").on('click', function(){
    var username = $("#username").val();
    var password = $("#password").val();
    var hasuraID, authToken;

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
            url: protocol + '://auth.' + url + '/login',
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
                var date = new Date();
                date.setTime(date.getTime() + (30 * 24 * 60 * 60  * 1000));
                date.toGMTString();
                localStorage.setItem("hasuraID", hasuraID);
                localStorage.setItem("authToken","Bearer " +  authToken);
                localStorage.setItem("loggedIn", true);
                localStorage.setItem("username", username);
                document.cookie = "authToken = " + authToken + "; expires = " + date;
                window.location.href = "/about";
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if(jqXHR.status == 403)
                    $("#errorMessage").html("Invalid username / password");
                else{
                    $("body").html(errorScreen);
                }
            },
            processData: false

        });
    }
});
