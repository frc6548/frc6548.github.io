window.addEventListener('DOMContentLoaded', function () {
  var root = document.documentElement;

  // Shared rAF handle so we only flush CSS vars once per frame
  var rafPending = false;
  var mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(flushMouseVars);
    }
  });

  function flushMouseVars() {
    rafPending = false;

    // Spotlight: absolute viewport position
    root.style.setProperty('--mouse-x', mouseX + 'px');
    root.style.setProperty('--mouse-y', mouseY + 'px');

    // Positional drift + 3D rotation based on mouse offset from viewport center
    var cx = (window.innerWidth  || root.clientWidth)  / 2;
    var cy = (window.innerHeight || root.clientHeight) / 2;
    var px = ((mouseX - cx) / cx * 12).toFixed(2);
    var py = ((mouseY - cy) / cy *  8).toFixed(2);
    root.style.setProperty('--parallax-x', px + 'px');
    root.style.setProperty('--parallax-y', py + 'px');
    var rotY = ((mouseX - cx) / cx *  9).toFixed(2) + 'deg';
    var rotX = -((mouseY - cy) / cy * 5.5).toFixed(2) + 'deg';
    root.style.setProperty('--parallax-rot-y', rotY);
    root.style.setProperty('--parallax-rot-x', rotX);
  }

  // ── Scroll-reveal ────────────────────────────────────────────────────────────
  // status-card excluded: it is inserted dynamically after DOMContentLoaded.
  var SELECTORS = [
    '.stats-section',
    '.first-section',
    '.ftc-section',
    '.signup-section',
    '.p-anim',
  ];

  if (!window.IntersectionObserver) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  var vph = window.innerHeight || root.clientHeight;

  document.querySelectorAll(SELECTORS.join(',')).forEach(function (el) {
    var rect = el.getBoundingClientRect();
    // Elements already in the viewport on load animate normally - skip them
    if (rect.top < vph && rect.bottom > 0) return;
    el.classList.add('scroll-hidden');
    observer.observe(el);
  });
});
