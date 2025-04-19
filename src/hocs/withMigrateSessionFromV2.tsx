import React, { ComponentType } from 'react';
import CookieBrowser from 'js-cookie';
import { AppContext, AppInitialProps } from 'next/app';
import { COOKIE_OPTION, V2_TOKEN_KEY, V2_USER_KEY, V3_TOKEN_KEY, V3_USER_KEY } from '../constants/common';
import { checkExistLocalStorage } from 'helpers/utilities.helper';

type WrappedComponent = ComponentType & {
  getInitialProps?: (app: AppContext) => Promise<AppInitialProps>;
};

export function withMigrateSessionFromV2<CProps = any>(Wrapped: WrappedComponent) {
  return class WithMigrateSessionFromV2 extends React.PureComponent<CProps & { pageProps: any }> {
    static async getInitialProps(props: AppContext) {
      return {
        pageProps: { ...(Wrapped.getInitialProps ? await Wrapped.getInitialProps(props) : {}) },
      };
    }

    constructor(props: CProps & { pageProps: any }) {
      super(props);
      if (typeof window !== 'undefined') {
        // check for first time from v2 to v3
        const v2Token = checkExistLocalStorage() ? localStorage.getItem(V2_TOKEN_KEY) : null;
        if (v2Token) {
          // if token exist from v2
          localStorage.removeItem(V2_TOKEN_KEY); // we remove it from local storage
          CookieBrowser.set(V3_TOKEN_KEY, v2Token, COOKIE_OPTION); // and move to cookie for v3
          const v2User = localStorage.getItem(V2_USER_KEY);
          localStorage.removeItem(V2_USER_KEY); // we remove it from local storage
          CookieBrowser.set(V3_USER_KEY, v2User, COOKIE_OPTION); // and move to cookie for v3
          window.location.reload(); // reload for apply changes
        }
      }
    }

    render() {
      const { pageProps, ...other } = this.props;
      return <Wrapped {...pageProps} {...other} />;
    }
  };
}
