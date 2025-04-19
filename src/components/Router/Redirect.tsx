import React, { FC, useEffect } from 'react';
import { UrlObject } from 'url';
import { useRouter } from 'next/router';

interface Props {
  to: string | UrlObject;
  as?: string | UrlObject;
  replace?: boolean;
}

const Redirect: FC<Props> = ({ to, as, replace }) => {
  const router = useRouter();
  useEffect(() => {
    const method = replace ? router.replace : router.push;
    method(to, as);
  }, []);
  return null;
};

export default Redirect;
