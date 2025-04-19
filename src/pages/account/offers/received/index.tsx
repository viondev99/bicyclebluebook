import React, { ComponentType, FC } from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import OffersReceivedComponent from 'components/Account/Personal/Offers/Received';
import AccountPersonalLayout from 'layout/Account/Personal';
import { ComponentStatic } from 'model/common';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';

const OffersMade = () => {
  return (
    <AccountPersonalLayout titleMobile="Offers">
      <OffersReceivedComponent />
    </AccountPersonalLayout>
  );
};

OffersMade.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.PERSONAL })(OffersMade as FC<ComponentType & ComponentStatic>),
);
