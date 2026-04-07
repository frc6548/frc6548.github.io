window.addEventListener('DOMContentLoaded', function () {
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

  var thetitle = document.createElement('sitetitle');
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
    img.style.width = '24px';
    img.style.height = '24px';
    
    link.appendChild(img);
    socialLinks.appendChild(link);
  });

  rightSection.appendChild(socialLinks);
  footer.appendChild(rightSection);

  document.body.appendChild(footer);
});
