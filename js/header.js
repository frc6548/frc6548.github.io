window.addEventListener('DOMContentLoaded', function () {
  var container = document.createElement('div');
  container.className = 'hd-container';

  var icon = document.createElement('img');
  icon.className = "siteicon";
  icon.src = "/data/icon.png";

  var thetitle = document.createElement('sitetitle');
  thetitle.textContent = 'Perry RAMBOTS';
  thetitle.style.marginLeft = "20px";
  thetitle.style.fontSize = "80px";
  thetitle.style.verticalAlign = "top";
  thetitle.style.fontWeight = "bold";

  container.appendChild(icon);
  container.appendChild(thetitle);

  var link = this.document.createElement("a");
  link.className = "titlelink";
  link.href = "/";
  link.textContent = "Home"
  container.appendChild(link);
  
  document.body.insertBefore(container, document.body.firstChild);

  var footer = document.createElement('footer');
  footer.className = 'footer';

  var leftSection = document.createElement('div');
  leftSection.className = 'footer-left';

  var contactTitle = document.createElement('h3');
  contactTitle.textContent = 'Contact Us';
  leftSection.appendChild(contactTitle);

  var emailPara = document.createElement('p');
  emailPara.innerHTML = '<a href="mailto:##@##.org">##@##.org</a>';
  leftSection.appendChild(emailPara);

  var phonePara = document.createElement('p');
  phonePara.textContent = '(517) ###-####';
  leftSection.appendChild(phonePara);

  var addressPara = document.createElement('p');
  addressPara.textContent = 'Perry, Michigan';
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
    { name: 'YouTube', icon: '/data/icons/youtube.png', url: 'https://youtube.com' },
    { name: 'Instagram', icon: '/data/icons/instagram.png', url: 'https://instagram.com' },
    { name: 'Facebook', icon: '/data/icons/facebook.png', url: 'https://facebook.com' }
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