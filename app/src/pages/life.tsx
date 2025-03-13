import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LifeRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to homepage if someone tries to access /life directly
    router.replace('/');
  }, [router]);

  return null;
}