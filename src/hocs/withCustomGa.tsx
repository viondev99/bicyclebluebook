/* eslint-disable no-empty */
import React, { ComponentType, FC } from 'react';
import { AppContext, AppInitialProps, AppProps } from 'next/app';
import { setCustomGaRequest } from 'helpers/customGaService.helper';

type WrappedComponent = ComponentType & {
  getInitialProps?: (app: AppContext) => Promise<AppInitialProps>;
};

interface AppComponent {
  getInitialProps: ({ Component, ctx }: AppContext) => Promise<AppInitialProps>;
}

export function withCustomGa<Props = any>(Wrapped: WrappedComponent) {
  const WithCustomGa: FC<Props & AppProps> & AppComponent = (props) => {
    const { pageProps, ...other } = props;
    if (
      !other.router.asPath.includes(`/cart`) &&
      !other.router.asPath.includes(`/checkout/shipping`) &&
      !other.router.asPath.includes(`/checkout/payment`) &&
      !other.router.asPath.includes(`/checkout/success`)
    ) {
      setCustomGaRequest('page_view', {
        name: `${other.router.asPath}`,
        from: `${other.router.asPath}`,
      });
    }
    return <Wrapped {...pageProps} {...other} />;
  };
  WithCustomGa.getInitialProps = async (props: AppContext) => {
    return {
      pageProps: { ...(Wrapped.getInitialProps ? await Wrapped.getInitialProps(props) : {}) },
    };
  };
  return WithCustomGa;
}
