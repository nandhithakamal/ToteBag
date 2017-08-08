$(document).ready(function () {
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
    var token = localStorage.getItem("authToken");
    var hasuraID = localStorage.getItem("hasuraID");
    var url;
    var protocol = 'http';
    if(window.location.host === "app.c100.hasura.me" || window.location.host === "localhost:8080")
    {
        url = "c100.hasura.me";
    }
    else if(window.location.host === "app.nandhithakamal.hasura.me"){
        url = "nandhithakamal.hasura.me";
    }
    else if(window.location.host === "totebag.gristmill14.hasura-app.io")
    {
        protocol = "https";
        url = "gristmill14.hasura-app.io";
    }

    function fetchResources(){
        var key = $("#searchText").val();
        $("#searchError").html("");
        if (key.trim().length > 0) {
            $.ajax({
                type: 'POST',
                crossDomain: true,
                dataType: 'json',
                url: protocol + '://data.' + url + '/v1/query',
                success: function (data) {
                    if(data.length > 0){
                        displayResources(data);
                        $("#resultEnd").html("That's all for now!");
                        $("#resultEnd").css("color", "#dcdee2");
                    }else {
                        $("#searchResults").html("");
                        $("#resultEnd").html("Sorry! We couldn't find any resources that matched your query");
                        $("#resultEnd").css("color", "red");
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
            $("#searchResults").html("");
            $("#searchError").html("Please enter a search text");
            $("#resultEnd").html("");
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
            var quality = data[i].quality;
            var genre = data[i].genre;

            $("#searchResults").append("<div class = 'resource well'>" + (i+1).toString() + ".  " + cat + "<br>" + title +
                " - " + author + "<br>" + "<div class = 'resourceInfo'>" + quality + ", " + genre + "<br>" + "<span class = 'requestResource' id = 'r" +  i + "'>" + "Request from " + "</span>" + "<span class = 'owner' id = 'o" + i + "'>"+  owner +  "</span>" + "<span class = 'ownerID'>" +  ownerID +  "</span>" + "<span class = 'resourceID'>" + resourceID +  "</span>" + "</div>" + "</div>");
        }
    }

    function requestResource(ownerID, resourceID, id){
        //var resourceID = $(this).children("span.resourceID").val();
        if(ownerID == hasuraID){
            alert("You own it. ");
        }
        else{
            $.ajax({
                type: 'POST',
                crossDomain: true,
                dataType: 'json',
                url: protocol + '://data.' + url + '/v1/query',
                success: function(){
                    console.log("Request successful!");
                    $("#"+id).removeClass('requestResource');
                    $("#"+id).next().removeClass('owner');
                    $("#"+id).html("Requested from ");
                    $("#"+id).off('click');

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
            url: protocol + '://auth.' + url + '/user/logout',
            success: function (data) {
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
    });

    $(document).on('click', '.requestResource', function(){
        var id = $(this).attr('id');
        $(this).children("div.requestResource").html("Requesting from ");
        console.log("You clicked " + id);        //$(this).html("Requesting from... ");
        var ownerID = $(this).next().next().html();
        var resourceID = $(this).next().next().next().html();
        requestResource(ownerID, resourceID, id);
        //console.log(requestStatus);
        /*if (requestStatus == 2){
            $(this).children("div.requestResource").html("Requested from ");
        }else if(requestStatus == 0){
            $("body").html(errorScreen);
        }*/
    });

    $(document).on('click', '.owner', function(){
        var id = $(this).prev().attr('id');
        $(this).children("div.requestResource").html("Requesting from ");
        console.log("You clicked " + id);
        var ownerID = parseInt($(this).next().html());
        var resourceID = parseInt($(this).next().next().html());
        requestResource(ownerID, resourceID, id);
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
        var category = $("#currResource").html();

        if(title === "" || author === ""){
            $(".shareError").html("Please fill all fields!");
        }
        else{
            $.ajax({
                type: 'POST',
                crossDomain: true,
                dataType: 'json',
                url: protocol + '://data.' + url + '/v1/query',
                success: function (data) {
                    $("#shareResult").html("Sharing is caring. Good job! :D");
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
        var category = $("#currResource").html();

        if(title === "" || artist === ""){
            $(".shareError").html("Please fill all fields!");
        }
        else{

            $.ajax({
                type: 'POST',
                crossDomain: true,
                dataType: 'json',
                url: protocol + '://data.' + url + '/v1/query',
                success: function (data) {
                    $("#shareResult").html("Sharing is caring. Good job! :D");
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
        var category = $("#currResource").html();

        if(title === "" || director === ""){
            $(".shareError").html("Please fill all fields!");
        }
        else{
            $.ajax({
                type: 'POST',
                crossDomain: true,
                dataType: 'json',
                url: protocol + '://data.' + url + '/v1/query',
                success: function (data) {
                    $("#shareResult").html("Sharing is caring. Good job! :D");
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
