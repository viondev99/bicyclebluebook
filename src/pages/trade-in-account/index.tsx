import React from 'react';
import { NextPageContext } from 'next';
import { universalRedirect } from 'helpers/ssr.helper';

export default function TradeInAccount() {
  return <div>Bicycle Blue Book</div>;
}

TradeInAccount.getInitialProps = async (ctx: NextPageContext) => {
  await universalRedirect(ctx)('/trade-in-account/tp-dashboard');
};
