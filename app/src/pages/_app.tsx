import "tailwindcss/tailwind.css";
import "../globalStyles.scss";
import type { AppProps } from "next/app";
import { memo, useEffect } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { resetAnimationClasses } from "../utils/animationUtils";

const MyApp = memo(({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    // Setup route change start handler
    const handleRouteChangeStart = () => {
      if (window.animationCleanup) {
        window.animationCleanup();
      }
      resetAnimationClasses();
    };

    // We removed the unused 'url' parameter here
    const handleRouteChangeComplete = async () => {
      resetAnimationClasses();
      try {
        const skillModule = await import("../utils/skillAnimations");
        if (skillModule.default) {
          window.runSkillsAnimation = skillModule.default;
          skillModule.default();
        }
        const { initPageAnimations } = await import("../utils/animationUtils");
        initPageAnimations();
      } catch (error) {
        console.error("Error loading animations:", error);
      }
    };

    // Initial animation setup
    const initialSetup = async () => {
      try {
        const skillModule = await import("../utils/skillAnimations");
        if (skillModule.default) {
          window.runSkillsAnimation = skillModule.default;
          skillModule.default();
        }
        const { initPageAnimations } = await import("../utils/animationUtils");
        initPageAnimations();
      } catch (error) {
        console.error("Error in initial animation setup:", error);
      }
    };

    initialSetup();

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      if (window.animationCleanup) {
        window.animationCleanup();
      }
    };
  }, [router]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={router.route}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Component {...pageProps} key={router.pathname} />
      </motion.div>
    </AnimatePresence>
  );
});

declare global {
  interface Window {
    runSkillsAnimation?: () => void;
    animationCleanup?: () => void;
  }
}

MyApp.displayName = "MyApp";
export default MyApp;
