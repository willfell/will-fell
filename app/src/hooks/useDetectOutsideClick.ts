import { useEffect, RefObject } from 'react';

/**
 * Hook that detects clicks outside of the specified element
 * @param ref - Reference to the element to monitor for outside clicks
 * @param handler - Callback function to execute when an outside click is detected
 */
const useDetectOutsideClick = (
  ref: RefObject<HTMLElement>,
  handler: () => void
): void => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Add escape key listener
    const handleEscKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        handler();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);

    // Clean up event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [ref, handler]);
};

export default useDetectOutsideClick;