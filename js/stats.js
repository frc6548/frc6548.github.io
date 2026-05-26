window.addEventListener('DOMContentLoaded', function () {
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
          
          if (numberEl) numberEl.textContent = stat.value;
          if (labelEl) labelEl.textContent = stat.label;
        }
      });
    })
    .catch(error => console.error('Error loading stats:', error));
});
