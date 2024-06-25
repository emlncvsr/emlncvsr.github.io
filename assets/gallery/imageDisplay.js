function showImage(index) {
  const $clickedImage = gallery.find('.item[data-index="' + index + '"]');

  if (!$clickedImage || !$clickedImage.attr("src")) {
    console.error("Invalid image or source for index:", index);
    return;
  }

  const fileName = $clickedImage
    .attr("src")
    .replace(imagePath, "")
    .replace(".webp", "");

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
    if (!downloadButton || !widthElement || !heightElement) {
      console.error(
        "Invalid download button or dimensions elements for index:",
        index
      );
      return;
    }
    downloadButton.attr("href", originalImagePath + fileName + ".jpg");
    widthElement.text(
      "Width: " +
        Math.round(this.naturalWidth * imageReductionFactor) +
        " pixels"
    );
    heightElement.text(
      "Height: " +
        Math.round(this.naturalHeight * imageReductionFactor) +
        " pixels"
    );
  };

  image.src = $clickedImage.attr("src");
}

function searchBarImages() {
  const searchResults = $("#image-names");
  searchResults.empty();

  $(".item").each(function () {
    const imageSrc = $(this).attr("src");
    const imageFileName = imageSrc.replace(imagePath, "").replace(".webp", "");

    const imageElement = $("<img>").attr({
      src: imageSrc,
      id: imageFileName,
      draggable: "false",
    });
    const imageNameParagraph = $("<div>")
      .addClass("searchbar-item")
      .append(imageElement);
    searchResults.append(imageNameParagraph);

    const imageNameInfo = $("<div>")
      .addClass("searchbarItemInfo")
      .appendTo(imageNameParagraph);

    $("<p>")
      .addClass("searchbarItemName")
      .text(imageFileName)
      .appendTo(imageNameInfo);

    $("<p>")
      .addClass("searchbarItemWidth")
      .text(
        "Width: " +
          Math.round(this.naturalWidth * imageReductionFactor) +
          " pixels"
      )
      .appendTo(imageNameInfo);

    $("<p>")
      .addClass("searchbarItemHeight")
      .text(
        "Height: " +
          Math.round(this.naturalHeight * imageReductionFactor) +
          " pixels"
      )
      .appendTo(imageNameInfo);

    $("<p>").addClass("searchbarItemSize").appendTo(imageNameInfo);

    $("<a>")
      .addClass("searchbarDownloadButton")
      .text("Download")
      .attr("download", "")
      .attr("href", originalImagePath + imageFileName + ".jpg")
      .appendTo(imageNameInfo);
  });
}

searchBarImages();
