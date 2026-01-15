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
  link.href = "https://www.google.com/link";
  link.textContent = "Sponsors"
  container.appendChild(link);
  
  document.body.insertBefore(container, document.body.firstChild);
});