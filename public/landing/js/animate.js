document.addEventListener("DOMContentLoaded", () => {
    // Get wrapper if needed
    const wrapper = document.querySelector("[data-hero-anime]") || document;

    // Create timeline for animation
    const tl = gsap.timeline();

    // Anime for data-hero-header-anime
    const heroblurItems = wrapper.querySelectorAll("[data-hero-header-anime]");
    if (heroblurItems.length > 0) {
        tl.to(
            heroblurItems,
            {
                filter: "blur(0px)",
                opacity: 1,
                duration: 0.4,
                ease: "power2.out",
            },
            0
        );
    }

    // Anime for data-hero-fade-anime
    const herofadeItems = wrapper.querySelectorAll("[data-hero-fade-anime]");
    if (herofadeItems.length > 0) {
        tl.to(
            herofadeItems,
            {
                opacity: 1,
                y: 0,
                duration: 1.25,
                ease: "power2.out",
                stagger: 0.1,
            },
            0.15
        );
    }

    // Anime for anime-hero-image-fade
    const imgherofadeItems = wrapper.querySelectorAll("[anime-hero-image-fade]");
    if (imgherofadeItems.length > 0) {
        tl.to(
            imgherofadeItems,
            {
                y: 0,
                duration: 1.25,
                ease: "power2.out",
                stagger: 0.1,
            },
            0.3
        );
    }

    // Anime for data-hero-anime-in-scale
    const heroinscaleItems = wrapper.querySelectorAll(
        "[data-hero-anime-in-scale]"
    );
    if (heroinscaleItems.length > 0) {
        heroinscaleItems.forEach((item) => {
            const startValue = parseFloat(item.getAttribute("data-start")) || 0.3;

            tl.to(
                item,
                {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: 1.25,
                    ease: "power2.out",
                },
                startValue
            );
        });
    }

    // Anime for data-hero-anime-opacity
    const heroopacityItems = wrapper.querySelectorAll(
        "[data-hero-anime-opacity]"
    );
    if (heroopacityItems.length > 0) {
        tl.to(
            heroopacityItems,
            {
                opacity: 1,
                duration: 1.25,
                ease: "power2.out",
            },
            0
        );
    }
    // Anime for data-hero-anime-opacity
    const heroblickItems = wrapper.querySelectorAll("[data-hero-blick]");
    if (heroblickItems.length > 0) {
        tl.to(
            heroblickItems,
            {
                opacity: 1,
                duration: 0.4,
                ease: "power2.out",
                stagger: 0.1,
            },
            0.4
        );
    }

    // Anime for data-hero-line-anime-height
    const heroheightItems = wrapper.querySelectorAll(
        "[data-hero-line-anime-height]"
    );
    heroheightItems.forEach((item) => {
        const targetheroHeight =
            item.getAttribute("data-hero-line-anime-height") || "100%";
        tl.to(
            item,
            {
                height: targetheroHeight,
                duration: 2.5,
                delay: "random(0, 1)",
                ease: "power2.out",
            },
            0
        );
    });

    // Anime for data-hero-line-anime-width
    const herowidthItems = wrapper.querySelectorAll(
        "[data-hero-line-anime-width]"
    );
    herowidthItems.forEach((item) => {
        const targetheroWidth =
            item.getAttribute("data-hero-line-anime-width") || "100%";
        tl.to(
            item,
            {
                width: targetheroWidth,
                duration: 2.5,
                delay: "random(0, 1)",
                ease: "power2.out",
            },
            0
        );
    });
});