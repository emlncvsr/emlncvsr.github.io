function nodroit() {
  return false;
}
document.oncontextmenu = nodroit;

// $(document).on("contextmenu", function (e) {
//   // Empêcher le menu contextuel par défaut
//   e.preventDefault();

//   // Créer un nouvel événement de clic gauche
//   var leftClickEvent = new MouseEvent("click", {
//     bubbles: true,
//     cancelable: true,
//     clientX: e.clientX,
//     clientY: e.clientY,
//   });

//   // Dispatch de l'événement de clic gauche sur l'élément cliqué
//   e.target.dispatchEvent(leftClickEvent);
// });
