import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { isAuthenticated } from '../lib/authUtils';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const publicPaths = useMemo(() => ['/', '/login'], []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (!publicPaths.includes(url) && !isAuthenticated()) {
        router.push('/login');
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    if (!publicPaths.includes(router.pathname) && !isAuthenticated()) {
      router.push('/login');
    }

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router, publicPaths]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Teacher Portal</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

