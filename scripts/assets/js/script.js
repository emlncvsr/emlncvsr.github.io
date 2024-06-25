$(document).ready(function () {
  const htmlFilePath =
    new URL(window.location.href).pathname.split("/").slice(0, -1).join("/") +
    "/";
  const scriptPath = htmlFilePath + "list/";

  // Function to escape HTML characters
  function escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, function (m) {
      return map[m];
    });
  }

  $.ajax({
    url: scriptPath,
    success: function (data) {
      const fileList = $("#file-list");
      const fileLinks = $(data).find("a[href]");

      fileLinks.each(function () {
        const fileName = $(this).attr("href").replace(scriptPath, "");

        // Skip directories by checking if the link does not contain a period (.)
        if (!fileName.includes(".")) {
          return;
        }

        const decodedFileName = decodeURIComponent(fileName);

        $.ajax({
          url: scriptPath + fileName,
          dataType: "text",
          success: function (fileContent) {
            const fileItem = $("<div>", { class: "file-item" });
            const fileHeader = $("<div>", { class: "file-header" });
            const toggleIcon = $("<div>", { class: "toggle-icon" });
            const fileTitle = $("<div>").html(
              `<strong>${decodedFileName}</strong>`
            );
            fileHeader.append(toggleIcon).append(fileTitle);
            fileItem.append(fileHeader);
            const fileContentDiv = $("<div>", { class: "file-content" });
            const pre = $("<pre>", { class: "code-block" });

            // Escape HTML content
            const escapedContent = escapeHtml(fileContent);

            pre.text(escapedContent); // Use text to prevent HTML interpretation
            fileContentDiv.append(pre);
            fileItem.append(fileContentDiv);
            fileHeader.click(function () {
              if (!fileItem.hasClass("active")) {
                fileItem.addClass("active");
                fileContentDiv.show();
                hljs.highlightElement(pre[0]);
              } else {
                fileItem.removeClass("active");
                fileContentDiv.hide();
              }
            });
            fileList.append(fileItem);
          },
          error: function () {
            console.error("Failed to load file content: " + fileName);
          },
        });
      });
    },
    error: function () {
      console.error("Failed to load file list");
    },
  });

  // Configure Highlight.js to ignore unescaped HTML (if necessary)
  hljs.configure({ ignoreUnescapedHTML: true });
});
