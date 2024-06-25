// Créer l'overlay et ses éléments
let resizeTimer;
const gallery = $("#gallery");
const overlay = $("<div>").addClass("overlay").appendTo("body");
const overlayContent = $("<div>").addClass("overlay-content").appendTo(overlay);
const overlayImage = $("<img>").addClass("overlay-image").attr("alt", "Overlay Image").appendTo(overlayContent);
const imageInfo = $("<div>").addClass("image-info").appendTo(overlayContent);
const imageTitle = $("<p>").addClass("image-title").appendTo(imageInfo);
const downloadButton = $("<a>").addClass("download-button").html("Download").appendTo(imageInfo).attr("download", "");
const widthElement = $("<p>").addClass("image-width").text("Width: ").appendTo(imageInfo);
const heightElement = $("<p>").addClass("image-height").text("Height: ").appendTo(imageInfo);
const prevButton = $("<ion-icon>").attr("id", "prev-button").attr("name", "chevron-back-outline").prependTo(overlay);
const nextButton = $("<ion-icon>").attr("id", "next-button").attr("name", "chevron-forward-outline").appendTo(overlay);

// Gérer la fermeture de l'overlay lors du clic en dehors de l'image
overlay.click(function (e) {
  if ($(e.target).is("img, p, #prev-button, #next-button, .download-button")) {
    return;
  }
  overlay.removeClass("visible");
});

let currentImageIndex = 0;

// Gérer le clic sur une image dans la galerie
gallery.on("click", ".item", function () {
  showImage(parseInt($(this).attr("data-index")));
  imageTitle.text($(this).attr("id").replace(".webp", ""));
});

// Gérer le clic sur le bouton précédent
prevButton.click(function () {
  if (currentImageIndex - 1 < 0) {
    currentImageIndex = gallery.find(".item").length - 1;
  } else {
    currentImageIndex = currentImageIndex - 1;
  }
  showImage(currentImageIndex);
});

// Gérer le clic sur le bouton suivant
nextButton.click(function () {
  if (currentImageIndex + 1 > gallery.find(".item").length) {
    currentImageIndex = 0;
  } else {
    currentImageIndex = currentImageIndex + 1;
  }
  showImage(currentImageIndex);
});

// Gérer le clic sur le bouton de randomisation
$("#randomizeButton").on("click", function () {
  randomizeAndPlaceImages();
});

// Appeler la fonction randomizeAndPlaceImages lors du chargement de la page
randomizeAndPlaceImages();

let windowWidth = $(window).width();

$(window).on("resize", function () {
  const newWindowWidth = $(window).width();
  if (Math.abs(newWindowWidth - windowWidth) > 10) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      windowWidth = newWindowWidth;
      randomizeAndPlaceImages();
    }, 500);
  }
});

// Gérer le clic sur le bouton de vue
$("#viewButton").on("click", function () {
  $("#imageNotification").fadeOut();

  $(".item").each(function () {
    const index = parseInt($(this).attr("data-index"));
    if (imageDictionary.hasOwnProperty(index)) {
      imageDictionary[index].isNew = false;
    }
  });

  localStorage.setItem("imageDictionary", JSON.stringify(imageDictionary));
});
