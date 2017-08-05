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
                url: 'http://data.nandhithakamal.hasura.me/v1/query/',
                success: function (data) {
                    displayResources(data);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    if(jqXHR.status == 401){
                        window.location.href = "/";
                        console.log("Invalid user");
                    }
                    else{
                        alert("onreadystatechange: " + jqXHR.onreadystatechange + "\nready" +
                            "State: " + jqXHR.readyState + "\nresponseText: " + jqXHR.responseText + "\nresponseXML: " + jqXHR.responseXML + "\nstatus: "
                            + jqXHR.status + "\nstatusText: " + jqXHR.statusText + "\n\ntextStatus: " + textStatus + "\n\nerrorThrown: " + errorThrown);
                    }
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
                                "title": {
                                    "$ilike": "%" + key + "%"
                                },
                                "owner": {
                                    "$ne": hasuraID
                                }
                        }
                    }
                }),
                processData: false
            });

        }else{
                alert("You need to enter a search text");
        }
    }
    //alert("You need to enter a search text");

    function displayResources(data){
        $("#searchResults").html("");
        for(var i = 0; i < data.length; i++){
            var title = data[i].title;
            var cat = data[i].category;
            var author = data[i]['author/artist'];
            var ownerID = data[i].owner;
            var resourceID = data[i].resourceID;
            var owner = data[i].ownerName.name;
            var quality = data[i].quality;
            var genre = data[i].genre;

            $("#searchResults").append("<div class = 'resource well'>" + (i+1).toString() + ".  " + cat + "<br>" + title +
                " - " + author + "<br>" + "<div class = 'resourceInfo'>" + quality + ", " + genre + "<br>" + "<span class = 'requestResource'> Request from " + "</span>" + "<span class = 'owner'>" +  owner +  "</span>" + "<span class = 'ownerID'>" +  ownerID +  "</span>" + "<span class = 'resourceID'>" + resourceID +  "</span>" + "</div>" + "</div>");
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
                url: 'http://data.nandhithakamal.hasura.me/v1/query/',
                success: function(){
                    alert("Request successful!");

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    if(jqXHR.status == 401){
                        window.location.href = "/";
                        console.log("Invalid user");
                    }
                    else{
                        alert("onreadystatechange: " + jqXHR.onreadystatechange + "\nready" +
                            "State: " + jqXHR.readyState + "\nresponseText: " + jqXHR.responseText + "\nresponseXML: " + jqXHR.responseXML + "\nstatus: "
                            + jqXHR.status + "\nstatusText: " + jqXHR.statusText + "\n\ntextStatus: " + textStatus + "\n\nerrorThrown: " + errorThrown);
                    }
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
        $.ajax({
            type: 'POST',
            crossDomain: true,
            dataType: 'json',
            url: 'http://auth.nandhithakamal.hasura.me/user/logout',
            success: function (data) {
                //alert("You have been logged out! ");
                localStorage.setItem("loggedIn", "false");
                localStorage.removeItem("hasuraID");
                localStorage.removeItem("authToken");
                localStorage.removeItem("username");
                document.cookie = "authToken = false";
                window.location.href = "/";
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if(jqXHR.status == 401){
                    window.location.href = "/";
                    console.log("Logged out already");
                }
                else{
                    alert("onreadystatechange: " + jqXHR.onreadystatechange + "\nready" +
                        "State: " + jqXHR.readyState + "\nresponseText: " + jqXHR.responseText + "\nresponseXML: " + jqXHR.responseXML + "\nstatus: "
                        + jqXHR.status + "\nstatusText: " + jqXHR.statusText + "\n\ntextStatus: " + textStatus + "\n\nerrorThrown: " + errorThrown);
                }
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
        $(this).css("background-color", "#edd09c");
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

    $(".caret").on('click', function(){
        $(".resourceMenu").slideToggle("fast");
    });
    $("#currResource").on('click', function(){
        $(".resourceMenu").slideToggle("fast");
    });
    $("#bookResource").on('click', function(){
        $("#currResource").html("Book");
        $(".resourceMenu").slideUp("fast");
        $("#addBook").slideDown("fast");
        $("#addMovie").slideUp("fast");
        $("#addMusic").slideUp("fast");
        $(".shareError").html("");
        $("#shareResult").html("");
    });
    $("#movieResource").on('click', function(){
        $("#currResource").html("Movie");
        $(".resourceMenu").slideUp("fast");
        $("#addMovie").slideDown("fast");
        $("#addMusic").slideUp("fast");
        $("#addBook").slideUp("fast");
        $(".shareError").html("");
        $("#shareResult").html("");
    });
    $("#musicResource").on('click', function(){
        $("#currResource").html("Music");
        $(".resourceMenu").slideUp("fast");
        $("#addMusic").slideDown("fast");
        $("#addMovie").slideUp("fast");
        $("#addBook").slideUp("fast");
        $(".shareError").html("");
        $("#shareResult").html("");
    });


    $("#bshareButton").click(function(){
        var title = $("#btitle").val();
        var author = $("#author").val();
        var genre = $("#bgenre").val();
        var quality = $("input[name='bquality']:checked").val();
        //console.log("Quality" + quality);
        var category = $("#currResource").html();

        if(title === "" || author === ""){
            $(".shareError").html("Please fill all fields!");
        }
        else{
            $.ajax({
                type: 'POST',
                crossDomain: true,
                dataType: 'json',
                url: 'http://data.nandhithakamal.hasura.me/v1/query/',
                success: function (data) {
                    $("#shareResult").html("Sharing is caring. Good job! :D");
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    if(jqXHR.status == 401){
                        window.location.href = "/";
                        console.log("Invalid user");
                    }
                    else{
                        alert("onreadystatechange: " + jqXHR.onreadystatechange + "\nready" +
                            "State: " + jqXHR.readyState + "\nresponseText: " + jqXHR.responseText + "\nresponseXML: " + jqXHR.responseXML + "\nstatus: "
                            + jqXHR.status + "\nstatusText: " + jqXHR.statusText + "\n\ntextStatus: " + textStatus + "\n\nerrorThrown: " + errorThrown);
                    }
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
        }

    });

    $("#bresetButton").on('click', function(){
        $("#btitle").val("");
        $("#author").val("");
        $("#bgenre").val("");
        $("input[name='bquality']").prop('checked', false);
        $(".shareError").html("");
        $("#shareResult").html("");
    });

    $("#mshareButton").on('click', function(){
        var title = $("#mtitle").val();
        var artist = $("#artist").val();
        var genre = $("#mgenre").val();
        var bitrate = $("input[name='bitrate']:checked").val();
        console.log(bitrate);
        var category = $("#currResource").html();

        if(title === "" || artist === ""){
            $(".shareError").html("Please fill all fields!");
        }
        else{

            $.ajax({
                type: 'POST',
                crossDomain: true,
                dataType: 'json',
                url: 'http://data.nandhithakamal.hasura.me/v1/query/',
                success: function (data) {
                    $("#shareResult").html("Sharing is caring. Good job! :D");
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    if(jqXHR.status == 401){
                        window.location.href = "/";
                        console.log("Invalid user");
                    }
                    else{
                        alert("onreadystatechange: " + jqXHR.onreadystatechange + "\nready" +
                            "State: " + jqXHR.readyState + "\nresponseText: " + jqXHR.responseText + "\nresponseXML: " + jqXHR.responseXML + "\nstatus: "
                            + jqXHR.status + "\nstatusText: " + jqXHR.statusText + "\n\ntextStatus: " + textStatus + "\n\nerrorThrown: " + errorThrown);
                    }
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
                            "author/artist": artist,
                            "genre": genre,
                            "quality": bitrate,
                            "category": category

                            }
                        ],
                        "returning": ["resourceID", "title"]

                    },
                    "processData": false
                })

            });
        }

    });

    $("#mresetButton").on('click', function(){
        $("#mtitle").val("");
        $("#artist").val("");
        $("#mgenre").val("");
        $("input[name='bitrate']").prop('checked', false);
        $(".shareError").html("");
        $("#shareResult").html("");
    });

    $("#movshareButton").on('click', function(){
        var title = $("#movtitle").val();
        var director = $("#director").val();
        var genre = $("#movgenre").val();
        var quality = $("input[name='movquality']:checked").val();
        console.log(quality);
        var category = $("#currResource").html();

        if(title === "" || director === ""){
            $(".shareError").html("Please fill all fields!");
        }
        else{
            $.ajax({
                type: 'POST',
                crossDomain: true,
                dataType: 'json',
                url: 'http://data.nandhithakamal.hasura.me/v1/query/',
                success: function (data) {
                    $("#shareResult").html("Sharing is caring. Good job! :D");
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    if(jqXHR.status == 401){
                        console.log("Invalid user");
                        window.location.href = "/";
                    }
                    else{
                        alert("onreadystatechange: " + jqXHR.onreadystatechange + "\nready" +
                            "State: " + jqXHR.readyState + "\nresponseText: " + jqXHR.responseText + "\nresponseXML: " + jqXHR.responseXML + "\nstatus: "
                            + jqXHR.status + "\nstatusText: " + jqXHR.statusText + "\n\ntextStatus: " + textStatus + "\n\nerrorThrown: " + errorThrown);
                    }
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
                            "author/artist": director,
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
        }

    });

    $("#movresetButton").on('click', function(){
        $("#movtitle").val("");
        $("#director").val("");
        $("#movgenre").val("");
        $("input[name='movquality']").prop('checked', false);
        $(".shareError").html("");
        $("#shareResult").html("");
    });
});
