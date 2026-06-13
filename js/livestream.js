// livestream.js - reads /data/livestream.json and inserts a LIVE embed above slideshow
(function(){
  async function init(){
    let cfg = null;
    try{
      const r = await fetch('/data/livestream.json', {cache: 'no-store'});
      if(!r.ok) return;
      cfg = await r.json();
    }catch(e){ return; }

    console.log('livestream: config loaded', cfg);

    if(!cfg || !cfg.streaming) return;

    // build container
    const container = document.createElement('div');
    container.className = 'livestream-container';

    const bar = document.createElement('div');
    bar.className = 'livestream-bar';
    const liveDot = document.createElement('span'); liveDot.className = 'live-dot';
    const liveText = document.createElement('span'); liveText.className = 'live-text';
    const streamName = cfg.title || cfg.video || cfg.videoId || cfg.video_id || cfg.channel || 'LIVE';
    liveText.textContent = `Live from ${streamName}`;
    bar.appendChild(liveDot);
    bar.appendChild(liveText);

    const embedWrap = document.createElement('div');
    embedWrap.className = 'livestream-embed-wrap';

    const iframe = document.createElement('iframe');
    iframe.className = 'livestream-iframe';
    iframe.setAttribute('allow','autoplay; encrypted-media; picture-in-picture');
    iframe.setAttribute('allowfullscreen','');
    iframe.style.border = '0';

    // choose embed URL
    if(cfg['stream-type'] === 'twitch'){
      const channel = cfg.channel || cfg.channelName || '';
      const parent = window.location.hostname || 'phsrambots.org';
      iframe.src = `https://player.twitch.tv/?channel=${encodeURIComponent(channel)}&parent=${encodeURIComponent(parent)}&autoplay=false`;
    } else if(cfg['stream-type'] === 'youtube'){
      // prefer explicit video id (video, videoId, video_id) then fall back to channel live stream
      const vid = cfg.video || cfg.videoId || cfg.video_id;
      if(vid){
        iframe.src = `https://www.youtube.com/embed/${vid}?autoplay=0`;
      } else if(cfg.channel){
        iframe.src = `https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(cfg.channel)}&autoplay=0`;
      } else {
        // fallback: embed youtube home
        iframe.src = `https://www.youtube.com/embed?autoplay=0`;
      }
    } else {
      // unsupported type - bail
      return;
    }

    embedWrap.appendChild(iframe);

    const ctrl = document.createElement('button');
    ctrl.className = 'livestream-toggle';
    ctrl.title = 'Minimize live stream';
    ctrl.textContent = '-';

    ctrl.addEventListener('click', ()=>{
      container.classList.toggle('minimized');
      ctrl.textContent = container.classList.contains('minimized') ? '+' : '-';
    });

    container.appendChild(bar);
    container.appendChild(embedWrap);
    container.appendChild(ctrl);

    // insert above the slideshow if present, otherwise prepend to body
    const slideshow = document.querySelector('.imageslideshow');
    if(slideshow && slideshow.parentNode){
      slideshow.parentNode.insertBefore(container, slideshow);
    } else {
      document.body.insertBefore(container, document.body.firstChild);
    }

    // responsive sizing: set iframe height relative to width
    function resize(){
      // size based on the embed wrapper width (70% width)
      const w = embedWrap.offsetWidth || container.offsetWidth;
      iframe.style.width = '100%';
      iframe.style.height = Math.round(w * 9/16) + 'px';
    }
    window.addEventListener('resize', resize);
    resize();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
