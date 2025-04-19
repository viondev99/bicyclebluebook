import React, { ComponentType, FC, useEffect } from 'react';
import ListingsHistory from 'components/StoreFront/Listings';
import AccountLayout from 'layout/Account/StoreFront';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ComponentStatic } from 'model/common';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { useRouter } from 'next/router';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const ManageReturnsPage = () => {
  const { replace, query } = useRouter();

  useEffect(() => {
    if (!query || !Object.keys(query).length) {
      replace({
        pathname: '/store-front/manage-returns',
        query: {
          statuses: 'CUSTOMER_RETURNED',
          page: 1,
          isManagerReturn: true,
        },
      });
    }
  }, [query, replace]);

  return (
    <AccountLayout titleMobile="Manage Returns">
      <ListingsHistory />
    </AccountLayout>
  );
};

ManageReturnsPage.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.ONLINE_STORE })(ManageReturnsPage as FC<ComponentType & ComponentStatic>),
);
