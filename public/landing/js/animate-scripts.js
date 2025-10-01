document.addEventListener("DOMContentLoaded", () => {
    // Get all wrappers with the data-header-card-anime attribute
    const wrappers = document.querySelectorAll("[data-header-card-anime]");

    wrappers.forEach((wrapper) => {
        // Initialize ScrollTrigger for each wrapper
        ScrollTrigger.create({
            trigger: wrapper,
            start: "top 70%", // Animation start position
            once: true, // The animation triggers only once per wrapper
            onEnter: () => {
                // Create a timeline for the animation
                const tl = gsap.timeline();

                // Animation for elements with data-blur-anime
                const blurItems = wrapper.querySelectorAll("[data-blur-anime]");
                if (blurItems.length > 0) {
                    tl.to(
                        blurItems,
                        {
                            filter: "blur(0px)",
                            opacity: 1,
                            duration: 0.4,
                            ease: "power2.out",
                        },
                        0
                    );
                }

                // Animation for elements with data-anime-opacity
                const opacityItems = wrapper.querySelectorAll("[data-anime-opacity]");
                if (opacityItems.length > 0) {
                    tl.to(
                        opacityItems,
                        {
                            opacity: 1,
                            duration: 1.25,
                            ease: "none",
                        },
                        0.1
                    );
                }

                // Animation for elements with data-deleyopacity
                const deleyopacityItems = wrapper.querySelectorAll(
                    "[data-deleyopacity]"
                );
                if (deleyopacityItems.length > 0) {
                    // Get the value from the first element's attribute or use 0.5 by default
                    const startdeleyTime =
                        parseFloat(
                            deleyopacityItems[0].getAttribute("data-deleyopacity")
                        ) || 0.25;

                    tl.to(
                        deleyopacityItems,
                        {
                            opacity: 1,
                            duration: 1,
                            ease: "power2.out",
                            stagger: 0.1,
                        },
                        startdeleyTime
                    );
                }

                // Animation for elements with data-anime-opacity-now (instant appearance)
                const opacitynowItems = wrapper.querySelectorAll(
                    "[data-anime-opacity-now]"
                );
                if (opacitynowItems.length > 0) {
                    tl.to(
                        opacitynowItems,
                        {
                            opacity: 1,
                            duration: 0.05,
                            ease: "none",
                        },
                        0.15
                    );
                }

                // Animation for elements with data-anime-opacity-stager
                const stageropacityItems = wrapper.querySelectorAll(
                    "[data-anime-opacity-stager]"
                );
                if (stageropacityItems.length > 0) {
                    tl.to(
                        stageropacityItems,
                        {
                            opacity: 1,
                            duration: 1.25,
                            ease: "none",
                            stagger: 0.1,
                        },
                        0.1
                    );
                }

                // Animation for elements with data-anime-fade
                const fadeItems = wrapper.querySelectorAll("[data-anime-fade]");
                if (fadeItems.length > 0) {
                    tl.to(
                        fadeItems,
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.7,
                            ease: "power2.out",
                            stagger: 0.05,
                        },
                        0.2
                    );
                }

                // Animation for elements with data-anime-fade-lumi
                const fadelumiItems = wrapper.querySelectorAll(
                    "[data-anime-fade-lumi]"
                );
                if (fadelumiItems.length > 0) {
                    tl.to(
                        fadelumiItems,
                        {
                            opacity: 1,
                            // y: 0,
                            force3D: false,
                            duration: 0.7,
                            ease: "power2.out",
                            stagger: 0.05,
                        },
                        0.2
                    );
                }

                // Animation for elements with data-anime-fade-fast
                const fadefastItems = wrapper.querySelectorAll(
                    "[data-anime-fade-fast]"
                );
                if (fadefastItems.length > 0) {
                    tl.to(
                        fadefastItems,
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.3,
                            ease: "power2.out",
                            stagger: 0.025,
                        },
                        0.2
                    );
                }

                // Animation for elements with data-anime-fade-big
                const bigfadeItems = wrapper.querySelectorAll("[data-anime-fade-big]");
                if (bigfadeItems.length > 0) {
                    tl.to(
                        bigfadeItems,
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.7,
                            ease: "power2.out",
                            stagger: 0.1,
                        },
                        0.2
                    );
                }

                // Animation for elements with data-image-top-scale
                const imgscaleItems = wrapper.querySelectorAll(
                    "[data-image-top-scale]"
                );
                if (imgscaleItems.length > 0) {
                    tl.to(
                        imgscaleItems,
                        {
                            scale: 1,
                            duration: 0.4,
                            ease: "power2.out",
                        },
                        0.15
                    );
                }

                // Animation for elements with data-anime-short-fade
                const shortfadeItems = wrapper.querySelectorAll(
                    "[data-anime-short-fade]"
                );
                if (shortfadeItems.length > 0) {
                    tl.to(
                        shortfadeItems,
                        {
                            opacity: 1,
                            y: 0,
                            duration: 1.25,
                            ease: "power2.out",
                        },
                        0.15
                    );
                }

                // Animation for elements with data-line-anime-height
                const heightItems = wrapper.querySelectorAll(
                    "[data-line-anime-height]"
                );
                heightItems.forEach((item) => {
                    const targetHeight =
                        item.getAttribute("data-line-anime-height") || "100%";
                    tl.to(
                        item,
                        {
                            height: targetHeight,
                            duration: 2.5,
                            delay: "random(0, 1)",
                            ease: "power2.out",
                        },
                        0
                    );
                });

                // Animation for elements with data-line-anime-width
                const widthItems = wrapper.querySelectorAll("[data-line-anime-width]");
                widthItems.forEach((item) => {
                    const targetWidth =
                        item.getAttribute("data-line-anime-width") || "100%";
                    tl.to(
                        item,
                        {
                            width: targetWidth,
                            duration: 2.5,
                            delay: "random(0, 1)",
                            ease: "power2.out",
                        },
                        0
                    );
                });

                // Animation for elements with data-line-anime-width-divider
                const dividerwidthItems = wrapper.querySelectorAll(
                    "[data-line-anime-width-divider]"
                );
                dividerwidthItems.forEach((item) => {
                    const dividertargetWidth =
                        item.getAttribute("data-line-anime-width-divider") || "100%";
                    tl.to(
                        item,
                        {
                            width: dividertargetWidth,
                            duration: 2.5,
                            ease: "power2.out",
                            stagger: 0.1,
                        },
                        0.3
                    );
                });

                // Animation for text elements with data-split-line
                const splitItems = wrapper.querySelectorAll("[data-split-line]");
                splitItems.forEach((item) => {
                    const split = new SplitType(item, { types: "lines" }); // Split text into lines
                    const lines = item.querySelectorAll(".line");

                    // Change opacity for the [data-split-line] element itself
                    tl.to(
                        item,
                        {
                            opacity: 1,
                            duration: 0, // Instant change
                        },
                        0
                    );

                    // Animate each line
                    tl.from(
                        lines,
                        {
                            opacity: 0,
                            y: 12,
                            duration: 0.7,
                            ease: "power2.out",
                            stagger: 0.075,
                        },
                        0.25
                    );
                });
            },
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // Get all wrappers with the wrapper-fade-appear attribute
    const wrappers = document.querySelectorAll("[wrapper-fade-appear]");

    wrappers.forEach((wrapper) => {
        // Initialize ScrollTrigger for each wrapper
        ScrollTrigger.create({
            trigger: wrapper,
            start: "top 80%", // Animation start position
            once: true, // The animation triggers only once per wrapper
            onEnter: () => {
                // Create a timeline for the animation
                const tl = gsap.timeline();

                // Animation for elements with data-blur-in-anime
                const inblurItems = wrapper.querySelectorAll("[data-blur-in-anime]");
                if (inblurItems.length > 0) {
                    tl.to(
                        inblurItems,
                        {
                            filter: "blur(0px)",
                            opacity: 1,
                            duration: 0.4,
                            ease: "power2.out",
                        },
                        0
                    );
                }

                // Animation for elements with data-blur-in-anime-stager
                const stagerinblurItems = wrapper.querySelectorAll(
                    "[data-blur-in-anime-stager]"
                );
                if (stagerinblurItems.length > 0) {
                    tl.to(
                        stagerinblurItems,
                        {
                            filter: "blur(0px)",
                            opacity: 1,
                            duration: 0.4,
                            ease: "power2.out",
                        },
                        0.1
                    );
                }

                // Animation for elements with data-anime-in-opacity
                const inopacityItems = wrapper.querySelectorAll(
                    "[data-anime-in-opacity]"
                );
                if (inopacityItems.length > 0) {
                    tl.to(
                        inopacityItems,
                        {
                            opacity: 1,
                            duration: 0.5,
                            ease: "none",
                        },
                        0.15
                    );
                }

                // Animation for elements with data-image-scale
                const imgscaleItems = wrapper.querySelectorAll("[data-image-scale]");
                if (imgscaleItems.length > 0) {
                    tl.to(
                        imgscaleItems,
                        {
                            scale: 1,
                            duration: 0.4,
                            ease: "power2.out",
                        },
                        0.15
                    );
                }

                // Animation for elements with data-anime-in-scale
                const inscaleItems = wrapper.querySelectorAll("[data-anime-in-scale]");
                if (inscaleItems.length > 0) {
                    tl.to(
                        inscaleItems,
                        {
                            scale: 1,
                            opacity: 1,
                            duration: 1.5,
                            ease: "power2.out",
                        },
                        0
                    );
                }

                // Animation for elements with data-anime-in-scale-small
                const smallinscaleItems = wrapper.querySelectorAll(
                    "[data-anime-in-scale-small]"
                );
                if (smallinscaleItems.length > 0) {
                    tl.to(
                        smallinscaleItems,
                        {
                            scale: 1,
                            opacity: 1,
                            duration: 0.7,
                            ease: "power2.out",
                        },
                        0
                    );
                }

                // Animation for elements with data-anime-in-fade
                const infadeItems = wrapper.querySelectorAll("[data-anime-in-fade]");
                if (infadeItems.length > 0) {
                    tl.to(
                        infadeItems,
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power2.out",
                            stagger: 0.05,
                        },
                        0.05
                    );
                }

                // Animation for elements with data-anime-in-fade-big
                const biginfadeItems = wrapper.querySelectorAll(
                    "[data-anime-in-fade-big]"
                );
                if (biginfadeItems.length > 0) {
                    // Get the value from the first element's attribute or use 0.4 by default
                    const startTime =
                        parseFloat(
                            biginfadeItems[0].getAttribute("data-anime-in-fade-big")
                        ) || 0.2;

                    tl.to(
                        biginfadeItems,
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power2.out",
                            stagger: 0.1,
                        },
                        startTime
                    );
                }
            },
        });
    });
});