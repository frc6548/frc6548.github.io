window.addEventListener('DOMContentLoaded', function () {
  // Duplicate sponsor images for seamless carousel loop
  function duplicateSponsorImages() {
    var sponsorImages = document.querySelector('.sponsorimages');
    if (sponsorImages) {
      var images = sponsorImages.querySelectorAll('.sponsorimg');
      images.forEach(function(img) {
        var clone = img.cloneNode(true);
        sponsorImages.appendChild(clone);
      });
    }
  }
  
  // Calculate sponsor carousel scroll distance
  function setupSponsorScroll() {
    var sponsorImages = document.querySelector('.sponsorimages');
    if (sponsorImages) {
      function calculateScrollDistance() {
        var totalWidth = sponsorImages.scrollWidth;
        var scrollDistance = (totalWidth / 2);
        document.documentElement.style.setProperty('--scroll-distance', scrollDistance + 'px');
      }
      
      // Use ResizeObserver to handle dynamic sizing
      var observer = new ResizeObserver(calculateScrollDistance);
      observer.observe(sponsorImages);
      
      // Initial calculation
      calculateScrollDistance();
    }
  }
  
  // Duplicate images first, then setup scroll
  duplicateSponsorImages();
  setupSponsorScroll();
  setTimeout(setupSponsorScroll, 100);
  setTimeout(setupSponsorScroll, 500);
});
