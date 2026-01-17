window.addEventListener('DOMContentLoaded', function () {
  // Calculate sponsor carousel scroll distance
  function setupSponsorScroll() {
    var sponsorImages = document.querySelector('.sponsorimages');
    if (sponsorImages) {
      function calculateScrollDistance() {
        var totalWidth = sponsorImages.scrollWidth;
        var scrollDistance = (totalWidth / 2) + 170;
        document.documentElement.style.setProperty('--scroll-distance', scrollDistance + 'px');
      }
      
      // Use ResizeObserver to handle dynamic sizing
      var observer = new ResizeObserver(calculateScrollDistance);
      observer.observe(sponsorImages);
      
      // Initial calculation
      calculateScrollDistance();
    }
  }
  
  // Run setup immediately and also after a delay to ensure DOM is ready
  setupSponsorScroll();
  setTimeout(setupSponsorScroll, 100);
  setTimeout(setupSponsorScroll, 500);
});
