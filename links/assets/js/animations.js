$(document).ready(function () {
  $("ion-icon[name='copy-outline'], ion-icon[name='share-outline']").click(function () {
    navigator.clipboard.writeText(new URL($(this).siblings(".link").data("url"), window.location.origin + window.location.pathname).href);

    $("#copied")
      .removeClass("outOfScreen")
      .delay(3000)
      .queue(function (next) {
        $(this).addClass("outOfScreen");
        next();
      });
    $(this).attr("name", "checkmark-outline");
  });

  $("ion-icon[name='copy-outline']")
    .parent()
    .mouseleave(function () {
      setTimeout(() => {
        $(this).find("ion-icon").attr("name", "copy-outline");
      }, 500);
    });
});
