let currentSlideIndex = 0;
let slideTimer;
let isAnimating = false;
let queuedMoves = [];
const TRANSITION_MS = 700;
let slideAnimationTimer = null;
let pendingTransition = null;

function showSlide(n, dir = 'next') {
    const container = document.querySelector('.slidecontainer');
    const slides = container ? container.querySelectorAll('.slide') : document.querySelectorAll('.slide');
    const slidelinks = document.querySelectorAll('.slidelink');
    const dots = document.querySelectorAll('.dot');

    if (!slides || !slides.length) return;

    // normalize index with wrap
    let idx = n;
    if (idx >= slides.length) idx = 0;
    if (idx < 0) idx = slides.length - 1;

    // If an animation is in progress, we should not be called directly for new moves.
    // changeSlide/currentSlide will queue them instead. Proceed only when idle.
    if (isAnimating) return;

    // find current active index
    const activeIndex = Array.from(slides).findIndex(s => s.classList.contains('active'));
    const active = activeIndex >= 0 ? activeIndex : idx;
    const prevOfActive = (active - 1 + slides.length) % slides.length;
    const nextOfActive = (active + 1) % slides.length;

    // If target is same as active, nothing to do
    if (activeIndex === idx) return;

    // Create staging area that will hold clones of prev/current/next
    // Remove any existing staging first
    const existingStage = container.querySelector('.slide-staging');
    if (existingStage) existingStage.remove();

    const stage = document.createElement('div');
    stage.className = 'slide-staging';
    Object.assign(stage.style, {
        position: 'absolute', left: '0', top: '0', width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 3
    });

    // helper to clone slide and prepare position
    const makeClone = (slideEl, xPercent) => {
        const c = slideEl.cloneNode(true);
        c.classList.add('clone');
        c.style.position = 'absolute';
        c.style.left = 0;
        c.style.top = 0;
        c.style.width = '100%';
        c.style.height = '100%';
        c.style.pointerEvents = 'none';
        c.style.transform = `translateX(${xPercent}%)`;
        c.style.transition = `transform ${TRANSITION_MS}ms cubic-bezier(.2,.9,.2,1)`;
        return c;
    };

    const prevClone = makeClone(slides[prevOfActive], -100);
    const currClone = makeClone(slides[active], 0);
    const nextClone = makeClone(slides[nextOfActive], 100);

    stage.appendChild(prevClone);
    stage.appendChild(currClone);
    stage.appendChild(nextClone);
    container.appendChild(stage);

    // update link/dot active classes (preview of target)
    if (slidelinks && slidelinks.length) slidelinks.forEach(link => link.classList.remove('active'));
    if (dots && dots.length) dots.forEach(dot => dot.classList.remove('active'));
    if (slidelinks && slidelinks[idx]) slidelinks[idx].classList.add('active');
    if (dots && dots[idx]) dots[idx].classList.add('active');

    // force reflow
    // eslint-disable-next-line no-unused-expressions
    stage.offsetWidth;

    // perform animation: current -> left, next -> center (or reverse)
    isAnimating = true;
    if (dir === 'next') {
        currClone.style.transform = 'translateX(-100%)';
        nextClone.style.transform = 'translateX(0)';
    } else {
        currClone.style.transform = 'translateX(100%)';
        prevClone.style.transform = 'translateX(0)';
    }

    // schedule finalize via pendingTransition
    if (slideAnimationTimer) { clearTimeout(slideAnimationTimer); slideAnimationTimer = null; }
    pendingTransition = { stage, activeIndex: active, idx };
    slideAnimationTimer = setTimeout(finalizePendingTransition, TRANSITION_MS + 60);
}

