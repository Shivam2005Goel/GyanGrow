import React, { useRef, useEffect, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Shuffle.css';

gsap.registerPlugin(ScrollTrigger);

const Shuffle = ({
  text,
  className = '',
  style = {},
  shuffleDirection = 'right',
  duration = 0.35,
  ease = 'power3.out',
  threshold = 0.1,
  tag = 'h1',
  onShuffleComplete,
  shuffleTimes = 2,
  animationMode = 'evenodd',
  stagger = 0.04,
  triggerOnce = true,
  respectReducedMotion = true,
  triggerOnHover = true
}) => {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const wrappersRef = useRef([]);
  const tlRef = useRef(null);
  const playingRef = useRef(false);
  const hoverHandlerRef = useRef(null);

  const scrollTriggerStart = useMemo(() => {
    const startPct = (1 - threshold) * 100;
    return `top ${startPct}%`;
  }, [threshold]);

  useEffect(() => {
    if (!ref.current || !text) return;
    
    // Check for reduced motion preference
    if (respectReducedMotion && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReady(true);
      onShuffleComplete?.();
      return;
    }

    const el = ref.current;

    const removeHover = () => {
      if (hoverHandlerRef.current && ref.current) {
        ref.current.removeEventListener('mouseenter', hoverHandlerRef.current);
        hoverHandlerRef.current = null;
      }
    };

    const teardown = () => {
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
      wrappersRef.current.forEach(wrap => {
        const inner = wrap.firstElementChild;
        const orig = inner?.querySelector('[data-orig="1"]');
        if (orig && wrap.parentNode) {
          wrap.parentNode.replaceChild(orig, wrap);
        }
      });
      wrappersRef.current = [];
      playingRef.current = false;
    };

    const splitText = () => {
      const textContent = el.textContent || '';
      el.innerHTML = '';
      
      const chars = textContent.split('').map((char) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.className = 'shuffle-char';
        span.style.display = 'inline-block';
        el.appendChild(span);
        return span;
      });
      
      return chars;
    };

    const build = () => {
      teardown();

      const chars = splitText();
      wrappersRef.current = [];

      const rolls = Math.max(1, Math.floor(shuffleTimes));

      chars.forEach((ch) => {
        const parent = ch.parentElement;
        if (!parent) return;

        const rect = ch.getBoundingClientRect();
        const w = rect.width || 20;
        const h = rect.height || 40;
        if (!w && !h) return;

        const wrap = document.createElement('span');
        wrap.className = 'shuffle-char-wrapper';
        Object.assign(wrap.style, {
          display: 'inline-block',
          overflow: 'hidden',
          width: w + 'px',
          height: shuffleDirection === 'up' || shuffleDirection === 'down' ? h + 'px' : 'auto',
          verticalAlign: 'bottom'
        });

        const inner = document.createElement('span');
        Object.assign(inner.style, {
          display: 'inline-block',
          whiteSpace: 'nowrap',
          willChange: 'transform'
        });

        parent.insertBefore(wrap, ch);
        wrap.appendChild(inner);

        const firstOrig = ch.cloneNode(true);
        Object.assign(firstOrig.style, {
          display: 'inline-block',
          width: w + 'px',
          textAlign: 'center'
        });

        ch.setAttribute('data-orig', '1');
        Object.assign(ch.style, {
          display: 'inline-block',
          width: w + 'px',
          textAlign: 'center'
        });

        inner.appendChild(firstOrig);
        
        // Add scrambled characters
        for (let k = 0; k < rolls; k++) {
          const c = ch.cloneNode(true);
          // Random character for shuffle effect
          const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          c.textContent = randomChars.charAt(Math.floor(Math.random() * randomChars.length));
          Object.assign(c.style, {
            display: 'inline-block',
            width: w + 'px',
            textAlign: 'center'
          });
          inner.appendChild(c);
        }
        inner.appendChild(ch);

        const steps = rolls + 1;

        // Rearrange for shuffle direction
        if (shuffleDirection === 'right' || shuffleDirection === 'down') {
          const firstCopy = inner.firstElementChild;
          const real = inner.lastElementChild;
          if (real) inner.insertBefore(real, inner.firstChild);
          if (firstCopy) inner.appendChild(firstCopy);
        }

        let startX = 0, finalX = 0, startY = 0, finalY = 0;

        if (shuffleDirection === 'right') {
          startX = -steps * w;
          finalX = 0;
        } else if (shuffleDirection === 'left') {
          startX = 0;
          finalX = -steps * w;
        } else if (shuffleDirection === 'down') {
          startY = -steps * h;
          finalY = 0;
        } else if (shuffleDirection === 'up') {
          startY = 0;
          finalY = -steps * h;
        }

        if (shuffleDirection === 'left' || shuffleDirection === 'right') {
          gsap.set(inner, { x: startX, y: 0, force3D: true });
          inner.setAttribute('data-start-x', String(startX));
          inner.setAttribute('data-final-x', String(finalX));
        } else {
          gsap.set(inner, { x: 0, y: startY, force3D: true });
          inner.setAttribute('data-start-y', String(startY));
          inner.setAttribute('data-final-y', String(finalY));
        }

        wrappersRef.current.push(wrap);
      });
    };

    const inners = () => wrappersRef.current.map(w => w.firstElementChild).filter(Boolean);

    const cleanupToStill = () => {
      wrappersRef.current.forEach(w => {
        const strip = w.firstElementChild;
        if (!strip) return;
        const real = strip.querySelector('[data-orig="1"]');
        if (!real) return;
        strip.replaceChildren(real);
        strip.style.transform = 'none';
        strip.style.willChange = 'auto';
      });
    };

    const play = () => {
      const strips = inners();
      if (!strips.length) return;

      playingRef.current = true;
      const isVertical = shuffleDirection === 'up' || shuffleDirection === 'down';

      const tl = gsap.timeline({
        smoothChildTiming: true,
        onComplete: () => {
          playingRef.current = false;
          cleanupToStill();
          onShuffleComplete?.();
          armHover();
        }
      });

      const addTween = (targets, at) => {
        const vars = {
          duration,
          ease,
          force3D: true,
          stagger: animationMode === 'evenodd' ? stagger : 0
        };
        if (isVertical) {
          vars.y = (i, t) => parseFloat(t.getAttribute('data-final-y') || '0');
        } else {
          vars.x = (i, t) => parseFloat(t.getAttribute('data-final-x') || '0');
        }

        tl.to(targets, vars, at);
      };

      if (animationMode === 'evenodd') {
        const odd = strips.filter((_, i) => i % 2 === 1);
        const even = strips.filter((_, i) => i % 2 === 0);
        const oddTotal = duration + Math.max(0, odd.length - 1) * stagger;
        const evenStart = odd.length ? oddTotal * 0.7 : 0;
        if (odd.length) addTween(odd, 0);
        if (even.length) addTween(even, evenStart);
      } else {
        strips.forEach(strip => {
          const d = Math.random() * 0.5;
          const vars = { duration, ease, force3D: true };
          if (isVertical) {
            vars.y = parseFloat(strip.getAttribute('data-final-y') || '0');
          } else {
            vars.x = parseFloat(strip.getAttribute('data-final-x') || '0');
          }
          tl.to(strip, vars, d);
        });
      }

      tlRef.current = tl;
    };

    const armHover = () => {
      if (!triggerOnHover || !ref.current) return;
      removeHover();
      const handler = () => {
        if (playingRef.current) return;
        build();
        play();
      };
      hoverHandlerRef.current = handler;
      ref.current.addEventListener('mouseenter', handler);
    };

    const create = () => {
      build();
      play();
      armHover();
      setReady(true);
    };

    const st = ScrollTrigger.create({
      trigger: el,
      start: scrollTriggerStart,
      once: triggerOnce,
      onEnter: create
    });

    return () => {
      st.kill();
      removeHover();
      teardown();
      setReady(false);
    };
  }, [text, duration, ease, scrollTriggerStart, shuffleDirection, shuffleTimes, animationMode, stagger, triggerOnce, respectReducedMotion, triggerOnHover, onShuffleComplete]);

  const Tag = tag;
  return (
    <Tag 
      ref={ref} 
      className={`shuffle-parent ${ready ? 'is-ready' : ''} ${className}`}
      style={{ textAlign: 'center', ...style }}
    >
      {text}
    </Tag>
  );
};

export default Shuffle;
