// src/utils/skillAnimations.js
function handleSkillsAnimation() {
    // Get all skill progress bars
    const progressBars = document.querySelectorAll('.skill-progress-bar');
    
    if (progressBars.length === 0) {
      return; // No progress bars found, exit early
    }
  
    // Create IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-width') || '0%';
          
          // Set the CSS variable and add animation class
          bar.style.setProperty('--target-width', targetWidth);
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, 50);
          
          // Unobserve after animation starts
          observer.unobserve(bar);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe each progress bar
    progressBars.forEach(bar => {
      observer.observe(bar);
    });
    
    // Also handle fade-in animations for other elements
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(el => {
      fadeObserver.observe(el);
    });
  }
  
  // Initialize animations
  if (typeof window !== 'undefined') {
    // Run once DOM is loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(handleSkillsAnimation, 100);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(handleSkillsAnimation, 100);
      });
    }
    
    // Also run on window load to ensure all elements are rendered
    window.addEventListener('load', () => {
      setTimeout(handleSkillsAnimation, 100);
    });
    
    // Re-run when user scrolls (debounced)
    let scrollTimer;
    window.addEventListener('scroll', () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(handleSkillsAnimation, 100);
    });
  }
  
  export default handleSkillsAnimation;