$(document).ready(function(){
    var token = localStorage.getItem("authToken");
    var hasuraID = localStorage.getItem("hasuraID");
    var username = localStorage.getItem("username");

    var url;
    if(window.location.host === "app.c100.hasura.me" || window.location.host === "localhost:8080")
    {
        url = "c100.hasura.me";
    }
    else if(window.location.host === "app.nandhithakamal.hasura.me"){
        url = "nandhithakamal.hasura.me";
    }

    var errorScreen = `<h2 class = "text-center">
        Oops! Something went wrong and we don't know what. :(
    </h2>
    <hr>
    <style>
      @import url('https://fonts.googleapis.com/css?family=Saira');
      body{
          font-family: 'Saira', sans-serif;
      }
    </style>`;

    $("#username").html(username);
    $.ajax({
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        url: 'http://data.' + url + '/v1/query',
        success: function(data){
            var n = data.length;
            var i = 0;
            while(i < n){
                $("#resources").append("<span class = 'cat'>" + data[i].category + "</span>" + ":    " + data[i].title + " - " + data[i]["author/artist"] + "<br>");
                i++;
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if(jqXHR.status == 401){
                window.location.href = "/";
            }
            else{
                $("body").html(errorScreen);
            }
        },
        headers: {
            'Content-Type':'application/json',
            'Authorization': token
        },
        data: JSON.stringify({
            "type": "select",
            "args": {
                "columns": [
                    "category",
                    "title",
                    "author/artist"
                ],
                "table": "resource",
                "where": {
                    "owner": hasuraID
                },
                "order_by": {
                    "column": "category",
                    "order": "asc",
                    "nulls": "last"

                }
            }
        }),
        processData: false
    });

    $.ajax({
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        url: 'http://data.' + url + '/v1/query',
        success: function(data){
            var n = data.length;
            var i = 0;
            while(i < n){
                var owner = data[i].requesteeName.name;
                var resource = data[i].resourceName.title;
                $("#requests").append("<br>" + owner + "'s " + resource);
                i++;
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if(jqXHR.status == 401){
                window.location.href = "/";
            }
            else{
                $("body").html(errorScreen);
            }
        },
        headers: {
            'Content-Type':'application/json',
            'Authorization': token
        },
        data: JSON.stringify({
          "type": "select",
          "args": {
          	"columns": [
          		"*",
          		{
          			"name": "resourceName",
          			"columns": ["title", "author/artist"]
          		},
          		{
          			"name": "requesteeName",
          			"columns": ["*"]
          		}
          	],
          	"table": "request",
            "where": {
            	"requestorID": hasuraID
            }
        }

        }),
        processData: false
    });

    $("#logoutButton").click(function() {
        $.ajax({
            type: 'POST',
            crossDomain: true,
            dataType: 'json',
            url: 'http://data.' + url + '/user/logout',
            success: function (data) {
                localStorage.setItem("Logged In", "false");
                localStorage.removeItem("hasuraID");
                localStorage.removeItem("authToken");
                localStorage.removeItem("username");
                document.cookie = "authToken = false";
                window.location.href = "/";
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if(jqXHR.status == 401){
                    window.location.href = "/";
                }
                else{
                    $("body").html(errorScreen);
                }
            },
            contentType: 'application/json',
            headers: {
                'Authorization': token
            }
        });
    });
});
