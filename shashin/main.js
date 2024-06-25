$(document).ready(function () {
  // Variables
  const imagePath = "assets/img/min/";
  const originalImagePath = "assets/img/original/";
  const imageReductionFactor = 3.03;
  const gallery = $("#gallery");
  let currentImageIndex = 0;
  let totalColumnsPossible;

  // Initial Setup
  initGallery();
  setupSearchBar();
  setupOverlay();
  setupSidebar();

  // Functions
  function initGallery() {
    randomizeAndPlaceImages();
    $(window).on("resize", debounce(randomizeAndPlaceImages, 500));
  }

  function randomizeAndPlaceImages() {
    $.ajax({
      url: imagePath,
      success: function (data) {
        const imageLinks = $(data).find("a[href$='.jpg'], a[href$='.jpeg'], a[href$='.png'], a[href$='.webp']");
        imageLinks.sort(() => 0.5 - Math.random());

        calculateColumns();
        const imagesPerColumn = Math.ceil(imageLinks.length / totalColumnsPossible);
        gallery.empty();

        for (let i = 0; i < totalColumnsPossible; i++) {
          const flexColumn = $("<div>").addClass("flex-column");
          for (let j = i * imagesPerColumn; j < (i + 1) * imagesPerColumn && j < imageLinks.length; j++) {
            const fileName = decodeURIComponent($(imageLinks[j]).attr("href")).replace(imagePath, "").replace("shashin/", "");
            const imageElement = $("<img>").attr({
              src: imagePath + fileName,
              class: "item",
              draggable: "false",
              "data-index": j,
            });
            flexColumn.append(imageElement);
          }
          gallery.append(flexColumn);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Erreur AJAX :", textStatus, errorThrown);
      }
    });
  }

  function calculateColumns() {
    const sidebarWidth = parseInt($(":root").css("--sidebar-width"), 10);
    const galleryGap = parseInt($(":root").css("--gallery-gap"), 10);
    const galleryImageSize = parseInt($(":root").css("--flex-column-width"), 10);
    const galleryPadding = 2 * parseInt($(":root").css("--page-padding"), 10);
    const galleryRoom = $(window).width() - sidebarWidth - galleryPadding - (Math.max(2, Math.floor(($(window).width() - sidebarWidth - galleryPadding) / galleryImageSize)) - 1) * galleryGap;
    totalColumnsPossible = Math.max(2, Math.floor(galleryRoom / galleryImageSize));
  }

  function setupSearchBar() {
    const searchBarButton = $("#search-button");
    const searchBarOverlay = $("#searchbar-overlay");
    const searchBar = $("#searchbar");

    searchBarButton.click(() => {
      searchBarOverlay.css({ opacity: "100", zIndex: "2" });
      searchBar.focus();
    });

    searchBarOverlay.click((e) => {
      if (e.target === searchBarOverlay[0]) {
        searchBarOverlay.css({ opacity: "0", zIndex: "-1" });
        searchBar.val("");
      }
    });

    searchBar.on("input", () => {
      const searchTerm = searchBar.val().toLowerCase();
      $(".searchbarItemName").each(function () {
        const item = $(this).parent().parent();
        const containsSearchTerm = $(this).text().toLowerCase().includes(searchTerm);
        item.css({
          opacity: containsSearchTerm ? "100" : "0",
          zIndex: containsSearchTerm ? "1" : "-1",
          display: containsSearchTerm ? "flex" : "none"
        });
      });
    });
  }

  function setupOverlay() {
    const overlay = $("<div>").addClass("overlay").appendTo("body");
    const overlayContent = $("<div>").addClass("overlay-content").appendTo(overlay);
    const overlayImage = $("<img>").addClass("overlay-image").appendTo(overlayContent);
    const imageTitle = $("<p>").addClass("image-title").appendTo(overlayContent);
    const downloadButton = $("<a>").addClass("download-button").text("Download").appendTo(overlayContent).attr("download", "");
    const widthElement = $("<p>").addClass("image-width").appendTo(overlayContent);
    const heightElement = $("<p>").addClass("image-height").appendTo(overlayContent);
    const prevButton = $("<ion-icon>").attr({ id: "prev-button", name: "chevron-back-outline" }).prependTo(overlay);
    const nextButton = $("<ion-icon>").attr({ id: "next-button", name: "chevron-forward-outline" }).appendTo(overlay);

    overlay.click((e) => {
      if (!$(e.target).is("img, p, #prev-button, #next-button, .download-button")) {
        overlay.removeClass("visible");
      }
    });

    gallery.on("click", ".item", function () {
      const index = parseInt($(this).attr("data-index"));
      currentImageIndex = index;
      showImage(index);
      const fileName = $(this).attr("src").replace(imagePath, "").replace(".webp", "").replace("shashin/", "");
      imageTitle.text(fileName);
    });

    prevButton.click(() => {
      currentImageIndex = currentImageIndex - 1 < 0 ? gallery.find(".item").length - 1 : currentImageIndex - 1;
      showImage(currentImageIndex);
    });

    nextButton.click(() => {
      currentImageIndex = currentImageIndex + 1 >= gallery.find(".item").length ? 0 : currentImageIndex + 1;
      showImage(currentImageIndex);
    });

    function showImage(index) {
      const $clickedImage = gallery.find('.item[data-index="' + index + '"]');
      if (!$clickedImage.length || !$clickedImage.attr("src")) {
        console.error("Invalid image or source for index:", index);
        return;
      }
      const fileName = $clickedImage.attr("src").replace(imagePath, "").replace(".webp", "").replace("shashin/", "");
      overlayImage.attr("src", $clickedImage.attr("src"));
      imageTitle.text(fileName);

      if (fileName.includes("/") || fileName.length > 15) {
        imageTitle.hide();
      } else {
        imageTitle.show();
      }
      overlay.addClass("visible");

      const image = new Image();
      image.onload = function () {
        downloadButton.attr("href", originalImagePath + fileName + ".jpg");
        widthElement.text("Width: " + Math.round(this.naturalWidth * imageReductionFactor) + " pixels");
        heightElement.text("Height: " + Math.round(this.naturalHeight * imageReductionFactor) + " pixels");
      };
      image.src = $clickedImage.attr("src");
    }
  }

  function setupSidebar() {
    let phoneMenuClosed = true;
    const sidebar = $("#sidebar");

    $("#mobileMenuToggle").click(function () {
      sidebar.toggleClass("toggled");
      phoneMenuClosed = !phoneMenuClosed;
      const icon = phoneMenuClosed ? "pause-outline" : "close-outline";
      $("#mobileMenuToggle ion-icon").attr("name", icon);
    });

    $("#page").click(() => {
      sidebar.removeClass("toggled");
      $("#mobileMenuToggle ion-icon").attr("name", "pause-outline");
    });
  }

  function debounce(func, wait) {
    let timeout;
    return function () {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
});
