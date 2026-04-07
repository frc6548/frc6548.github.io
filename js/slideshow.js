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

showSlide(currentSlideIndex);
startAutoSlide();