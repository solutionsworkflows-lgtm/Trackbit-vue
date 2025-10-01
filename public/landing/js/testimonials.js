$(document).ready(function () {
    const nextArrow = $(".arrow-code_wrapper.next");
    const circle = nextArrow.find(".anime-stroke-dash"); // Find the element by class

    // Set initial stroke parameters
    function resetCircle() {
        const length = circle[0].getTotalLength(); // Stroke length
        circle.stop(true, true); // Stop the current animation
        circle.css({
            "stroke-dasharray": length,
            "stroke-dashoffset": length, // Initially hide the stroke
        });
    }

    // Start the stroke animation
    function animateNextArrow() {
        const length = circle[0].getTotalLength();
        const animationDuration = 45000; // Animation duration in milliseconds

        // Reset to the initial state before each animation
        resetCircle();

        // Start the animation
        circle.animate(
            { "stroke-dashoffset": "0" },
            {
                duration: animationDuration,
                easing: "linear",
            }
        );
    }

    // Initialize Slick Slider
    const slider = $(".testimonials-list").slick({
        centerMode: true,
        centerPadding: "20px",
        slidesToShow: 1,
        variableWidth: true,
        arrows: true,
        prevArrow: $(".arrow-code_wrapper.prev"),
        nextArrow: nextArrow,
        dots: false,
        autoplay: true, // Enable autoplay
        autoplaySpeed: 45000, // Interval of 45 seconds
        pauseOnHover: false, // Disable pause on hover
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerPadding: "10px",
                },
            },
        ],
    });

    // Reset and start the animation on automatic or manual slide change
    slider.on("beforeChange", function () {
        resetCircle(); // Reset the stroke
        animateNextArrow(); // Restart the animation
    });

    // Reset and start the animation when clicking on arrows
    $(".arrow-code_wrapper").on("click", function () {
        resetCircle(); // Reset the stroke
        animateNextArrow(); // Restart the animation
        slider.slick("slickPlay"); // Resume autoplay
    });

    // Resume autoplay after interaction (dragging or clicks)
    slider.on("touchend mouseup", function () {
        slider.slick("slickPlay"); // Resume autoplay
    });

    // Start the first animation after loading
    resetCircle();
    animateNextArrow();
});