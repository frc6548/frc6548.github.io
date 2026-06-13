// Simple calendar widget: fetches JSON from /data/calendar/{year}/{month}/events.json
(() => {
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const state = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(), // 0-based
    eventsByDate: {}
  };

  // Source timezone for event data (site stores events in Eastern Time)
  const SOURCE_TIMEZONE = 'America/New_York';

  function el(id){ return document.getElementById(id); }

  function pad(n){ return n < 10 ? '0'+n : ''+n }

  function parseYMD(ymd){
    // Parse YYYY-MM-DD as a local date (avoid Date(YYYY-MM-DD) UTC parsing)
    const parts = String(ymd).split('-').map(Number);
    if(parts.length !== 3) return new Date(ymd);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function tryFetchPaths(year, month){
    // Try both numeric folder (e.g. 3) and zero-padded (03)
    const mNoPad = String(month + 1);
    const mPad = pad(month + 1);
    const base = '/data/calendar/';
    return [
      `${base}${year}/${mNoPad}/events.json`,
      `${base}${year}/${mPad}/events.json`,
    ];
  }

  async function loadEvents(year, month){
    state.eventsByDate = {};
    const paths = tryFetchPaths(year, month);
    let data = null;
    for(const p of paths){
      try{
        const res = await fetch(p);
        if(!res.ok) continue;
        data = await res.json();
        break;
      }catch(e){ /* try next */ }
    }
    if(!data) return;
    // expected data: array of events. Support single-day events (date) and multi-day (endDate)
    data.forEach(ev => {
      const start = ev.date; // expect YYYY-MM-DD
      const end = ev.endDate || ev.end_date || start;
      // if end is time like "20:00" and no endDate provided, treat as single-day
      const isDateRange = /^\d{4}-\d{2}-\d{2}$/.test(end);
      if(isDateRange){
        // add event to every day in range inclusive (parse as local dates)
        const s = parseYMD(start);
        const e = parseYMD(end);
        for(let cur = new Date(s); cur <= e; cur.setDate(cur.getDate()+1)){
          const y = cur.getFullYear(); const m = ('0'+(cur.getMonth()+1)).slice(-2); const day = ('0'+cur.getDate()).slice(-2);
          const key = `${y}-${m}-${day}`;
          if(!state.eventsByDate[key]) state.eventsByDate[key] = [];
          state.eventsByDate[key].push(ev);
        }
      } else {
        const d = start;
        if(!state.eventsByDate[d]) state.eventsByDate[d] = [];
        state.eventsByDate[d].push(ev);
      }
    });
  }

  function renderCalendar(){
    const grid = el('calendar-grid');
    grid.innerHTML = '';

    // title
    el('calendar-title').textContent = `${monthNames[state.month]} ${state.year}`;

    // weekdays header
    const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const headerRow = document.createElement('div');
    headerRow.className = 'cal-weekdays';
    weekdays.forEach(w => {
      const d = document.createElement('div'); d.className='cal-weekday'; d.textContent = w; headerRow.appendChild(d);
    });
    grid.appendChild(headerRow);

    const first = new Date(state.year, state.month, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(state.year, state.month + 1, 0).getDate();

    // Create day cells (leading blanks included)
    const cells = document.createElement('div');
    cells.className = 'cal-cells';

    // total cells 42 (6 weeks)
    const total = 42;
    for(let i=0;i<total;i++){
      const cell = document.createElement('div');
      cell.className = 'cal-cell';
      const dayIndex = i - startDay + 1;
      if(dayIndex > 0 && dayIndex <= daysInMonth){
        const dateStr = `${state.year}-${pad(state.month+1)}-${pad(dayIndex)}`;
        const num = document.createElement('div'); num.className='cal-date'; num.textContent = dayIndex;
        cell.appendChild(num);

        const events = state.eventsByDate[dateStr] || [];
        if(events.length){
          const list = document.createElement('div'); list.className='event-list';
          events.slice(0,3).forEach(ev => {
            const b = document.createElement('button');
            b.className='event-badge';
            // show localized short start time on the badge when available
            const shortTime = formatEventShortTime(dateStr, ev);
            b.textContent = shortTime ? `${shortTime} - ${ev.title}` : ev.title;
            b.title = ev.title;
            b.onclick = (e)=>{ e.stopPropagation(); openModal(dateStr, ev); };
            list.appendChild(b);
          });
          if(events.length > 3){
            const more = document.createElement('div'); more.className='more-count'; more.textContent = `+${events.length-3} more`;
            list.appendChild(more);
          }
          cell.appendChild(list);
        }

        cell.onclick = ()=>{
          openModal(dateStr);
        };
      } else {
        cell.classList.add('cal-empty');
      }
      cells.appendChild(cell);
    }

    grid.appendChild(cells);
  }

  function openModal(dateStr, singleEvent){
    const modal = el('event-modal');
    const body = el('modal-body');
    body.innerHTML = '';
    const h = document.createElement('h2');
    h.textContent = singleEvent ? singleEvent.title : `Events - ${dateStr}`;
    body.appendChild(h);

    const events = singleEvent ? [singleEvent] : (state.eventsByDate[dateStr] || []);
    if(events.length === 0){
      const p = document.createElement('p'); p.textContent = 'No events for this day.'; body.appendChild(p);
    }
    events.forEach(ev => {
      const evWrap = document.createElement('div'); evWrap.className='ev-wrap';
      const title = document.createElement('div'); title.className='ev-title'; title.textContent = ev.title; evWrap.appendChild(title);
      if(ev.start || ev.end){
        const times = document.createElement('div'); times.className='ev-time';
        times.textContent = formatEventTime(dateStr, ev) || `${ev.start||''}${ev.start && ev.end ? ' - ' : ''}${ev.end||''}`;
        evWrap.appendChild(times);
      }
      if(ev.location){
        const loc = document.createElement('div'); loc.className='ev-loc';
        const maps = document.createElement('a');
        maps.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.location)}`;
        maps.target = '_blank';
        maps.rel = 'noopener noreferrer';
        maps.textContent = 'Open location in Google Maps';
        loc.appendChild(maps);
        evWrap.appendChild(loc);
      }
      if(ev.description){
        const desc = document.createElement('p'); desc.className='ev-desc'; desc.textContent = ev.description; evWrap.appendChild(desc);
      }
      // Add link to create Google Calendar event (basic)
      const gcBtn = document.createElement('a');
      gcBtn.className='gc-btn';
      const startDate = (ev.date || dateStr).replace(/-/g,'');
      // use all-day event for simplicity
      gcBtn.href = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title||'Event')}&dates=${startDate}/${startDate}&details=${encodeURIComponent(ev.description||'')}`;
      gcBtn.target = '_blank'; gcBtn.rel='noopener noreferrer'; gcBtn.textContent = 'Add to Google Calendar';
      evWrap.appendChild(gcBtn);

      body.appendChild(evWrap);
    });

      // timezone note
      const tzNote = document.createElement('div'); tzNote.className = 'ev-tz-note';
      tzNote.textContent = `Event times shown in your local timezone. (Events listed in ${SOURCE_TIMEZONE}.)`;
      body.appendChild(tzNote);

    modal.setAttribute('aria-hidden','false');
    modal.classList.add('open');
  }

  function closeModal(){
    const modal = el('event-modal');
    modal.setAttribute('aria-hidden','true');
    modal.classList.remove('open');
  }

  // Helpers: convert a wall time in SOURCE_TIMEZONE to epoch ms, then format for user's locale
  function getTZOffset(date, timeZone){
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone, hour12: false, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' });
    const parts = fmt.formatToParts(date);
    const map = {};
    parts.forEach(p=>{ if(p.type !== 'literal') map[p.type] = p.value; });
    const tzUtc = Date.UTC(Number(map.year), Number(map.month)-1, Number(map.day), Number(map.hour), Number(map.minute), Number(map.second));
    return tzUtc - date.getTime();
  }

  function epochForWallTime(year, month, day, hour, minute, timeZone){
    const utcForWall = Date.UTC(year, month - 1, day, hour, minute, 0);
    const testDate = new Date(utcForWall);
    const offset = getTZOffset(testDate, timeZone);
    return utcForWall - offset;
  }

  function parseTimeHM(hm){
    if(!hm) return null;
    const m = String(hm).trim().match(/^(\d{1,2}):(\d{2})$/);
    if(!m) return null;
    return { hour: Number(m[1]), minute: Number(m[2]) };
  }

  function formatEventTime(dateStr, ev){
    try{
      const parts = String(dateStr || ev.date).split('-').map(Number);
      if(parts.length < 3) return null;
      const y = parts[0], m = parts[1], d = parts[2];
      const s = parseTimeHM(ev.start);
      const e = parseTimeHM(ev.end);
      const userFormatter = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
      if(s && e){
        const startEpoch = epochForWallTime(y, m, d, s.hour, s.minute, SOURCE_TIMEZONE);
        const endEpoch = epochForWallTime(y, m, d, e.hour, e.minute, SOURCE_TIMEZONE);
        return `${userFormatter.format(new Date(startEpoch))} - ${userFormatter.format(new Date(endEpoch))}`;
      } else if(s){
        const startEpoch = epochForWallTime(y, m, d, s.hour, s.minute, SOURCE_TIMEZONE);
        return `${userFormatter.format(new Date(startEpoch))}`;
      }
    }catch(err){
      return null;
    }
    return null;
  }

  function formatEventShortTime(dateStr, ev){
    const t = formatEventTime(dateStr, ev);
    if(!t) return '';
    // return just the start time portion (before ' - ' if present)
    return t.split(' - ')[0];
  }

  function setupControls(){
    // year and month selects
    const ysel = el('year-select');
    const msel = el('month-select');
    const now = new Date();
    for(let y = now.getFullYear() - 2; y <= now.getFullYear() + 2; y++){
      const o = document.createElement('option'); o.value = y; o.textContent = y; ysel.appendChild(o);
    }
    monthNames.forEach((m,i)=>{ const o = document.createElement('option'); o.value = i; o.textContent = m; msel.appendChild(o); });
    ysel.value = state.year; msel.value = state.month;

    el('load-month').addEventListener('click', async ()=>{ await loadForSelects(); });
    // auto-load when selecting year or month
    ysel.addEventListener('change', async ()=>{ await loadForSelects(); });
    msel.addEventListener('change', async ()=>{ await loadForSelects(); });

    async function loadForSelects(){
      state.year = parseInt(ysel.value,10); state.month = parseInt(msel.value,10);
      await loadEvents(state.year, state.month);
      renderCalendar();
    }

    el('prev-month').addEventListener('click', async ()=>{
      if(state.month === 0){ state.month = 11; state.year -= 1; } else state.month -= 1;
      ysel.value = state.year; msel.value = state.month;
      await loadEvents(state.year, state.month); renderCalendar();
    });
    el('next-month').addEventListener('click', async ()=>{
      if(state.month === 11){ state.month = 0; state.year += 1; } else state.month += 1;
      ysel.value = state.year; msel.value = state.month;
      await loadEvents(state.year, state.month); renderCalendar();
    });

    el('modal-close').addEventListener('click', closeModal);
    el('event-modal').addEventListener('click', (e)=>{ if(e.target === e.currentTarget) closeModal(); });
  }

  async function init(){
    setupControls();
    await loadEvents(state.year, state.month);
    renderCalendar();
  }

  // start when DOM ready
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
