import React, { ComponentType, FC } from 'react';

import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import StorefrontLayout from 'layout/Account/StoreFront';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ComponentStatic } from 'model/common';
import PaymentInfo from 'components/Payment/PaymentInfo/PaymentInfo';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const StorefrontPayment: FC & ComponentStatic = () => {
  return (
    <StorefrontLayout titleMobile="Payment">
      <PaymentInfo />
    </StorefrontLayout>
  );
};

StorefrontPayment.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.ONLINE_STORE })(StorefrontPayment as FC<ComponentType & ComponentStatic>),
);
