window.addEventListener('DOMContentLoaded', function () {
  // Animate a stat number counting up from 0 to its target value
  function animateCountUp(el, target, suffix, duration) {
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Load stats from JSON and populate the stats section
  fetch('/data/stats.json')
    .then(response => response.json())
    .then(data => {
      // Get all stat items
      const aboutUsDiv = document.querySelectorAll('div[tag="about-us"]')[0];
      if (aboutUsDiv) {
        aboutUsDiv.innerHTML = aboutUsDiv.innerHTML.replace('[Loading...]', data.teamMembers.value);
      }

      const statItems = document.querySelectorAll('[data-stat]');

      statItems.forEach(item => {
        const statKey = item.getAttribute('data-stat');
        const stat = data[statKey];

        if (stat) {
          const numberEl = item.querySelector('.stat-number');
          const labelEl = item.querySelector('.stat-label');

          if (numberEl) {
            const match = String(stat.value).match(/^(\d+)(.*)$/);
            if (match) {
              animateCountUp(numberEl, parseInt(match[1], 10), match[2], 1500);
            } else {
              numberEl.textContent = stat.value;
            }
          }
          if (labelEl) labelEl.textContent = stat.label;
        }
      });
    })
    .catch(error => console.error('Error loading stats:', error));
});
