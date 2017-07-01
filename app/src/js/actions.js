$(document).ready(function () {
    var token = $("#token").html();
    token =  'Bearer ' + token;
    console.log(token);
    console.log(typeof token);
    $("#logoutButton").click(function() {
        /*$.post(
         'http://auth.c100.hasura.me/user/logout/',
         {
         'Authorization': token

         })
         .done( function(msg) {
         alert(msg);
         })
         .fail( function(xhr, textStatus, errorThrown) {
         alert("onreadystatechange: " + xhr.onreadystatechange + "\nready" +
         "State: " + xhr.readyState + "\nresponseText: " + xhr.responseText + "\nresponseXML: " + xhr.responseXML + "\nstatus: " + xhr.status + "\nstatusText: " + xhr.statusText + "\n\ntextStatus: " + textStatus + "\n\nerrorThrown: " + errorThrown);
         });*/
        $.ajax({
            type: 'POST',
            crossDomain: true,
            dataType: 'json',
            url: 'http://auth.c100.hasura.me/user/logout',
            success: function (data) {
                //alert("You have been logged out! ");
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

    $("#searchButton").click(function(){
        var key = $('#searchText').val();
        if (key.trim().length > 0) {
            $.ajax({
                type: 'POST',
                crossDomain: true,
                dataType: 'json',
                url: 'http://data.c100.hasura.me/v1/query/',
                success: function (data) {
                    $("#searchResults").html(JSON.stringify(data));
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert("onreadystatechange: " + jqXHR.onreadystatechange + "\nready" +
                        "State: " + jqXHR.readyState + "\nresponseText: " + jqXHR.responseText + "\nresponseXML: " + jqXHR.responseXML + "\nstatus: "
                        + jqXHR.status + "\nstatusText: " + jqXHR.statusText + "\n\ntextStatus: " + textStatus + "\n\nerrorThrown: " + errorThrown);
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token

                },
                data: JSON.stringify({
                    "type": "select",
                    "args": {
                        "columns": ["*"],
                        "table": "resource",
                        "where": {
                            "title": {"$ilike": "%" + key + "%"}
                        }
                    }
                }),
                processData: false
            });


        }else{
            alert("You need to enter a search text");
        }



    });
});

