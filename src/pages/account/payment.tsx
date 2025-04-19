import React, { ComponentType, FC } from 'react';

import { withAuthenticate } from 'hocs/withAuthenticate';
import { Roles } from 'constants/roles';
import GiftCardInfo from 'components/Payment/GiftCardInfo/GiftCardInfo';
import PaymentInfo from 'components/Payment/PaymentInfo/PaymentInfo';
import AccountPersonalLayout from '../../layout/Account/Personal';
import { renderMainLayout } from '../../layout/MainLayout/MainLayout';
import { ComponentStatic } from '../../model/common';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const Payment: FC & ComponentStatic = () => {
  return (
    <AccountPersonalLayout titleMobile="Payment">
      <>
        <PaymentInfo />
        <div className="mt-4">
          <GiftCardInfo />
        </div>
      </>
    </AccountPersonalLayout>
  );
};

Payment.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.PERSONAL })(Payment as FC<ComponentType & ComponentStatic>),
);
