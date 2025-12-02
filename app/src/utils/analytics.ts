// Plausible Analytics utility for tracking user interactions
declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string> }
    ) => void;
  }
}

/**
 * Track a custom event in Plausible Analytics
 * @param event - The event name (e.g., "Hero CTA Click")
 * @param props - Optional properties to attach to the event
 */
export const trackEvent = (event: string, props?: Record<string, string>) => {
  if (typeof window !== "undefined" && window.plausible) {
    window.plausible(event, props ? { props } : undefined);
  }
};
