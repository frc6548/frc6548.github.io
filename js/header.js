window.addEventListener('DOMContentLoaded', function () {
  // Inject structured data (JSON-LD) for Organization, WebSite, and LocalBusiness
  function injectSchema(id, obj){
    if(document.getElementById(id)) return;
    try{
      var s = document.createElement('script');
      s.type = 'application/ld+json';
      s.id = id;
      s.textContent = JSON.stringify(obj);
      document.head.appendChild(s);
    }catch(e){ /* ignore */ }
  }

  injectSchema('ld-org', {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Perry RAMBOTS",
    "alternateName": "FRC Team 6548",
    "url": "https://phsrambots.org",
    "logo": "https://phsrambots.org/logo.webp",
    "description": "Perry RAMBOTS is FIRST Robotics Competition Team 6548, a high school robotics team building competitive robots, developing STEM skills, and competing since 2017.",
    "foundingDate": "2017",
    "sameAs": [
      "https://phsrambots.org",
      "https://phsrambots.org/links",
      "https://phsrambots.org/calendar",
      "https://phsrambots.org/gallery",
      "https://www.thebluealliance.com/team/6548",
      "https://www.youtube.com/@PHSRambots",
      "https://www.instagram.com/rambots_6548",
      "https://www.facebook.com/phsrambots",
      "https://github.com/frc6548",
      "https://www.tiktok.com/@phsrambots"
    ]
  });

  injectSchema('ld-website', {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Perry RAMBOTS",
    "url": "https://phsrambots.org"
  });

  injectSchema('ld-localbusiness', {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Perry RAMBOTS",
    "image": "https://phsrambots.org/data/icon-white.webp",
    "url": "https://phsrambots.org",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Perry High School",
      "addressLocality": "Perry",
      "addressRegion": "MI",
      "postalCode": "48872",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://phsrambots.org",
      "https://phsrambots.org/links",
      "https://phsrambots.org/calendar",
      "https://phsrambots.org/gallery",
      "https://www.thebluealliance.com/team/6548",
      "https://www.youtube.com/@PHSRambots",
      "https://www.instagram.com/rambots_6548",
      "https://www.facebook.com/phsrambots",
      "https://github.com/frc6548",
      "https://www.tiktok.com/@phsrambots"
    ]
  });

  var container = document.createElement('div');
  container.className = 'hd-container';

  var icon = document.createElement('img');
  icon.className = "siteicon";
  icon.src = "/data/icon.webp";
  icon.alt = "Perry RAMBOTS Logo";

  var iconLink = document.createElement('a');
  iconLink.href = "/";
  iconLink.className = "icon-link";
  iconLink.appendChild(icon);

  var thetitle = document.createElement('h1');
  thetitle.class = "sitetitle";
  thetitle.textContent = 'Perry RAMBOTS';
  thetitle.className = 'sitetitle';

  var titleLink = document.createElement('a');
  titleLink.href = "/";
  titleLink.className = "title-link";
  titleLink.appendChild(thetitle);

  container.appendChild(iconLink);
  container.appendChild(titleLink);

  // Create a hamburger menu with dropdown links
  var nav = document.createElement('nav');
  nav.className = 'site-nav';
  // Add FTC quick link (left of hamburger)

  /*
  var ftcLink = document.createElement('a');
  ftcLink.className = 'ftc-link';
  ftcLink.href = 'https://frc.phsrambots.org/';
  ftcLink.target = '_blank';
  ftcLink.rel = 'noopener noreferrer';
  ftcLink.setAttribute('aria-label', 'Visit FTC site');
  ftcLink.textContent = 'FTC';
  */

  var menuButton = document.createElement('button');
  menuButton.className = 'menu-button';
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  menuButton.innerHTML = '<span class="hamburger">☰</span>';

  var menu = document.createElement('ul');
  menu.className = 'menu-dropdown';
  menu.setAttribute('role', 'menu');

  // default menu items (will be overwritten by data/links.json when available)
  var items = [
    { text: 'Home', href: '/' },
    { text: 'Calendar', href: '/calendar' },
    { text: 'Gallery', href: '/gallery' },
    { text: 'Donations', href: '/donate' },
    { text: 'Links', href: '/links' },
    { text: 'Sponsor Form', href: '/data/sponsors/form.pdf' },
    { text: 'The Blue Alliance', href: 'https://www.thebluealliance.com/team/6548', target: '_blank' }
  ];

  items.forEach(function(it) {
    var li = document.createElement('li');
    li.className = 'menu-item';
    var a = document.createElement('a');
    a.textContent = it.text;
    a.href = it.href;
    a.setAttribute('role', 'menuitem');
    if (it.target) a.target = it.target;
    if (it.target === '_blank') a.rel = 'noopener noreferrer';
    a.className = 'menu-link';
    li.appendChild(a);
    menu.appendChild(li);
  });

  // append FTC link first so it appears left of the hamburger
  //nav.appendChild(ftcLink);
  nav.appendChild(menuButton);
  nav.appendChild(menu);
  container.appendChild(nav);

  // Insert header container at top of body
  document.body.insertBefore(container, document.body.firstChild);

  // Toggle menu open/close
  menuButton.addEventListener('click', function(e) {
    var opened = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!opened));
    menu.classList.toggle('open');

    // If menu opened, position it under the button using fixed coords to avoid layout issues
    if (menu.classList.contains('open')) {
      // ensure menu is visible so offsetWidth/height are available
      // force reflow
      // eslint-disable-next-line no-unused-expressions
      menu.offsetWidth;
      try {
        var rect = menuButton.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = (rect.bottom + 6) + 'px';
        // align right edge of menu with right edge of button when possible
        var menuW = menu.offsetWidth || 200;
        var left = rect.right - menuW;
        if (left < 8) left = 8; // don't go off left edge
        menu.style.left = left + 'px';
        menu.style.right = 'auto';
        menu.style.maxWidth = 'calc(100vw - 16px)';
      } catch (e) { /* ignore positioning errors */ }
    } else {
      // clear inline positioning when closed
      menu.style.position = '';
      menu.style.top = '';
      menu.style.left = '';
      menu.style.right = '';
      menu.style.maxWidth = '';
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!nav.contains(e.target)) {
      menu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      // clear inline positioning when closed via outside click
      menu.style.position = '';
      menu.style.top = '';
      menu.style.left = '';
      menu.style.right = '';
      menu.style.maxWidth = '';
    }
  });

  // Reposition menu on resize if it's open
  window.addEventListener('resize', function(){
    if (menu.classList.contains('open')) {
      try {
        var rect2 = menuButton.getBoundingClientRect();
        var menuW2 = menu.offsetWidth || 200;
        var left2 = rect2.right - menuW2;
        if (left2 < 8) left2 = 8;
        menu.style.top = (rect2.bottom + 6) + 'px';
        menu.style.left = left2 + 'px';
      } catch (e) {}
    }
  });

  var footer = document.createElement('footer');
  footer.className = 'footer';

  var leftSection = document.createElement('div');
  leftSection.className = 'footer-left';

  var contactTitle = document.createElement('h3');
  contactTitle.textContent = 'Contact Us';
  leftSection.appendChild(contactTitle);

  // placeholders; will be replaced if data/links.json is available
  var emailPara = document.createElement('p');
  var emailLink = document.createElement('a');
  emailLink.className = 'email-link';
  emailLink.textContent = 'Loading...';
  emailLink.href = 'https://phsrambots.org';
  emailPara.appendChild(emailLink);
  leftSection.appendChild(emailPara);

  var phonePara = document.createElement('p');
  phonePara.className = 'phone-number';
  phonePara.textContent = 'Loading...';
  leftSection.appendChild(phonePara);

  var addressPara = document.createElement('p');
  addressPara.textContent = 'Perry, Michigan 48872';
  leftSection.appendChild(addressPara);

  // Add Perry High School location with a maps link
  var schoolPara = document.createElement('p');
  var schoolLink = document.createElement('a');
  schoolLink.href = 'https://perry.k12.mi.us/';
  schoolLink.target = '_blank';
  schoolLink.rel = 'noopener noreferrer';
  schoolLink.textContent = 'Perry High School';
  schoolPara.appendChild(schoolLink);
  leftSection.appendChild(schoolPara);

  // Privacy policy link (loads text from data/privacypolicy.txt)
  var privacyPara = document.createElement('p');
  privacyPara.className = 'privacy-link';
  var privacyLink = document.createElement('a');
  privacyLink.href = '#';
  privacyLink.className = 'privacy-link-anchor';
  privacyLink.textContent = 'Privacy Policy';
  privacyLink.addEventListener('click', function(e){
    e.preventDefault();
    fetch('/data/privacypolicy.txt').then(function(r){ return r.text(); }).then(function(txt){
      showPrivacyModal(txt);
    }).catch(function(){ showPrivacyModal('Could not load privacy policy.'); });
  });
  privacyPara.appendChild(privacyLink);
  leftSection.appendChild(privacyPara);

  footer.appendChild(leftSection);

  var rightSection = document.createElement('div');
  rightSection.className = 'footer-right';

  var socialTitle = document.createElement('h3');
  socialTitle.textContent = 'Follow Us';
  rightSection.appendChild(socialTitle);

  var socialLinks = document.createElement('div');
  socialLinks.className = 'social-icons';

  var socials = [
    { name: 'YouTube', icon: '/data/icons/youtube.webp', url: 'https://www.youtube.com/@PHSRambots' },
    { name: 'TikTok', icon: '/data/icons/tiktok.webp', url: 'https://www.tiktok.com/@phsrambots' },
    { name: 'Instagram', icon: '/data/icons/instagram.webp', url: 'https://www.instagram.com/rambots_6548' },
    { name: 'Facebook', icon: '/data/icons/facebook.webp', url: 'https://www.facebook.com/phsrambots' },
    { name: 'GitHub', icon: '/data/icons/github.webp', url: 'https://github.com/frc6548' }
  ];

  socials.forEach(function(social) {
    var link = document.createElement('a');
    link.href = social.url;
    link.className = 'social-icon';
    link.title = social.name;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    var img = document.createElement('img');
    img.src = social.icon;
    img.alt = social.name;
    img.className = 'social-icon-img';
    
    link.appendChild(img);
    socialLinks.appendChild(link);
  });

  rightSection.appendChild(socialLinks);
  // 501(c)(3) disclaimer under follow us
  var disclaimer = document.createElement('div');
  disclaimer.className = 'disclaimer';
  disclaimer.textContent = 'Perry RAMBOTS is a registered 501(c)(3) nonprofit organization.';
  rightSection.appendChild(disclaimer);
  footer.appendChild(rightSection);

  // Privacy modal elements
  function showPrivacyModal(text){
    var existing = document.querySelector('.privacy-modal');
    if(existing) existing.remove();
    var modal = document.createElement('div'); modal.className = 'privacy-modal';
    var content = document.createElement('div'); content.className = 'privacy-modal-content';
    var h = document.createElement('h2'); h.textContent = 'Privacy Policy'; content.appendChild(h);
    var pre = document.createElement('pre'); pre.style.whiteSpace = 'pre-wrap'; pre.textContent = text; content.appendChild(pre);
    var close = document.createElement('button');
    close.type = 'button';
    close.textContent = 'Close';
    close.className = 'privacy-close';
    close.addEventListener('click', function(){ modal.remove(); });
    content.appendChild(close);
    modal.appendChild(content);
    document.body.appendChild(modal);
    // allow CSS to show
    requestAnimationFrame(function(){ modal.classList.add('open'); });
  }

  document.body.appendChild(footer);
  // attempt to load contact/menu data from data/links.json (base64 encoded email/phone)
  fetch('/data/links.json', {cache: 'no-store'}).then(function(r){
    if (!r.ok) throw new Error('no-links');
    return r.json();
  }).then(function(ld){
    try {
      if (ld.menu && Array.isArray(ld.menu) && ld.menu.length) {
        // rebuild menu items
        menu.innerHTML = '';
        ld.menu.forEach(function(it){
          var li = document.createElement('li'); li.className = 'menu-item';
          var a = document.createElement('a'); a.className = 'menu-link';
          a.textContent = it.text || it.label || '';
          a.href = it.href || '#';
          if (it.target) { a.target = it.target; if (it.target === '_blank') a.rel = 'noopener noreferrer'; }
          a.setAttribute('role','menuitem');
          li.appendChild(a); menu.appendChild(li);
        });
      }
      if (ld.email) {
        // email expected base64 encoded
        var decodedEmail = atob(ld.email);
        emailLink.textContent = decodedEmail;
        emailLink.href = 'mailto:' + decodedEmail;
      }
      if (ld.phone) {
        var decodedPhone = atob(ld.phone);
        phonePara.textContent = decodedPhone;
      }
          if (ld.location) {
            try {
              var decodedLoc = atob(ld.location);
              addressPara.textContent = decodedLoc;
            } catch (e) { /* ignore */ }
          }
          if (ld.socials && Array.isArray(ld.socials)) {
            // rebuild social icons
            socialLinks.innerHTML = '';
            ld.socials.forEach(function(social){
              if (!social || !social.url) return;
              var link = document.createElement('a');
              link.href = social.url;
              link.className = 'social-icon';
              link.title = social.name || '';
              link.target = '_blank';
              link.rel = 'noopener noreferrer';
              var img = document.createElement('img');
              img.src = social.icon || '';
              img.alt = social.name || '';
              img.className = 'social-icon-img';
              link.appendChild(img);
              socialLinks.appendChild(link);
            });
          }
    } catch (e) {
      // ignore parse errors and keep defaults
    }
  }).catch(function(){/* ignore */});
});

(function(){
  function getCookie(name){
      var match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
      return match ? match.pop() : '';
  }
  if(getCookie('OptOutTrack') === '1') return;

  (function loadGA(){
      var GA_ID = 'G-VEHL6P6FWZ';
      var s = document.createElement('script'); s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);} window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', GA_ID);
  })();
})();
