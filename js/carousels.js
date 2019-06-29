let questionsCarousel;

(function () {
    'use strict';

    // Main Content Carousel //
    questionsCarousel = $(".owl-carousel.quizz__carousel");
    questionsCarousel = questionsCarousel.owlCarousel({
        loop: false,
        margin: 30,
        items: 1,
        center: true,
        dots: false,
        nav: false,
        navText: [
            "<i class='owl-nav chevron-left'>", "<i class='owl-nav chevron-right'>"
        ],
        slideBy: "page",
        dragEndSpeed: 700,
        mouseDrag: false,
        touchDrag: false,
        pullDrage: false,
        freeDrag: false,
        smartSpeed: 60000,
        animateOut: 'zoomOut',
        animateIn: 'zoomIn',
        startPosition: 0,
    });
    
    window.dispatchEvent(new Event('resize'));
})();