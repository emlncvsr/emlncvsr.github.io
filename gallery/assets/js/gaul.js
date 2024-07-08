document.title = "Gallery | ゴール";
htmlFilePath = "gaul"

$(document).ready(function () {
  $("#name").text("ゴール");
  $("#username").text("gaul");
  $("#url").attr("data-url", "/links").text("links");
  $("#about").text("Méchant fasciste, National-Japonisme & Tradition 𖦏");
  $("#footer-content").children().last().html("<p>© 2024 ゴール, Inc. All rights reserved.</p>");
  $(".logo-text").text("ゴール");
  $("#profile-picture").css("background", "url('assets/img/gaul/min/1.webp')");
});
