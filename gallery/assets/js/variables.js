$(document).ready(function () {
  $("img").attr("draggable", "false");
  $("#following").html("following");
  $("#about-title").text("ABOUT");
  $("#gallery-title").text("Gallery");
  $("#termsOfUse").text("Terms of Use");
  $("#privacyPolicy").text("Privacy Policy");
  $("#cookieNotice").text("Cookie Notice");
  $("#cookieSettings").text("Cookie Settings");
  $("#imageNotification").html('<h1 id="notificationText">New Post!</h1><p id="notificationDescription">A new image has been published.</p><button id="viewButton">Dismiss</button>');
  $(".context-menu").html('<a href="#page">Haut de Page</a><a href="#gallery">Gallerie</a><p data-url="/">Accueil</p>');
  // $("#preloader").html('<p class="preloader-waiting">ロード..</p><div class="preload-count-container"><p class="number colored-text"></p><span class="colored-text">%</span></div>');
  $("#following").click(function () {
    if ($(this).text() === "following") {
      $(this).removeClass("followed").text("follow");
    } else {
      $(this).addClass("followed").text("following");
    }
  });
  // $("img").each(function () {
  //   if ($(this).attr("src") && $(this).attr("src").endsWith(".svg")) {
  //     $(this).addClass("icon");
  //   }
  // });
});
