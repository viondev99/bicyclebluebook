import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import StoreState from 'model/store';
import { CommonComponents } from 'model/store/common.model';
import { getComponents } from 'store/common/common.action';
import { useRouter } from 'next/router';
import { getLoginLinkProps } from '../helpers/common.helper';

export function useLogin() {
  const router = useRouter();
  return useCallback(() => {
    const loginProps = getLoginLinkProps(router);
    router.push(loginProps.href, loginProps.as, {
      shallow: loginProps.shallow,
    });
  }, [router]);
}
