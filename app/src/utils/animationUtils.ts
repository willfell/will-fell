/**
 * Resets all animation classes and prepares for new animations
 */
export const resetAnimationClasses = () => {
    // Use a generic to ensure we get HTMLElements, not just Elements
    const animatedElements = document.querySelectorAll<HTMLElement>('.animate-on-load, .animate-on-scroll');
    
    // Remove the animation classes
    animatedElements.forEach(el => {
      el.classList.remove('animate-fadeIn');
      
      // Force a reflow to ensure the browser registers the class removal
      void el.offsetWidth;
    });
  };
  
  /**
   * Initialize animations for elements with animate-on-load class
   */
  export const initLoadAnimations = () => {
    const animateLoadElements = document.querySelectorAll<HTMLElement>('.animate-on-load');
    
    // Apply animations immediately with minimal delay
    animateLoadElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate-fadeIn');
      }, 50 * index); // Reduced delay between elements
    });
  };
  
  /**
   * Initialize animations for elements that should animate on scroll
   */
  export const initScrollAnimations = () => {
    const animateScrollElements = document.querySelectorAll<HTMLElement>('.animate-on-scroll');
    
    // Initial check for elements already in viewport - apply immediately
    checkScrollElements(animateScrollElements);
  
    // Also apply for any modal content
    const modalContent = document.querySelectorAll<HTMLElement>('.project-modal .animate-on-scroll');
    modalContent.forEach(el => {
      el.classList.add('animate-fadeIn');
    });
    
    // Setup scroll listener
    const scrollHandler = () => checkScrollElements(animateScrollElements);
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    // Return cleanup function
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  };
  
  /**
   * Check which elements should be animated based on scroll position
   * Reduced threshold to make elements appear sooner
   */
  const checkScrollElements = (elements: NodeListOf<HTMLElement>) => {
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 200; // Increased visibility threshold
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('animate-fadeIn');
      }
    });
  };
  
  /**
   * Main animation initialization function
   * Resets and initializes all animations
   */
  export const initPageAnimations = () => {
    // First, reset all animation classes
    resetAnimationClasses();
    
    // Then initialize all animations with minimal delay to ensure DOM updates
    setTimeout(() => {
      initLoadAnimations();
      const cleanup = initScrollAnimations();
      
      // Store cleanup function on window to be called on page change
      const prevCleanup = window.animationCleanup;
      window.animationCleanup = () => {
        cleanup();
        if (prevCleanup) prevCleanup();
      };
    }, 10); // Reduced delay
    
    return () => {
      if (window.animationCleanup) {
        window.animationCleanup();
      }
    };
  };
  
  /**
   * Special function to immediately apply animations to modal content
   * Call this when a modal opens
   */
  export const applyModalAnimations = () => {
    const modalElements = document.querySelectorAll<HTMLElement>('.project-modal .animate-on-scroll, .modal-content > *');
    
    // Removed unused index parameter
    modalElements.forEach(el => {
      el.classList.add('animate-fadeIn');
    });
  };
  
  declare global {
    interface Window {
      animationCleanup?: () => void;
    }
  }