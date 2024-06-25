let htmlFilePath = new URL(window.location.href).pathname.split("/").slice(0, -1).join("/") + "/";
let [imagePath, originalImagePath] = [htmlFilePath + "assets/img/min/", htmlFilePath + "assets/img/original/"];
const imageReductionFactor = 3.03;
const sidebarWidth = parseInt($(":root").css("--sidebar-width"), 10);
const galleryGap = parseInt($(":root").css("--gallery-gap"), 10);
const galleryImageSize = parseInt($(":root").css("--flex-column-width"), 10);
const galleryPadding = 2 * parseInt($(":root").css("--page-padding"), 10);
let totalColumnsPossible;

const imageDictionary = JSON.parse(localStorage.getItem("imageDictionary")) || {};

function calculateColumns() {
  const galleryRoom = $(window).width() - sidebarWidth - galleryPadding - (Math.max(2, Math.floor(($(window).width() - sidebarWidth - galleryPadding) / galleryImageSize)) - 1) * galleryGap;
  totalColumnsPossible = Math.max(2, Math.floor(galleryRoom / galleryImageSize));
}

function processImage(imageLink) {
  const fileName = decodeURIComponent($(imageLink).attr("href")).replace(imagePath, "");
  const modifiedDate = new Date($(imageLink)[0].lastModified);
  const currentDate = new Date();
  const imageKey = fileName;

  // if ((fileName.length > 0 && !(imageKey in imageDictionary)) || currentDate - modifiedDate < 24 * 60 * 60 * 1000) {
  //   showNotification(fileName);

  //   if (!(imageKey in imageDictionary)) {
  //     imageDictionary[imageKey] = {};
  //   }

  //   imageDictionary[imageKey].isNew = true;
  // }
}

function randomizeAndPlaceImages() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: imagePath,
      success: function (data) {
        const imageLinks = $(data).find("a[href$='.jpg'], a[href$='.jpeg'], a[href$='.png'], a[href$='.webp']");
        const previousImageDictionary = JSON.parse(localStorage.getItem("imageDictionary")) || {};

        imageLinks.sort(() => 0.5 - Math.random());

        calculateColumns();

        const totalImages = imageLinks.length;

        for (const imageLink of imageLinks) {
          processImage(imageLink);
        }

        localStorage.setItem("imageDictionary", JSON.stringify(imageDictionary));

        const imagesPerColumn = Math.ceil(totalImages / totalColumnsPossible);
        const totalColumns = Math.ceil(totalImages / imagesPerColumn);
        gallery.empty();

        let loadedImages = 0;

        for (let i = 0; i < totalColumns; i++) {
          const flexColumn = $("<div>").addClass("flex-column");

          for (let j = i * imagesPerColumn; j < (i + 1) * imagesPerColumn && j < totalImages; j++) {
            const fileName = decodeURIComponent($(imageLinks[j]).attr("href")).replace(imagePath, "");

            const imageElement = $("<img>").attr({
              src: imagePath + fileName,
              class: "item",
              draggable: "false",
              id: fileName.replace(".webp", ""),
              alt: fileName.replace(".webp", ""),
              "data-index": j,
              rel: "preload",
              fetchpriority: "high",
              // loading: "lazy",
            });

            (function (currentImage) {
              currentImage.on("load", function () {
                loadedImages++;

                if (loadedImages === totalImages) {
                  // Utilisez $(this) pour faire référence à l'image actuellement chargée
                  $(this).show();
                  $("#profile-picture").css("background", `url(${gallery[0].lastElementChild.lastElementChild.src})`);
                  searchBarImages();
                }
              });
            })(imageElement);

            flexColumn.append(imageElement);
          }
          gallery.append(flexColumn);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        reject(new Error("Erreur AJAX : " + textStatus + " " + errorThrown));
      },
    });
  }).catch((error) => {
    console.error(error);
  });
}
