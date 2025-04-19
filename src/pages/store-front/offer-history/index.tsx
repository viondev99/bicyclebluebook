import React, { ComponentType, FC } from 'react';
import OfferHistoryContainer from 'components/StoreFront/OfferHistory/List/OfferHistoryContainer';
import AccountStoreFrontLayout from 'layout/Account/StoreFront';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ComponentStatic } from 'model/common';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { Roles } from 'constants/roles';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const OfferHistory = () => {
  return (
    <AccountStoreFrontLayout titleMobile="Offers">
      <OfferHistoryContainer />
    </AccountStoreFrontLayout>
  );
};

OfferHistory.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.ONLINE_STORE })(OfferHistory as FC<ComponentType & ComponentStatic>),
);
