import { NextPageContext } from 'next';
import Router from 'next/router';

export function isClientSide() {
  return !!process.browser;
}

export function isServerSide() {
  return !isClientSide();
}

export function universalRedirect(ctx: NextPageContext) {
  return async function handleRedirect(url: string, status: number = 301): Promise<any> {
    if (isClientSide()) {
      await Router.push(url, url);
    } else {
      ctx.res.writeHead(status, { Location: url });
      ctx.res.end();
    }
  };
}