function changeSlide(n) {
    clearTimeout(slideTimer);
    // If currently animating, queue the delta to process later
    if (isAnimating) {
        // coalesce consecutive deltas so rapid clicks don't queue many steps
        const last = queuedMoves.length ? queuedMoves[queuedMoves.length - 1] : null;
        if (last && last.type === 'delta') {
            last.value += n;
        } else {
            queuedMoves.push({ type: 'delta', value: n });
        }
        // restart auto-slide timer even when queuing
        startAutoSlide();
        // expedite current animation slightly so queued move happens sooner
        expediteTransition();
        return;
    }
    currentSlideIndex += n;
    const dir = n >= 0 ? 'next' : 'prev';
    showSlide(currentSlideIndex, dir);
    startAutoSlide();
}

function currentSlide(n) {
    clearTimeout(slideTimer);
    const old = currentSlideIndex;
    // If animating, queue the absolute target
    if (isAnimating) {
        // keep only the most recent absolute target (overwrite previous targets)
        const last = queuedMoves.length ? queuedMoves[queuedMoves.length - 1] : null;
        if (last && last.type === 'target') {
            last.value = n;
        } else {
            queuedMoves.push({ type: 'target', value: n });
        }
        startAutoSlide();
        expediteTransition();
        return;
    }
    currentSlideIndex = n;
    const dir = n >= old ? 'next' : 'prev';
    showSlide(currentSlideIndex, dir);
    startAutoSlide();
}

function startAutoSlide() {
    // ensure only one auto timer exists
    if (slideTimer) clearTimeout(slideTimer);
    slideTimer = setTimeout(() => {
        // If currently animating, queue the auto-advance instead of forcing show
        if (isAnimating) {
            queuedMoves.push({ type: 'delta', value: 1 });
            expediteTransition();
            // schedule next auto-advance
            startAutoSlide();
            return;
        }
        currentSlideIndex++;
        showSlide(currentSlideIndex, 'next');
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

// finalize the pending transition (centralized)
function finalizePendingTransition() {
    if (!pendingTransition) return;
    const pt = pendingTransition;
    try { pt.stage.remove(); } catch (e) {}
    const container = document.querySelector('.slidecontainer');
    const slides = container ? container.querySelectorAll('.slide') : document.querySelectorAll('.slide');
    if (slides && slides.length) {
        // remove active from previous real active
        if (pt.activeIndex >= 0 && slides[pt.activeIndex]) slides[pt.activeIndex].classList.remove('active');
        // set target active but prevent CSS transition replay by disabling transition briefly
        const target = slides[pt.idx];
        if (target) {
            // temporarily disable transition so the target appears instantly
            const prevTransition = target.style.transition;
            const prevTransform = target.style.transform;
            target.style.transition = 'none';
            target.style.transform = 'translateX(0)';
            target.classList.add('active');
            // force reflow to apply styles immediately
            // eslint-disable-next-line no-unused-expressions
            target.offsetWidth;
            // restore transition after a tick so future animations work
            setTimeout(() => {
                target.style.transition = prevTransition || '';
                // clear inline transform to let CSS control positioning normally
                target.style.transform = prevTransform || '';
            }, 30);
        }
    }
    isAnimating = false;
    currentSlideIndex = pt.idx;

    // clear pending and timer
    pendingTransition = null;
    if (slideAnimationTimer) { clearTimeout(slideAnimationTimer); slideAnimationTimer = null; }

    // process queued move if any
    if (queuedMoves && queuedMoves.length) {
        const q = queuedMoves.shift();
        let target, ndir;
        if (q.type === 'delta') {
            target = currentSlideIndex + q.value;
            ndir = q.value >= 0 ? 'next' : 'prev';
        } else {
            target = q.value;
            ndir = target >= currentSlideIndex ? 'next' : 'prev';
        }
        showSlide(target, ndir);
        // ensure auto-advance continues
        startAutoSlide();
    }
}

function expediteTransition() {
    // shorten the pending transition timeout so queued moves happen sooner
    if (slideAnimationTimer && pendingTransition) {
        clearTimeout(slideAnimationTimer);
        // give a small but not too-small window to let the current animation be visible
        slideAnimationTimer = setTimeout(finalizePendingTransition, 220);
    }
}