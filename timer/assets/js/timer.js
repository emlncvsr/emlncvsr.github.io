$(document).ready(function () {
  document.title = "タイマー";
  let counter = $(".counter");
  let overlay = $("#overlay");
  let countDownDate = 0;

  function updateCountdown() {
    if (countDownDate) {
      let now = new Date().getTime();
      let distance = countDownDate - now;
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      counter.text(
        days + "d " + hours + "h " + minutes + "m " + seconds + "s "
      );
    } else {
      counter.text("0d 0h 0m 0s");
    }
  }

  function initializeCountdown() {
    setInterval(updateCountdown, 1000);
  }

  if (localStorage.getItem("countDownDate")) {
    countDownDate = parseInt(localStorage.getItem("countDownDate"));
    if (countDownDate > 0) {
      $("#datePicker").val(new Date(countDownDate).toISOString().split("T")[0]);
    }
  }

  if (localStorage.getItem("title")) {
    $(".counterTitle").text(localStorage.getItem("title"));
    $("#titleSet").val(localStorage.getItem("title"));
  }

  $("#datePicker").change(function () {
    countDownDate = new Date($(this).val() + "T00:00:00").getTime();
    counter.css("display", "block");
    localStorage.setItem("countDownDate", countDownDate);
    updateCountdown();
  });

  $("#titleSet").on("input", function () {
    $(".counterTitle").text($("#titleSet").val());
    localStorage.setItem("title", $("#titleSet").val());
  });

  counter.on("click", function () {
    toggleFullScreen();
  });

  $(document).on("keydown", function (e) {
    if (e.key === "f") {
      toggleFullScreen();
    }
  });

  function toggleFullScreen() {
    let isFullscreen = document.fullscreenElement;
    overlay.toggleClass("overlay-display");
    counter.toggleClass("counter-fullscreen");
    $(".counterTitle").toggleClass("counterTitleFullscreen");

    if (isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else {
      let elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    }
  }
  initializeCountdown();
  updateCountdown();
});
