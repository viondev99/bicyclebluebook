import React, { ComponentType, FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import ListingsHistory from 'components/StoreFront/Listings';
import AccountLayout from 'layout/Account/StoreFront';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ComponentStatic } from 'model/common';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const MyListingPage = () => {
  const { replace, query } = useRouter();

  useEffect(() => {
    if (!query || !Object.keys(query).length) {
      replace({
        pathname: '/store-front/cancellations',
        query: {
          statuses: 'CANCELLED',
          page: 1,
          isCancellations: true,
        },
      });
    }
  }, [query, replace]);

  return (
    <AccountLayout titleMobile="Cancellations">
      <ListingsHistory />
    </AccountLayout>
  );
};

MyListingPage.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.ONLINE_STORE })(MyListingPage as FC<ComponentType & ComponentStatic>),
);
