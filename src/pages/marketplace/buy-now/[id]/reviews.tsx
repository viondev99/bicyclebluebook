import React from 'react';
import { NextPageContext } from 'next';
import { universalRedirect } from 'helpers/ssr.helper';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';

function Reviews() {
  return <div>Bicycle Blue Book</div>;
}

Reviews.getInitialProps = async (ctx: NextPageContext) => {
  await universalRedirect(ctx)(`/marketplace/buy-now/${String(ctx.query.id)}`);
};
export default withInjectAllSaga(Reviews);
