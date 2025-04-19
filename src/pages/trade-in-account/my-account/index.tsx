import React from 'react';
import { NextPageContext } from 'next';
import { universalRedirect } from 'helpers/ssr.helper';

export default function MyAccount() {
  return <div>Bicycle Blue Book</div>;
}

MyAccount.getInitialProps = async (ctx: NextPageContext) => {
  await universalRedirect(ctx)('/trade-in-account/my-account/profile');
};
