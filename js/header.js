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
    "logo": "https://phsrambots.org/logo.png",
    "description": "Perry RAMBOTS is FIRST Robotics Competition Team 6548, a high school robotics team building competitive robots, developing STEM skills, and competing since 2017.",
    "foundingDate": "2017",
    "sameAs": ["https://www.thebluealliance.com/team/6548"]
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
    "image": "https://phsrambots.org/data/icon-white.png",
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
      "https://www.thebluealliance.com/team/6548",
      "https://www.youtube.com/@PHSRambots",
      "https://www.facebook.com/phsrambots"
    ]
  });

  var container = document.createElement('div');
  container.className = 'hd-container';

  var icon = document.createElement('img');
  icon.className = "siteicon";
  icon.src = "/data/icon.png";
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

  var menuButton = document.createElement('button');
  menuButton.className = 'menu-button';
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  menuButton.innerHTML = '<span class="hamburger">☰</span>';

  var menu = document.createElement('ul');
  menu.className = 'menu-dropdown';
  menu.setAttribute('role', 'menu');

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
    a.className = 'menu-link';
    li.appendChild(a);
    menu.appendChild(li);
  });

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
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!nav.contains(e.target)) {
      menu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });

  var footer = document.createElement('footer');
  footer.className = 'footer';

  var leftSection = document.createElement('div');
  leftSection.className = 'footer-left';

  var contactTitle = document.createElement('h3');
  contactTitle.textContent = 'Contact Us';
  leftSection.appendChild(contactTitle);

  var emailPara = document.createElement('p');
  emailPara.innerHTML = '<a href="mailto:admin@phsrambots.org">admin@phsrambots.org</a>';
  leftSection.appendChild(emailPara);

  var phonePara = document.createElement('p');
  phonePara.textContent = 'P.O Box 78';
  leftSection.appendChild(phonePara);

  var addressPara = document.createElement('p');
  addressPara.textContent = 'Perry, Michigan 48872';
  leftSection.appendChild(addressPara);

  // Add Perry High School location with a maps link
  var schoolPara = document.createElement('p');
  var schoolLink = document.createElement('a');
  schoolLink.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Perry High School, Perry, MI');
  schoolLink.target = '_blank';
  schoolLink.rel = 'noopener';
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
    { name: 'YouTube', icon: '/data/icons/youtube.png', url: 'https://www.youtube.com/@PHSRambots' },
    { name: 'TikTok', icon: '/data/icons/tiktok.png', url: 'https://www.tiktok.com/@phsrambots' },
    { name: 'Instagram', icon: '/data/icons/instagram.png', url: 'https://www.instagram.com/rambots_6548' },
    { name: 'Facebook', icon: '/data/icons/facebook.png', url: 'https://www.facebook.com/phsrambots' },
    { name: 'GitHub', icon: '/data/icons/github.png', url: 'https://github.com/frc6548' }
  ];

  socials.forEach(function(social) {
    var link = document.createElement('a');
    link.href = social.url;
    link.className = 'social-icon';
    link.title = social.name;
    link.target = '_blank';
    
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