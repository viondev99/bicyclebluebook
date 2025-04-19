import React, { FC, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import config from '../../config';

const Canonical: FC = () => {
  const router = useRouter();
  const url = useMemo(() => new URL(router.asPath, config.WEB_URL), [router.asPath]);
  const { pathname, origin, search } = url;
  const pathNameWithoutTrailingSlash = useMemo(() => {
    if (/^.+\/$/.test(pathname)) {
      const newPathname = pathname.replace(/\/$/, '');
      return newPathname?.slice(-1) === '/' ? newPathname : `${newPathname}/`;
    }
    return pathname?.slice(-1) === '/' ? pathname : `${pathname}/`;
  }, [pathname]);
  return (
    <Head>
      <link rel={'canonical'} href={`${origin}${pathNameWithoutTrailingSlash}${search}`} />
    </Head>
  );
};

export default Canonical;
