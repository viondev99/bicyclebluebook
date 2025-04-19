import React, { useEffect } from 'react';

import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { useRouter } from 'next/router';
import { renderMainLayout } from '../../../../layout/MainLayout/MainLayout';
import AccountPersonalLayout from '../../../../layout/Account/Personal';
import ListingsComponent from '../../../../components/Account/Personal/MyListing/Sold';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';

function Listings() {
  const { query, replace } = useRouter();

  useEffect(() => {
    if (!query || !Object.keys(query).length) {
      replace({
        pathname: '/account/mylistings/sold',
        query: {
          statuses: 'SOLD',
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
