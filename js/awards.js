// Awards & Achievements arch - fetches data/awards.json, renders a curved
// row of cards (centerpieces anchored in the middle, larger), reveals
// details on hover/focus, and opens a modal with the source link on click.
(function () {
  var TROPHY_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M8 21h8"/><path d="M12 17v4"/>' +
    '<path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"/>' +
    '<path d="M7 5H4a1 1 0 0 0-1 1v1a4 4 0 0 0 4 4"/>' +
    '<path d="M17 5h3a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4"/>' +
    '</svg>';

  function el(id) { return document.getElementById(id); }

  function buildCard(award, offset) {
    var isCenter = award.tier === 'center';
    var btn = document.createElement('button');
    btn.className = 'award-card' + (isCenter ? ' award-card--center' : '');
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-label', award.title + ', ' + award.event + ' - view details');
    btn.style.setProperty('--arch-rotate', (offset * 6) + 'deg');
    btn.style.setProperty('--arch-y', (Math.pow(offset, 2) * 5) + 'px');

    var face = document.createElement('div');
    face.className = 'award-card-face';

    var icon = document.createElement('div');
    icon.className = 'award-icon';
    icon.innerHTML = TROPHY_SVG;

    var title = document.createElement('p');
    title.className = 'award-card-title';
    title.textContent = award.title;

    var year = document.createElement('span');
    year.className = 'award-card-year';
    year.textContent = award.event;

    face.appendChild(icon);
    face.appendChild(title);
    face.appendChild(year);

    var details = document.createElement('div');
    details.className = 'award-card-details';
    var detailsText = document.createElement('p');
    detailsText.textContent = award.details;
    var hint = document.createElement('span');
    hint.className = 'award-card-hint';
    hint.textContent = 'Tap for source';
    details.appendChild(detailsText);
    details.appendChild(hint);

    btn.appendChild(face);
    btn.appendChild(details);

    btn.addEventListener('click', function () { openModal(award); });

    return btn;
  }

  function openModal(award) {
    var modal = el('award-modal');
    if (!modal) return;

    el('award-modal-title').textContent = award.title;

    var sponsorEl = el('award-modal-sponsor');
    if (award.sponsor) {
      sponsorEl.textContent = award.sponsor;
      sponsorEl.style.display = '';
    } else {
      sponsorEl.style.display = 'none';
    }

    el('award-modal-event').textContent = award.event;
    el('award-modal-details').textContent = award.details;

    var link = el('award-modal-link');
    link.href = award.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    el('award-modal-close').focus();
  }

  function closeModal() {
    var modal = el('award-modal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function render(data) {
    var arch = el('awards-arch');
    if (!arch) return;
    var awards = data.awards || [];
    var mid = (awards.length - 1) / 2;
    awards.forEach(function (award, i) {
      arch.appendChild(buildCard(award, i - mid));
    });
  }

  function setupModal() {
    el('award-modal-close').addEventListener('click', closeModal);
    el('award-modal').addEventListener('click', function (e) {
      if (e.target === e.currentTarget) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  function init() {
    setupModal();
    fetch('/data/awards.json', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(render)
      .catch(function (err) { console.error('Failed to load awards.json', err); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
