"use client";

import { useEffect } from 'react';

const ScrollReveal = () => {
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
    
    const revealOnScroll = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once revealed, we can unobserve if we don't want repeat animations
          // revealOnScroll.unobserve(entry.target);
        } else {
          // If we want it to hide again when scrolling out (more dynamic)
          // entry.target.classList.remove('active');
        }
      });
    }, {
      threshold: 0.15, // Trigger when 15% of element is visible
      rootMargin: "0px 0px -50px 0px" // Trigger slightly before it enters the viewport
    });

    revealElements.forEach(el => revealOnScroll.observe(el));

    return () => {
      revealElements.forEach(el => revealOnScroll.unobserve(el));
    };
  }, []);

  return null; // This component just handles the side effect
};

export default ScrollReveal;
