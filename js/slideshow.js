let currentSlideIndex = 0;
let slideTimer;

function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const slidelinks = document.querySelectorAll('.slidelink');
    const dots = document.querySelectorAll('.dot');
    
    if (!slides.length) return; // nothing to show

    if (n >= slides.length) currentSlideIndex = 0;
    if (n < 0) currentSlideIndex = slides.length - 1;

    slides.forEach(slide => slide.classList.remove('active'));
    if (slidelinks && slidelinks.length) slidelinks.forEach(link => link.classList.remove('active'));
    if (dots && dots.length) dots.forEach(dot => dot.classList.remove('active'));

    const idx = Math.min(Math.max(currentSlideIndex, 0), slides.length - 1);
    slides[idx].classList.add('active');
    if (slidelinks && slidelinks[idx]) slidelinks[idx].classList.add('active');
    if (dots && dots[idx]) dots[idx].classList.add('active');
}

function changeSlide(n) {
    clearTimeout(slideTimer);
    currentSlideIndex += n;
    showSlide(currentSlideIndex);
    startAutoSlide();
}

function currentSlide(n) {
    clearTimeout(slideTimer);
    currentSlideIndex = n;
    showSlide(currentSlideIndex);
    startAutoSlide();
}

function startAutoSlide() {
    slideTimer = setTimeout(() => {
        currentSlideIndex++;
        showSlide(currentSlideIndex);
        startAutoSlide();
    }, 5000);
}
async function loadSlidesFromJSON(path = '/data/slideshow/info.json') {
    try {
        const resp = await fetch(path, {cache: 'no-store'});
        if (!resp.ok) throw new Error('no-json');
        const slides = await resp.json();
        const container = document.querySelector('.slidecontainer');
        const dotsContainer = document.querySelector('.slidedots');
        if (!container) return;

        container.innerHTML = '';
        if (dotsContainer) dotsContainer.innerHTML = '';

        slides.forEach((s, i) => {
            if (s.active){
                const a = document.createElement('a');
                a.className = 'slidelink';
                if (s.href) a.href = s.href;
                a.rel = 'noopener noreferrer';

                const slide = document.createElement('div');
                slide.className = 'slide';
                if (s.active && i === 0) slide.classList.add('active');

                const img = document.createElement('img');
                img.className = 'slideimage';
                img.src = s.img || '';
                img.alt = s.alt || '';

                const overlay = document.createElement('div');
                overlay.className = 'slideoverlay';

                const h2 = document.createElement('h2');
                h2.className = 'slideheader';
                h2.textContent = s.header || '';

                const p = document.createElement('p');
                p.className = 'slidedescription';
                p.textContent = s.description || '';

                overlay.appendChild(h2);
                overlay.appendChild(p);
                slide.appendChild(img);
                slide.appendChild(overlay);
                a.appendChild(slide);
                container.appendChild(a);

                if (dotsContainer) {
                    const dot = document.createElement('span');
                    dot.className = 'dot';
                    dot.addEventListener('click', () => currentSlide(i));
                    dotsContainer.appendChild(dot);
                }
            }
        });

        // mark first as active if none marked
        const allSlides = container.querySelectorAll('.slide');
        if (allSlides.length && !container.querySelector('.slide.active')) {
            allSlides[0].classList.add('active');
            const links = container.querySelectorAll('.slidelink');
            if (links && links[0]) links[0].classList.add('active');
            const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : null;
            if (dots && dots[0]) dots[0].classList.add('active');
        } else {
            // ensure corresponding link/dot active classes match
            const activeIndex = Array.from(allSlides).findIndex(s => s.classList.contains('active'));
            if (activeIndex >= 0) {
                const links = container.querySelectorAll('.slidelink');
                if (links && links[activeIndex]) links[activeIndex].classList.add('active');
                const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : null;
                if (dots && dots[activeIndex]) dots[activeIndex].classList.add('active');
                currentSlideIndex = activeIndex;
            }
        }

        showSlide(currentSlideIndex);
        startAutoSlide();
    } catch (e) {
        // fallback to existing static markup if JSON not available
        showSlide(currentSlideIndex);
        startAutoSlide();
    }
}

// Attempt to load slides from JSON; fall back to static HTML if unavailable.
loadSlidesFromJSON();