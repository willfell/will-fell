// _app.tsx
import 'tailwindcss/tailwind.css';
import '../globalStyles.scss';
import type { AppProps } from 'next/app';
import { memo, useEffect } from 'react';
import { useRouter } from 'next/router';

const MyApp = memo(({ Component, pageProps }: AppProps): JSX.Element => {
  const router = useRouter();
  
  useEffect(() => {
    // Dynamic import for client-side only code
    const importSkillAnimations = async () => {
      await import('../utils/skillAnimations');
    };
    
    importSkillAnimations();
    
    // Handle route changes
    const handleRouteChangeComplete = () => {
      // Re-initialize animations on route change
      // This will be picked up by the event listener in skillAnimations.js
      window.dispatchEvent(new Event('focus'));
    };
    
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  return (
    <>
      <Component {...pageProps} />
    </>
  );
});

export default MyApp;