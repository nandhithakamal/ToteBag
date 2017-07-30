$(document).ready(function () {
    var token = localStorage.getItem("authToken");
    var hasuraID = localStorage.getItem("hasuraID");

    //token =  'Bearer ' + token;

    console.log(token);
    console.log(typeof token);
    console.log(hasuraID);
    console.log(typeof hasuraID);

    function fetchResources(){
        var key = $("#searchText").val();

        if (key.trim().length > 0) {
            $.ajax({
                type: 'POST',
                crossDomain: true,
                dataType: 'json',
                url: 'http://data.c100.hasura.me/v1/query/',
                success: function (data) {
                    displayResources(data);
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
                        "columns": [
                            "*",
                            {
                                "name": "ownerName",
                                "columns": ["*"]
                            }
                        ],
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

    function displayResources(data){
        $("#searchResults").html("");
        for(var i = 0; i < data.length; i++){
            var title = data[i].title;
            var cat = data[i].category;
            var author = data[i]['author/artist'];
            var ownerID = data[i].owner;
            var resourceID = data[i].resourceID;
            var owner = data[i].ownerName.name;

            $("#searchResults").append("<div class = 'resource well'>" + (i+1).toString() + ".  " + cat + "<br>" + title +
                " - " + author + "<br>" + "<div class = 'resourceInfo'>" + "<span class = 'requestResource'> Request from " +
            "</span>" + "<span class = 'owner'>" +  owner +  "</span>" + "<span class = 'ownerID'>" +  ownerID +  "</span>" + "<span class = 'reasourceID'>" + resourceID +  "</span>" + "</div>" + "</div>");
        }
    }

    function requestResource(ownerID, resourceID){
        //var resourceID = $(this).children("span.resourceID").val();
        //console.log(resourceID);
        if(ownerID == hasuraID){
            alert("You own it. ");
        }
        else{
            $.ajax({
                type: 'POST',
                crossDomain: true,
                dataType: 'json',
                url: 'http://data.c100.hasura.me/v1/query/',
                success: function(){
                    alert("Request successful!");

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
                		"table": "request",
                		"objects": [
                			{
                				"resourceID": resourceID,
                				"requestorID": hasuraID,
                				"requesteeID": ownerID

                			}
                		],
                		"returning": ["requestID"]
                	}
                }),
                processData: false
            })
        }
    }


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
                localStorage.setItem("loggedIn", "false");
                localStorage.removeItem("hasuraID");
                localStorage.removeItem("authToken");
                localStorage.removeItem("username");

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

    $("#searchBar").keypress(function(e){
        if(e.keyCode == '13'){
            fetchResources();
        }
    });
    $("#searchButton").click(function(){
        fetchResources();
    });

    $(document).on('click', '.resource', function(){
        $('.resource').css("background-color","");
        $(this).css("background-color", "#c9d8f2");
        //('.resourceInfo').slideUp("fast");
        $(this).children("div.resourceInfo").slideToggle("fast");
        //alert("You are attempting to request a resource. ");
    });
    $(document).on('click', '.requestResource', function(){
        $('.requestResource').html("Request from ");
        //$(this).html("Requesting from... ");
        var ownerID = $(this).next().next().html();
        var resourceID = $(this).next().next().next().html();
        console.log("ownerID " + ownerID + " " + typeof ownerID);
        console.log("resourceID " + resourceID + " " + typeof resourceID);
        requestResource(ownerID, resourceID);
    });
    $(document).on('click', '.owner', function(){
        $('.requestResource').html("Request from ");
        //$(this).prev().html("Requesting from... ");
        var ownerID = parseInt($(this).next().html());
        var resourceID = parseInt($(this).next().next().html());
        console.log("ownerID " + ownerID + " " + typeof ownerID);
        console.log("resourceID " + resourceID + " " + typeof resourceID);

        requestResource(ownerID, resourceID);
    })

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
                $("#shareResult").html("Sharing is caring. Good job! :D");
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

    });
});
