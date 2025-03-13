import { useEffect } from "react";
import { headerID } from "../components/Sections/Header";
import { SectionId } from "../data/data";

export const useNavObserver = (
  selectors: string,
  handler: (section: SectionId | null) => void,
) => {
  useEffect(() => {
    // If selectors is empty, don't proceed with the observer
    if (!selectors || selectors.trim() === "") {
      // Reset the handler if needed
      handler(null);
      return;
    }

    // Add a small delay to ensure DOM elements are rendered
    const observerTimer = setTimeout(() => {
      // Get all sections
      const headings = document.querySelectorAll(selectors);
      const headingsArray = Array.from(headings);
      const headerWrapper = document.getElementById(headerID);

      // If no heading elements found or no header wrapper, don't proceed
      if (headingsArray.length === 0) {
        console.log("No headings found for selectors:", selectors);
        return;
      }

      if (!headerWrapper) {
        console.log("Header wrapper not found with ID:", headerID);
        return;
      }

      // Create the IntersectionObserver API
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const currentY = entry.boundingClientRect.y;
            const id = entry.target.getAttribute("id");

            if (headerWrapper && id) {
              // Create a decision object
              const decision = {
                id,
                currentIndex: headingsArray.findIndex(
                  (heading) => heading.getAttribute("id") === id,
                ),
                isIntersecting: entry.isIntersecting,
                currentRatio: entry.intersectionRatio,
                aboveToc: currentY < headerWrapper.getBoundingClientRect().y,
                belowToc: !(currentY < headerWrapper.getBoundingClientRect().y),
              };

              if (decision.isIntersecting) {
                // Header in view, update to current header
                handler(decision.id as SectionId);
              } else if (
                !decision.isIntersecting &&
                decision.currentRatio < 1 &&
                decision.currentRatio > 0 &&
                decision.belowToc &&
                decision.currentIndex > 0
              ) {
                const currentVisible =
                  headingsArray[decision.currentIndex - 1]?.getAttribute("id");
                if (currentVisible) {
                  handler(currentVisible as SectionId);
                }
              }
            }
          });
        },
        {
          root: null,
          threshold: 0.1,
          rootMargin: "0px 0px -50% 0px",
        },
      );

      // Observe all the Sections
      headings.forEach((section) => {
        observer.observe(section);
      });

      // Cleanup
      return () => {
        observer.disconnect();
      };
    }, 500); // Small delay to ensure DOM is ready

    return () => clearTimeout(observerTimer);
  }, [selectors, handler]); // Added handler as a dependency
};
