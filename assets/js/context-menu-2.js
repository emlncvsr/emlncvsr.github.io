// function nodroit() {
//   return false;
// }
// document.oncontextmenu = nodroit;

let contextMenu = $(".context-menu")[0];

$(document).on("contextmenu", function (e) {
  $(".context-menu").css({
    top: e.pageY,
    left: e.pageX,
  });

  contextMenu.style.display = "flex";
  contextMenu.style.opacity = "100";

  return false;
});

$(document).click(function (e) {
  if (e.which == 1) {
    contextMenu.style.opacity = 0;
  }
});

$(document).keydown(function (e) {
  if (e.which == 27) {
    contextMenu.style.opacity = 0;
  }
});
