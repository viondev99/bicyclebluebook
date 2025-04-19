/* eslint-disable no-empty */
import React, { ComponentType, FC } from 'react';
import { AppContext, AppInitialProps, AppProps } from 'next/app';
import { checkBlockVPN, checkBlockVPNFromServerSide } from 'api/common.api';
import { isProduction } from 'helpers/utilities.helper';
import { isServerSide, universalRedirect } from '../helpers/ssr.helper';

type WrappedComponent = ComponentType & {
  getInitialProps?: (app: AppContext) => Promise<AppInitialProps>;
};

interface AppComponent {
  getInitialProps: ({ Component, ctx }: AppContext) => Promise<AppInitialProps>;
}

export function withBlockIpChecked<Props = any>(Wrapped: WrappedComponent) {
  const WithBlockIpChecked: FC<Props & AppProps> & AppComponent = (props) => {
    const { pageProps, ...other } = props;
    return <Wrapped {...pageProps} {...other} />;
  };
  WithBlockIpChecked.getInitialProps = async (props: AppContext) => {
    if (isProduction()) {
      if (isServerSide()) {
        if (
          props.ctx.pathname.includes('/marketplace/buy-now') ||
          props.ctx.pathname.includes('/store-front/mylistings/create/bicycle') ||
          props.ctx.pathname.includes('/account/mylistings/create')
        ) {
          try {
            const ip = props.ctx.req.headers['x-forwarded-for'] || props.ctx.req.connection.remoteAddress;
            if (ip) {
              const response = await checkBlockVPNFromServerSide(String(ip));
              if (response && response.isBlocked) {
                if (props.ctx.pathname !== '/blocked') {
                  await universalRedirect(props.ctx)('/blocked', 302);
                  return;
                }
              }
              if (response && !response.isBlocked && props.ctx.pathname === '/blocked') {
                await universalRedirect(props.ctx)('/', 302);
              }
            }
          } catch (error) {}
        }
      } else if (
        !props.router.pathname.includes('/marketplace/buy-now') &&
        !props.router.pathname.includes('/store-front/mylistings/create/bicycle') &&
        !props.router.pathname.includes('/account/mylistings/create') &&
        (props.ctx.pathname.includes('/marketplace/buy-now') ||
          props.ctx.pathname.includes('/store-front/mylistings/create/bicycle') ||
          props.ctx.pathname.includes('/account/mylistings/create'))
      ) {
        const response = await checkBlockVPN();
        if (response && response.isBlocked) {
          if (props.ctx.pathname !== '/blocked') {
            await universalRedirect(props.ctx)('/blocked', 302);
            return;
          }
        }
        if (response && !response.isBlocked && props.ctx.pathname === '/blocked') {
          await universalRedirect(props.ctx)('/', 302);
        }
      }
    }
    return {
      pageProps: { ...(Wrapped.getInitialProps ? await Wrapped.getInitialProps(props) : {}) },
    };
  };
  return WithBlockIpChecked;
}
