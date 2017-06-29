$(document).ready(function () {
    var token = $("#token").html();
    console.log(token);
    console.log(typeof token);
    $("#logoutButton").click(function(){
       $.post(
           'http://auth.c100.hasura.me/user/logout/',
           {
               'Authorization':  token

           },
           function () {
               alert("You have been logged out");
           },
           'application/json'
       );
    });
});

