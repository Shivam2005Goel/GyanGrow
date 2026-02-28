import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

/**
 * Initialize AOS (Animate On Scroll) library
 * Call this in your main App component
 */
export const initAOS = () => {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100,
    });
};

/**
 * Custom hook to initialize AOS
 */
export const useAOS = () => {
    useEffect(() => {
        initAOS();
        return () => {
            AOS.refresh();
        };
    }, []);
};

/**
 * Refresh AOS when content changes
 */
export const refreshAOS = () => {
    AOS.refresh();
};

export default useAOS;
