window.addEventListener('DOMContentLoaded', function () {
  // Only show on the homepage, anchored to the slideshow
  const slideshow = document.querySelector('.imageslideshow');
  if (!slideshow || !slideshow.parentNode) return;

  function formatEventDate(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // Look at this month and next month's calendar for the next upcoming event
  async function findNextEvent() {
    const now = new Date();
    for (let i = 0; i < 2; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const path = `/data/calendar/${d.getFullYear()}/${d.getMonth() + 1}/events.json`;
      try {
        const resp = await fetch(path, { cache: 'no-store' });
        if (!resp.ok) continue;
        const events = await resp.json();
        const upcoming = events
          .filter(e => e.date && new Date(e.date + 'T23:59:59') >= now)
          .sort((a, b) => a.date.localeCompare(b.date));
        if (upcoming.length) return upcoming[0];
      } catch (e) { /* try next month */ }
    }
    return null;
  }

  function buildCard(status, nextEvent) {
    const section = document.createElement('div');
    section.className = 'container status-container';

    const card = document.createElement('div');
    card.className = 'status-card';

    const badge = document.createElement('div');
    badge.className = 'status-badge status-' + (status.status || 'offseason');

    const dot = document.createElement('span');
    dot.className = 'status-dot';

    const label = document.createElement('span');
    label.textContent = status.statusLabel || 'Status';

    badge.appendChild(dot);
    badge.appendChild(label);

    const heading = document.createElement('h3');
    heading.className = 'status-heading';
    heading.textContent = status.season ? status.season + ' Season' : 'Team Status';

    const message = document.createElement('p');
    message.className = 'status-message';
    message.textContent = status.message || '';

    card.appendChild(badge);
    card.appendChild(heading);
    card.appendChild(message);

    if (status.record) {
      const record = document.createElement('div');
      record.className = 'status-record';
      const r = status.record;
      record.textContent = 'Record: ' + r.wins + '-' + r.losses + (r.ties ? '-' + r.ties : '');
      card.appendChild(record);
    }

    if (status.rank) {
      const rank = document.createElement('div');
      rank.className = 'status-rank';
      rank.textContent = 'Rank: ' + status.rank;
      card.appendChild(rank);
    }

    if (nextEvent) {
      const next = document.createElement('div');
      next.className = 'status-next-event';
      next.textContent = 'Next up: ' + nextEvent.title + ' - ' + formatEventDate(nextEvent.date);
      card.appendChild(next);
    }

    if (status.tbaUrl) {
      const link = document.createElement('a');
      link.className = 'status-tba-link';
      link.href = status.tbaUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'View on The Blue Alliance';
      card.appendChild(link);
    }

    section.appendChild(card);
    return section;
  }

  Promise.all([
    fetch('/data/team-status.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).catch(() => null),
    findNextEvent()
  ]).then(function ([status, nextEvent]) {
    if (!status) return;
    const card = buildCard(status, nextEvent);
    slideshow.parentNode.insertBefore(card, slideshow.nextSibling);
  });
});
