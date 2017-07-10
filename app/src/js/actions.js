
$(document).ready(function () {
    var token = $("#token").html();
    var hasuraID = parseInt($("#hid").html());
    token =  'Bearer ' + token;
    console.log(token);
    console.log(typeof token);
    console.log(hasuraID);
    console.log(typeof hasuraID);
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
                localStorage.setItem("Logged In", "false");
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

    $("#search").keypress(function(e){
        if(e.keyCode == '13'){
            var key = $('#search').val();
            //$('#search').html("");
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
        }
    });

    $("#cat").change(function(){
        alert("Trying to change");
        /*var cat = jQuery("#category option:selected").val();
        if(cat == "book"){
            $("#upload").html("Add a book");

        }
        else if (cat == "movie") {
            $("#upload").html("Add a movie");
        }*/
    });

    $("#shareButton").click(function(){
        var title = $("#title").val();
        var author = $("#author").val();
        var genre = $("#genre").val();
        var quality = $("#quality").val();
        var category = $("#category").val();

        $.ajax({
            type: 'POST',
            crossDomain: true,
            dataType: 'json',
            url: 'http://data.c100.hasura.me/v1/query/',
            success: function (data) {
                $("#shareResult").html("Sharing is caring. Good job! :D")
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
                "type": "insert",
                "args": {
                    "table": "resource",
                    "objects": [
                        {
                        "owner": hasuraID,
                        "title": title,
                        "author/artist": author,
                        "genre": genre,
                        "quality": quality,
                        "category": category

                        }
                    ],
                    "returning": ["resourceID", "title"]

                },
                "processData": false
            })

        });

    })
});
