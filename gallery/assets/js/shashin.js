document.title = "Gallery | 写真";
htmlFilePath = "shashin"

$(document).ready(function () {
  $("#name").text("写真");
  $("#username").text("geijutsushashin");
  $("#url").text("links").attr("data-url", "/links");
  $("#about").text("リヨン ー 大分県 | Samsung Z Flip 4; Canon EOS Kiss X5");
  $("#footer-content").children().last().html("<p>© 2024 写真, Inc. All rights reserved.</p>");
  $(".logo-text").text("写真");
  $("#profile-picture").css("background", "url('assets/img/shashin/min/SKY.webp')");
});
