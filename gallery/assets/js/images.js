document.addEventListener('DOMContentLoaded', function () {
    const galleryId = localStorage.getItem('galleryId');
    if (galleryId) {
        openGallery(galleryId);
        localStorage.removeItem('galleryId');
    }
});

function openGallery(galleryId) {
    loadGalleryScript(galleryId).then(() => {
        return randomizeAndPlaceImages();
    }).catch(error => {
        console.error(error);
    });
    $("#selector").fadeOut(500);
}

var htmlFilePath = "";
let [imagePath, originalImagePath] = ["assets/img/" + htmlFilePath + "/min", "assets/img/" + htmlFilePath + "/original"];
const imageReductionFactor = 3.03;

const imageDictionary = JSON.parse(localStorage.getItem("imageDictionary")) || {};

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

let currentImageIndex = 0;
let windowWidth = $(window).width();

function processImage(imageLink) {
    const fileName = decodeURIComponent($(imageLink).attr("href")).replace(imagePath + "/", "");
    const modifiedDate = new Date($(imageLink)[0].lastModified);
    const currentDate = new Date();
    const imageKey = fileName.startsWith('/gallery/') ? fileName.replace('/gallery/', '') : fileName;
}

function showImage(index) {
    const $clickedImage = gallery.find('.masonry-item[data-index="' + index + '"]');

    if (!$clickedImage || !$clickedImage.attr("src")) {
        console.error("Invalid image or source for index:", index);
        return;
    }

    const fileName = $clickedImage
        .attr("src")
        .replace(imagePath + "/", "")
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
        downloadButton.attr("href", originalImagePath + "/" + fileName + ".jpg");
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

function randomizeAndPlaceImages() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: imagePath + "/",
            success: function (data) {
                const imageLinks = $(data).find("a[href$='.jpg'], a[href$='.jpeg'], a[href$='.png'], a[href$='.webp']");
                const previousImageDictionary = JSON.parse(localStorage.getItem("imageDictionary")) || {};

                imageLinks.sort(() => 0.5 - Math.random());

                const totalImages = imageLinks.length;

                for (const imageLink of imageLinks) {
                    processImage(imageLink);
                }

                localStorage.setItem("imageDictionary", JSON.stringify(imageDictionary));

                gallery.empty();

                for (let j = 0; j < totalImages; j++) {
                    let fileName = decodeURIComponent($(imageLinks[j]).attr("href")).replace(imagePath + "/", "");
                    fileName = fileName.startsWith('/gallery/') ? fileName.replace('/gallery/', '') : fileName;

                    const imageElement = $("<img>").attr({
                        src: imagePath + "/" + fileName.replace("//", "/"),
                        class: "masonry-item",
                        draggable: "false",
                        id: fileName.replace(".webp", ""),
                        alt: fileName.replace(".webp", ""),
                        "data-index": j,
                        rel: "preload",
                        fetchpriority: "high",
                    });

                    gallery.append(imageElement);
                }

                $('.masonry').imagesLoaded(function () {
                    $('.masonry').masonry({
                        itemSelector: '.masonry-item',
                        percentPosition: true,
                        columnWidth: '.masonry-sizer'
                    });

                    $('.masonry').masonry('layout');

                    const lastImageSrc = gallery.find('.masonry-item').last().attr("src");
                    if (lastImageSrc) {
                        $("#profile-picture").css("background-image", `url(${lastImageSrc})`);
                    } else {
                        console.error("No images found in the gallery to set as profile picture.");
                    }
                    resolve();
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reject(new Error("Erreur AJAX : " + textStatus + " " + errorThrown));
            },
        });
    }).catch((error) => {
        console.error(error);
    });
}

function searchBarImages() {
    const searchResults = $("#image-names");
    searchResults.empty();

    $(".masonry-item").each(function () {
        const imageSrc = $(this).attr("src");
        let imageFileName = imageSrc.replace(imagePath + "/", "").replace(".webp", "");
        imageFileName = imageFileName.startsWith('/gallery/') ? imageFileName.replace('/gallery/', '') : imageFileName;

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
            .attr("href", originalImagePath + "/" + imageFileName + ".jpg")
            .appendTo(imageNameInfo);
    });
}

searchBarImages();

function loadGalleryScript(scriptId) {
    return new Promise((resolve, reject) => {
        $.getScript(`assets/js/${scriptId}.js`, function () {
            htmlFilePath = scriptId;
            [imagePath, originalImagePath] = ["assets/img/" + htmlFilePath + "/min", "assets/img/" + htmlFilePath + "/original"];
            resolve();
        }).fail(function (jqxhr, settings, exception) {
            reject(new Error("Script load failed: " + exception));
        });
    });
}

overlay.click(function (e) {
    if ($(e.target).is("img, p, #prev-button, #next-button, .download-button")) {
        return;
    }
    overlay.removeClass("visible");
});

gallery.on("click", ".masonry-item", function () {
    showImage(parseInt($(this).attr("data-index")));
    imageTitle.text($(this).attr("id").replace(".webp", ""));
});

prevButton.click(function () {
    if (currentImageIndex - 1 < 0) {
        currentImageIndex = gallery.find(".masonry-item").length - 1;
    } else {
        currentImageIndex = currentImageIndex - 1;
    }
    showImage(currentImageIndex);
});

nextButton.click(function () {
    if (currentImageIndex + 1 > gallery.find(".masonry-item").length) {
        currentImageIndex = 0;
    } else {
        currentImageIndex = currentImageIndex + 1;
    }
    showImage(currentImageIndex);
});

$("#randomizeButton").on("click", function () {
    randomizeAndPlaceImages();
});

$("#gallery-list div").on("click", function () {
    $("#selector").fadeOut(300);
    $("body").removeClass("locked-body");
    const scriptId = this.getAttribute("id");
    loadGalleryScript(scriptId).then(() => {
        randomizeAndPlaceImages();
    }).catch(error => {
        console.error(error);
    });
});

$("#viewButton").on("click", function () {
    $("#imageNotification").fadeOut();

    $(".masonry-item").each(function () {
        const index = parseInt($(this).attr("data-index"));
        if (imageDictionary.hasOwnProperty(index)) {
            imageDictionary[index].isNew = false;
        }
    });

    localStorage.setItem("imageDictionary", JSON.stringify(imageDictionary));
});
