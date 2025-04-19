import React, { ComponentType, FC } from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import OffersMadeComponent from 'components/Account/Personal/Offers/Made';
import AccountPersonalLayout from 'layout/Account/Personal';
import { ComponentStatic } from 'model/common';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { Roles } from 'constants/roles';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';

const OffersMade = () => {
  return (
    <AccountPersonalLayout titleMobile="Offers">
      <OffersMadeComponent />
    </AccountPersonalLayout>
  );
};

OffersMade.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.PERSONAL })(OffersMade as FC<ComponentType & ComponentStatic>),
);
