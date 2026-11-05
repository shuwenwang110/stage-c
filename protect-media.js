(() => {
  document.addEventListener("contextmenu", event => {
    if (event.target.closest("img, video, canvas, .work-frame, .club-card, .drawing-thumb, .click-card")) {
      event.preventDefault();
    }
  });

  document.addEventListener("dragstart", event => {
    if (event.target.closest("img, video, canvas")) {
      event.preventDefault();
    }
  });

  document.addEventListener("selectstart", event => {
    if (event.target.closest("img, video, canvas")) {
      event.preventDefault();
    }
  });

  document.querySelectorAll("img").forEach(image => {
    image.setAttribute("draggable", "false");
  });
})();
