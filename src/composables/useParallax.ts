import { ref, onMounted, onUnmounted } from 'vue'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useParallax() {
    const lenis = ref<Lenis | null>(null)

    onMounted(() => {
        // Initialize smooth scroll
        // lenis.value = new Lenis({
        //     duration: 1.2,
        //     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        //     direction: 'vertical',
        //     gestureDirection: 'vertical',
        //     smooth: true,
        //     smoothTouch: false,
        //     touchMultiplier: 2
        // })

        // Connect GSAP ScrollTrigger with Lenis
        // lenis.value.on('scroll', ScrollTrigger.update)

        // gsap.ticker.add((time) => {
        //     lenis.value?.raf(time * 1000)
        // })

        initAnimations()
    })

    const initAnimations = () => {
        // Reset any existing ScrollTrigger instances
        ScrollTrigger.getAll().forEach(st => st.kill())

        // Set initial visibility
        gsap.set(['.hero-content', '.hero-content h1', '.hero-subtitle', '.hero-image', '.feature-card', '.testimonial-card', '.pricing-card', '.footer-column'], {
            opacity: 1,
            y: 0,
            x: 0
        })

        // Hero section animations
        const heroTl = gsap.timeline()
        heroTl.from('.hero-content', {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        })
            .from('.hero-image', {
                opacity: 0,
                x: 50,
                duration: 1,
                ease: 'power3.out'
            }, '-=0.5')

        // Features section
        gsap.from('.feature-card', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.features-grid',
                start: 'top center+=100',
                toggleActions: 'play none none none'
            }
        })

        // Testimonials section
        gsap.from('.testimonial-card', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.testimonials-grid',
                start: 'top center+=100',
                toggleActions: 'play none none none'
            }
        })

        // Pricing section
        gsap.from('.pricing-card', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.pricing-grid',
                start: 'top center+=100',
                toggleActions: 'play none none none'
            }
        })

        // Footer animations
        gsap.from('.footer-column', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.footer-links',
                start: 'top bottom-=100',
                toggleActions: 'play none none none'
            }
        })
    }

    onUnmounted(() => {
        if (lenis.value) {
            lenis.value.destroy()
        }
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    })

    return {
        lenis
    }
}