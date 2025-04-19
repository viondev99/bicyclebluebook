import React from 'react';
import { NextPageContext } from 'next';
import { universalRedirect } from '../../../../helpers/ssr.helper';

export default function PD() {
  return <div>Bicycle Blue Book</div>;
}

PD.getInitialProps = async (ctx: NextPageContext) => {
  const { slug } = ctx.query;
  await universalRedirect(ctx)(`/marketplace/buy-now/${slug}/`);
};
