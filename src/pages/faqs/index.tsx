import React from 'react';
import { NextPageContext } from 'next';
import { universalRedirect } from 'helpers/ssr.helper';

export default function FAQS() {
  return <div>Bicycle Blue Book</div>;
}

FAQS.getInitialProps = async (ctx: NextPageContext) => {
  await universalRedirect(ctx)(`/help#faqs`);
};
