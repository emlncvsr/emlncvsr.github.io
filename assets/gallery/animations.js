$(document).ready(function () {
  document.documentElement.style.setProperty("--sidebar-height", $("#sidebar")[0].offsetHeight + "px");
  var phoneMenuClosed = true;

  $("#mobileMenuToggle").click(function () {
    $("#sidebar").toggleClass("toggled");
    phoneMenuClosed = !phoneMenuClosed;
    $("#mobileMenuToggle ion-icon").attr("name", phoneMenuClosed ? "pause-outline" : "close-outline");
  });

  $("#page").click(function () {
    $("#sidebar").removeClass("toggled");
    $("#mobileMenuToggle ion-icon").attr("name", "pause-outline");
  });

  $(".overlay").on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function () {
    if ($(this).hasClass("visible")) {
      $("body").addClass("locked-body");
    } else {
      $("body").removeClass("locked-body");
    }
  });
});

var clickCounter = 0;
var secretPathcode = "";

$(".sidebar-item:eq(2)").on("click", function () {
  clickCounter++;
  if (clickCounter === 7) {
    $("body").append("<button id='secret'>Secret</button>");
    setTimeout(() => {
      $("#secret").remove();
      clickCounter = 0;
    }, 3000);
  }

  if (clickCounter > 7) {
    $("#secret").remove();
    clickCounter = 0;
  }

  $("#secret").on("click", async function () {
    $("#secret-overlay").css({
      opacity: 100,
      zIndex: 3,
    });
    $("#secretInput").focus();
    $("#secret-overlay").on("click", function (event) {
      if (!$(event.target).closest("#secret-overlay-content").length) {
        $(this).css({
          opacity: 0,
          zIndex: -1,
        });
      }
    });

    $("#secretInput").on("input", function () {
      secretPathcode = $(this).val();
      imagePath = "/shashin/assets/img/" + secretPathcode + "min/";
      originalImagePath = "/shashin/assets/img/" + secretPathcode + "original/";

      if (secretPathcode.length > 6) {
        $("#secret-overlay").css({
          opacity: 0,
          zIndex: -1,
        });
      }

      $(".overlay, #image-names").toggleClass("secret-gallery");

      randomizeAndPlaceImages();
      searchBarImages();
    });
  });
});
