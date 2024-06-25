$(document).ready(function () {
  const searchBarButton = $("#search-button");
  const searchBarOverlay = $("#searchbar-overlay");
  const searchBar = $("#searchbar");

  searchBarButton.click(function (e) {
    searchBarOverlay.css("opacity", "100").css("z-index", "2");
    searchBar.focus();
  });

  searchBarOverlay.click(function (e) {
    if (e.target === this) {
      searchBarOverlay.css("opacity", "0").css("z-index", "-1");
      searchBar.val(""); // clear the search bar value
    }
  });

  searchBar.on("input", () => {
    let searchbarContent = searchBar.val().toLowerCase(); // get the search bar value and convert to lowercase
    let animeListContentX = $(".searchbarItemName");

    for (let i = 0; i < animeListContentX.length; i++) {
      let animeItem = animeListContentX[i];
      let containsSearchTerm = animeItem.innerText.toLowerCase().includes(searchbarContent);

      // Hide or show the animeItem based on whether it contains the search term
      if (!containsSearchTerm) {
        animeItem.parentElement.parentElement.style.opacity = "0";
        animeItem.parentElement.parentElement.style.zIndex = "-1";
        setTimeout(() => {
          animeItem.parentElement.parentElement.style.display = "none";
        }, 0);
      } else {
        animeItem.parentElement.parentElement.style.opacity = "100";
        animeItem.parentElement.parentElement.style.zIndex = "1";
        animeItem.parentElement.parentElement.style.display = "flex";
      }
    }
  });
});
