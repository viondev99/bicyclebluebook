import React from 'react';
import { NextPageContext } from 'next';
import { universalRedirect } from '../helpers/ssr.helper';
import config from '../config';

export default function PD() {
  return <div>Bicycle Blue Book</div>;
}

PD.getInitialProps = async (ctx: NextPageContext) => {
  const { id } = ctx.query;
  await fetch(`${config.BASE_URL}auth/api/v1/partner/v1/${id}`)
    .then((response) => response.json())
    .then((data) => {
      if (data._id) {
        return universalRedirect(ctx)(`/trade-in/${data._id}`);
      }
      return universalRedirect(ctx)(`/404`, 302);
    })
    .catch(() => {
      return universalRedirect(ctx)(`/404`, 302);
    });
};
