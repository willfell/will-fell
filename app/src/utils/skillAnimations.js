// src/utils/skillAnimations.js

// Only run this code on the client side
if (typeof window !== 'undefined') {
    // Function to initialize skill animations
    const initSkillAnimations = () => {
      console.log('Initializing skill animations');
  
      // First reset all bars to 0 width to ensure animation starts fresh
      document.querySelectorAll('.skill-progress-bar').forEach(bar => {
        bar.style.width = '0%';
      });
      
      // Set up intersection observer for skill sections
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Add visible class to the section
            entry.target.classList.add('in-view');
            
            console.log('Section in view:', entry.target);
            
            // Get all skill progress bars within the visible section
            const skillBars = entry.target.querySelectorAll('.skill-progress-bar');
            
            console.log('Found skill bars:', skillBars.length);
            
            // Animate each skill bar to its target width with staggered delay
            skillBars.forEach((bar, index) => {
              // Get the target width from the data attribute
              const targetWidth = bar.getAttribute('data-width');
              
              console.log('Animating bar to width:', targetWidth);
              
              // Animate to the target width with a staggered delay
              setTimeout(() => {
                bar.style.width = targetWidth;
              }, 200 + (index * 50)); // Stagger animations with 50ms between each bar
            });
          }
        });
      }, { threshold: 0.2 }); // Trigger when 20% of the element is visible
      
      // Observe all skill sections
      const sections = document.querySelectorAll('.skills-section');
      console.log('Found skill sections:', sections.length);
      
      sections.forEach(section => {
        observer.observe(section);
      });
    };
  
    // Function to run on page navigation or any time we want to manually trigger
    const handleRouteChange = () => {
      console.log('Route changed, reinitializing animations');
      // First give the DOM time to update
      setTimeout(initSkillAnimations, 300);
    };
    
    // Initialize animations when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing animations');
        // Wait a bit longer for React to hydrate and render
        setTimeout(initSkillAnimations, 500);
      });
    } else {
      // DOM already loaded, give React time to hydrate
      console.log('DOM already loaded, initializing animations after delay');
      setTimeout(initSkillAnimations, 500);
    }
    
    // Listen for route changes
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', handleRouteChange);
      window.addEventListener('popstate', handleRouteChange);
      document.addEventListener('scroll', () => {
        // Debounce scroll events
        clearTimeout(window.scrollTimer);
        window.scrollTimer = setTimeout(initSkillAnimations, 200);
      });
    }
  }
  
  export {}; // Ensure this is treated as a module