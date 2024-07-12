$(document).ready(function () {
  const repoOwner = "emlncvsr";
  const repoName = "emlncvsr.github.io";
  const directoryPath = "scripts/list/"; // Path to the directory within the repository

  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${directoryPath}`;

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
    url: apiUrl,
    dataType: "json",
    success: function (data) {
      const fileList = $("#file-list");

      data.forEach(function (file) {
        // Skip directories
        if (file.type !== "file") {
          return;
        }

        const fileName = file.name;
        const fileUrl = file.download_url;

        $.ajax({
          url: fileUrl,
          dataType: "text",
          success: function (fileContent) {
            const fileItem = $("<div>", { class: "file-item" });
            const fileHeader = $("<div>", { class: "file-header" });
            const toggleIcon = $("<div>", { class: "toggle-icon" });
            const fileTitle = $("<div>").html(`<strong>${fileName}</strong>`);
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
