(() => {
  const config = window.GalleryPage;
  if (!config) return;

  const gallery = document.getElementById("galleryPage");
  if (gallery) {
    config.images.forEach((item, index) => {
      const src = typeof item === "string" ? item : item.src;
      const figure = document.createElement("figure");
      figure.className = `work-frame${item?.wide ? " gallery-wide" : ""}${item?.narrow ? " gallery-narrow" : ""}`;
      const number = String(index + 1).padStart(2, "0");
      figure.innerHTML = `
        <img src="${src}" alt="${config.title} work ${number}" loading="${index === 0 ? "eager" : "lazy"}" />
        <figcaption><span>${config.title}</span><span>Page ${number}</span></figcaption>
      `;
      gallery.appendChild(figure);
    });
  }

  document.querySelectorAll("[data-transition]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      document.body.classList.add("is-leaving");
      setTimeout(() => {
        window.location.href = link.href;
      }, 520);
    });
  });
})();
