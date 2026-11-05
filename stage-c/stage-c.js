(() => {
  const cards = Array.from(document.querySelectorAll('[data-preview]'));
  const modal = document.querySelector('.stage-c-lightbox');
  const image = modal.querySelector('.lightbox-image');
  const caption = document.getElementById('viewerCaption');
  const count = document.getElementById('viewerCount');
  const main = document.getElementById('stageContent');
  const closeButton = modal.querySelector('.stage-c-viewer-close');
  const controls = Array.from(modal.querySelectorAll('button'));
  let active = 0;
  let returnFocus = null;

  function show(index) {
    active = (index + cards.length) % cards.length;
    const card = cards[active];
    image.src = card.href;
    image.alt = card.querySelector('img').alt;
    caption.textContent = card.dataset.title;
    count.textContent = `${String(active + 1).padStart(2, '0')} / ${cards.length}`;
  }
  function open(index, trigger) {
    returnFocus = trigger;
    show(index);
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    closeButton.focus();
    main.inert = true;
  }
  function close() {
    main.inert = false;
    document.body.classList.remove('lightbox-open');
    if (returnFocus) returnFocus.focus({preventScroll: true});
    modal.setAttribute('aria-hidden', 'true');
    image.removeAttribute('src');
  }
  cards.forEach((card, index) => card.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    open(index, card);
  }));
  closeButton.addEventListener('click', close);
  modal.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => show(active + Number(button.dataset.step))));
  modal.addEventListener('click', event => {
    if (event.target === modal || event.target.classList.contains('stage-c-viewer-image')) close();
  });
  document.addEventListener('keydown', event => {
    if (modal.getAttribute('aria-hidden') === 'true') return;
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(active - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(active + 1); }
    if (event.key === 'Tab') {
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  document.querySelectorAll('[data-transition]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    document.body.classList.add('is-leaving');
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 520;
    setTimeout(() => { window.location.href = link.href; }, delay);
  }));
  window.addEventListener('pageshow', () => document.body.classList.remove('is-leaving'));
})();
