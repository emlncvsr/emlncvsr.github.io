window.transitionToPage = function (href) {
  // const currentDomain = window.location.hostname;
  // const targetDomain = href && href.hostname;
  // console.log(currentDomain, targetDomain);

  // if (targetDomain && currentDomain !== targetDomain) {
  if (href.includes("https://")) {
    window.open(href, "_blank");
    return;
  }

  if (href !== "") {
    document.body.style.opacity = 0;
    setTimeout(function () {
      window.location.href = href;
    }, 500);
  }
};

$("[data-url]").click(function (e) {
  // if (!$(e.target).is("ion-icon[name='copy-outline']")) {
  transitionToPage(this.getAttribute("data-url"));
  // }
});

// if ("serviceWorker" in navigator) {
//   $(window).on("load", function () {
//     navigator.serviceWorker.register("/assets/js/service-worker.js");
//   });
// }

$(window).on("load", function () {
  $("header a:first").html(
    '<img src="/assets/img/favicon.png" alt="Logo">' + "ホーム"
  );

  $("img:not([alt])").each(function () {
    var src = $(this).attr("src");
    if (src) {
      $(this).attr(
        "alt",
        src.replace("/shashin/assets/img/min/", "").replace(".jpg", "")
      );
    }
  });
  // $("a:not([href])").each(function () {
  //   $(this).attr("href", "");
  // });
});

$(document).ready(function () {
  var lines = [
    "<!--                   ++++++++++++++++++++++++++++++++                 -->",
    "<!--        ++++++++++++++++++++++++++++++++++++++++++++++++++++++      -->",
    "<!--   +++++++++++                                +++++  +++++++++++++  -->",
    "<!-- +++++++                                       ++++          ++++++-->",
    "<!--++++++                                        +++            +++++-->",
    "<!--  +++++                                      +++             ++++ -->",
    "<!--            ++++++++++++++                 ++++             ++++  -->",
    "<!--       +++++++++++++++++++++++            +++              ++++   -->",
    "<!--      +++++          ++++++++++++        +++             +++++    -->",
    "<!--      ++++               ++++++++++++  +++              +++++     -->",
    "<!--       ++++                 +++++++++++++             +++++       -->",
    "<!--         +++                   +++++++++++++      ++++++++        -->",
    "<!--          ++++                    ++++++++++++++++++++++          -->",
    "<!--            +++                +++++  +++++++++++++++             -->",
    "<!--             ++++            +++++         +++++                  -->",
    "<!--               +++        +++++                                 -->",
    "<!--                 ++++++++++++               +++++                -->",
    "<!--                   +++++                  ++++++                -->",
    "<!--                     ++++              +++++++                  -->",
    "<!--                       +++++         ++++++                     -->",
    "<!--                          +++++++++++++++                       -->",
    "<!--                              +++++++                          -->",
  ];

  var htmlString = lines.join("\n");

  var tempElement = $("<div>").html(htmlString);

  $("body").append(tempElement.contents());

  tempElement.remove();
});
