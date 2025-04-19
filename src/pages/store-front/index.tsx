import React from 'react';
import { NextPageContext } from 'next';

import { universalRedirect } from 'helpers/ssr.helper';

export default function Storefront() {
  return <div>hello</div>;
}

Storefront.getInitialProps = async (ctx: NextPageContext) => {
  await universalRedirect(ctx)('/store-front/dashboards');
};
