import { useEffect, useRef } from "react";

export function useIntersectionObserver(
  threshold = 0.2,
  rootMargin = "0px 0px -10% 0px",
) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("section-in-view");
            const progressBars = entry.target.querySelectorAll(
              ".skill-progress-bar",
            );
            progressBars.forEach((bar) => {
              const target = bar as HTMLElement;
              const width = target.dataset.width;
              if (width) {
                target.style.width = width;
              }
            });
          }
        });
      },
      {
        threshold: threshold,
        rootMargin: rootMargin,
      },
    );

    const section = sectionRef.current;
    if (section) {
      const animatableElements = section.querySelectorAll(".animate-on-scroll");
      animatableElements.forEach((el) => observer.observe(el));
    }

    return () => {
      if (section) {
        const animatableElements =
          section.querySelectorAll(".animate-on-scroll");
        animatableElements.forEach((el) => observer.unobserve(el));
      }
    };
  }, [threshold, rootMargin]);

  return sectionRef;
}
