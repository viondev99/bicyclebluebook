import React from 'react';
import { NextPageContext } from 'next';
import { universalRedirect } from 'helpers/ssr.helper';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

function Favorites() {
  return <div>Bicycle Blue Book</div>;
}

Favorites.getInitialProps = async (ctx: NextPageContext) => {
  await universalRedirect(ctx)(`/account/myfavorites`);
};
export default withInjectAllSaga(Favorites);
