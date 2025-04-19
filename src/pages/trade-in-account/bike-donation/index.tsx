import React, { FC } from 'react';
import BikeDonationContainer from 'components/PartnerPortal/BikeDonation';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import PartnerPortalLayout from 'layout/Account/Partner';
import { NextPageContext } from 'next';
import { universalRedirect } from 'helpers/ssr.helper';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const BikeDonation: FC & ComponentStatic = () => {
  return (
    <PartnerPortalLayout titleMobile={'Bike Donation'}>
      <BikeDonationContainer />
    </PartnerPortalLayout>
  );
};

BikeDonation.renderLayout = renderMainLayout;

BikeDonation.getInitialProps = async (ctx: NextPageContext) => {
  await universalRedirect(ctx)('/trade-in-account/tp-dashboard');
};

export default withInjectAllSaga(BikeDonation);
