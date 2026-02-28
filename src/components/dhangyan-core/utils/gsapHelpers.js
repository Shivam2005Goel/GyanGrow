import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Fade in animation with GSAP
 */
export const fadeIn = (element, options = {}) => {
    return gsap.from(element, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        ...options
    });
};

/**
 * Scale in animation
 */
export const scaleIn = (element, options = {}) => {
    return gsap.from(element, {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        ...options
    });
};

/**
 * Slide in from left
 */
export const slideInLeft = (element, options = {}) => {
    return gsap.from(element, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        ...options
    });
};

/**
 * Slide in from right
 */
export const slideInRight = (element, options = {}) => {
    return gsap.from(element, {
        x: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        ...options
    });
};

/**
 * Stagger animation for multiple elements
 */
export const staggerAnimation = (elements, options = {}) => {
    return gsap.from(elements, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        ...options
    });
};

/**
 * Page transition animation
 */
export const pageTransition = () => {
    const tl = gsap.timeline();

    tl.to('.page-transition', {
        scaleY: 1,
        duration: 0.5,
        ease: 'power3.inOut',
        transformOrigin: 'bottom'
    })
        .to('.page-transition', {
            scaleY: 0,
            duration: 0.5,
            ease: 'power3.inOut',
            transformOrigin: 'top'
        }, '+=0.3');

    return tl;
};

/**
 * Scroll-triggered animation
 */
export const scrollAnimation = (element, options = {}) => {
    return gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
            ...options.scrollTrigger
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        ...options
    });
};

/**
 * Parallax effect
 */
export const parallaxEffect = (element, speed = 0.5) => {
    return gsap.to(element, {
        y: () => window.innerHeight * speed,
        scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
};

export default {
    fadeIn,
    scaleIn,
    slideInLeft,
    slideInRight,
    staggerAnimation,
    pageTransition,
    scrollAnimation,
    parallaxEffect
};
