import React from 'react';
import { NextPageContext } from 'next';

import { universalRedirect } from 'helpers/ssr.helper';

export default function Offers() {
  return <></>;
}

Offers.getInitialProps = async (ctx: NextPageContext) => {
  await universalRedirect(ctx)('/account/offers/made');
};
