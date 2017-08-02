$(document).ready(function(){
    var token = localStorage.getItem("authToken");
    var hasuraID = localStorage.getItem("hasuraID");

    $.ajax({
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        url: 'http://data.c100.hasura.me/v1/query/',
        success: function(data){
            var n = data.length;
            var i = 0;
            while(i < n){
                $("#resources").append("<br>" + JSON.stringify(data[i]));
                i++;
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("onreadystatechange: " + jqXHR.onreadystatechange + "\nready" +
                "State: " + jqXHR.readyState + "\nresponseText: " + jqXHR.responseText + "\nresponseXML: " + jqXHR.responseXML + "\nstatus: "
                + jqXHR.status + "\nstatusText: " + jqXHR.statusText + "\n\ntextStatus: " + textStatus + "\n\nerrorThrown: " + errorThrown);
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
                }
            }
        }),
        processData: false
    });

    $.ajax({
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        url: 'http://data.c100.hasura.me/v1/query/',
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
            alert("onreadystatechange: " + jqXHR.onreadystatechange + "\nready" +
                "State: " + jqXHR.readyState + "\nresponseText: " + jqXHR.responseText + "\nresponseXML: " + jqXHR.responseXML + "\nstatus: "
                + jqXHR.status + "\nstatusText: " + jqXHR.statusText + "\n\ntextStatus: " + textStatus + "\n\nerrorThrown: " + errorThrown);
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
            url: 'http://auth.c100.hasura.me/user/logout',
            success: function (data) {
                //alert("You have been logged out! ");
                localStorage.setItem("Logged In", "false");
                localStorage.removeItem("hasuraID");
                localStorage.removeItem("authToken");
                localStorage.removeItem("username");
                document.cookie = "authToken = false";
                window.location.href = "/";
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("onreadystatechange: " + jqXHR.onreadystatechange + "\nready" +
                    "State: " + jqXHR.readyState + "\nresponseText: " + jqXHR.responseText + "\nresponseXML: " + jqXHR.responseXML + "\nstatus: "
                    + jqXHR.status + "\nstatusText: " + jqXHR.statusText + "\n\ntextStatus: " + textStatus + "\n\nerrorThrown: " + errorThrown);
            },
            contentType: 'application/json',
            headers: {
                'Authorization': token
            }
        });
    });
});
