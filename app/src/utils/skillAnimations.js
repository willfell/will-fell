// src/utils/skillAnimations.js
function handleSkillsAnimation() {
    // Get all skill progress bars
    const progressBars = document.querySelectorAll('.skill-progress-bar');
    
    if (progressBars.length === 0) {
      // No progress bars found yet, try again in a moment
      setTimeout(handleSkillsAnimation, 500);
      return;
    }
  
    console.log('Found progress bars:', progressBars.length);
    
    // Create IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-width') || '0%';
          
          console.log('Animating bar to width:', targetWidth);
          
          // Set the CSS variable and animate width
          bar.style.setProperty('--target-width', targetWidth);
          
          // Force layout reflow before animation
          bar.offsetWidth;
          
          // Apply the width after a small delay to ensure it animates
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, 100);
          
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
    // Run once on initial load with a sufficient delay
    if (document.readyState === 'complete') {
      handleSkillsAnimation();
    } else {
      window.addEventListener('load', () => {
        setTimeout(handleSkillsAnimation, 500);
      });
    }
    
    // Also run when components mount/update
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(handleSkillsAnimation, 500);
    });
    
    // Re-run when user scrolls (debounced)
    let scrollTimer;
    window.addEventListener('scroll', () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(handleSkillsAnimation, 100);
    });
    
    // Make sure it runs when navigating to the Resume section
    const resumeLinks = document.querySelectorAll('a[href*="resume"]');
    resumeLinks.forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(handleSkillsAnimation, 1000);
      });
    });
    
    // Export a function that can be manually called from components
    window.runSkillsAnimation = handleSkillsAnimation;
  }
  
  export default handleSkillsAnimation;