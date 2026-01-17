let currentSlideIndex = 0;
let slideTimer;

function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const slidelinks = document.querySelectorAll('.slidelink');
    const dots = document.querySelectorAll('.dot');
    
    if (n >= slides.length) currentSlideIndex = 0;
    if (n < 0) currentSlideIndex = slides.length - 1;
    
    slides.forEach(slide => slide.classList.remove('active'));
    slidelinks.forEach(link => link.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[currentSlideIndex].classList.add('active');
    slidelinks[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
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