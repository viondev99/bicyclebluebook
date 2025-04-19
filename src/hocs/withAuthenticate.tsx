import React, { ComponentType, FC, useCallback, useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { UrlObject } from 'url';

import { ComponentStatic } from '../model/common';
import StoreState from '../model/store';
import { Roles } from '../constants/roles';
import { decodeToken } from '../helpers/common.helper';

type WrappedComponent = ComponentType & ComponentStatic;

interface Options {
  requireAuth: boolean;
  role?: Roles;
  redirect?: UrlObject | string;
  redirectAs?: UrlObject | string;
  redirectOptions?: any;
}

const defaultOptions = {
  requireAuth: true,
};

export const withAuthenticate = <Props extends any>(options: Partial<Options> = {}) => (Wrapped: WrappedComponent) => {
  const WithAuthenticate: FC<Props & { pageProps: any }> & ComponentStatic = (props) => {
    const authOptions = { ...defaultOptions, ...options };
    const [ok, setOk] = useState(false);
    const router = useRouter();
    const { token, redirect, loggingIn } = useSelector((store: StoreState) => store.authenticate);
    const { role, storefront, partner } = useMemo(() => {
      const jwtPayload = decodeToken(token);
      if (jwtPayload) return jwtPayload;
      return {
        role: '',
        storefront: '',
        partner: '',
      };
    }, [token]);

    const userHasRole = useCallback(() => {
      if (authOptions.role) {
        switch (authOptions.role) {
          case Roles.ONLINE_STORE:
            return !!storefront;

          case Roles.PARTNER_ADMIN:
          case Roles.PARTNER_MANAGER:
          case Roles.PARTNER_EMPLOYEE:
            return !!partner;

          default:
            return authOptions.role === role;
        }
      }
      return true;
    }, [authOptions.role, partner, role, storefront]);
    const matchCondition = useCallback(() => {
      if (authOptions.requireAuth) {
        return !!token && userHasRole();
      }
      return !token;
    }, [authOptions.requireAuth, token, userHasRole]);
    useEffect(() => {
      if (matchCondition()) {
        setOk(true);
        return;
      }
      if (!token) {
        if (authOptions.redirect) {
          router.replace(authOptions.redirect, authOptions.redirectAs, authOptions.redirectOptions);
          return;
        }
        if (authOptions.requireAuth) {
          router.replace(
            { pathname: '/', query: { login: true, redirectUrl: router.asPath } },
            {
              pathname: '/login',
              query: { redirectUrl: router.asPath },
            },
          );
          return;
        }
      }
      if (!redirect && !loggingIn) {
        router.replace('/');
      }
    }, [
      authOptions.redirect,
      authOptions.redirectAs,
      authOptions.redirectOptions,
      authOptions.requireAuth,
      matchCondition,
      router,
      token,
      redirect,
      loggingIn,
    ]);
    const { pageProps, ...other } = props;
    return ok ? <Wrapped {...pageProps} {...other} /> : null;
  };
  WithAuthenticate.getInitialProps = async (props) => {
    return {
      pageProps: { ...(Wrapped.getInitialProps ? await Wrapped.getInitialProps(props) : {}) },
    };
  };
  WithAuthenticate.renderLayout = Wrapped.renderLayout;
  return WithAuthenticate;
};
