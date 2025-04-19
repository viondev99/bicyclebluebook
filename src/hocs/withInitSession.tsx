import React, { ComponentType, FC } from 'react';
import cookies from 'next-cookies';
import { AppContext, AppInitialProps, AppProps } from 'next/app';
import CookieBrowser from 'js-cookie';
import { V3_TOKEN_KEY, V3_USER_KEY, V3_BICYCLE_OUTLET_TOKEN_KEY } from '../constants/common';
import { initSession } from '../store/authenticate/authenticate.action';

type WrappedComponent = ComponentType & {
  getInitialProps?: (app: AppContext) => Promise<AppInitialProps>;
};

interface AppComponent {
  getInitialProps: ({ Component, ctx }: AppContext) => Promise<AppInitialProps>;
}

export function withInitSession<Props = any>(Wrapped: WrappedComponent) {
  const WithInitSession: FC<Props & AppProps> & AppComponent = (props) => {
    const { pageProps, ...other } = props;
    return <Wrapped {...pageProps} {...other} />;
  };
  WithInitSession.getInitialProps = async (props: AppContext) => {
    const token = CookieBrowser.get(V3_BICYCLE_OUTLET_TOKEN_KEY)
      ? cookies(props.ctx)[V3_BICYCLE_OUTLET_TOKEN_KEY]
      : cookies(props.ctx)[V3_TOKEN_KEY];
    const user = cookies(props.ctx)[V3_USER_KEY];
    if (token && user) {
      props.ctx.store.dispatch(initSession({ token, user }));
    } else {
      props.ctx.store.dispatch(initSession({ token: '', user: undefined }));
    }
    return {
      pageProps: { ...(Wrapped.getInitialProps ? await Wrapped.getInitialProps(props) : {}) },
    };
  };
  return WithInitSession;
}
