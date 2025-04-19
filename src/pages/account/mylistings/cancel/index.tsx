import React, { useEffect } from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import AccountPersonalLayout from 'layout/Account/Personal';
import ListingsComponent from 'components/Account/Personal/MyListing/Cancel';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { Roles } from 'constants/roles';
import { useRouter } from 'next/router';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';

function Listings() {
  const { replace, query } = useRouter();

  useEffect(() => {
    if (!query || !Object.keys(query).length) {
      replace({
        pathname: '/account/mylistings/cancel',
        query: {
          statuses: 'CANCELLED',
        },
      });
    }
  }, [query, replace]);

  return (
    <AccountPersonalLayout titleMobile="Listings">
      <ListingsComponent />
    </AccountPersonalLayout>
  );
}

Listings.renderLayout = renderMainLayout;

export default withInjectAllSaga(withAuthenticate({ role: Roles.PERSONAL })(Listings));
