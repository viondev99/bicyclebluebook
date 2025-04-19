import React from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import InstantPayoutLandingPage from 'components/InstantPayout/InstantPayoutLandingPage/InstantPayoutLandingPage';
import Head from 'next/head';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

function InstantPayoutPage() {
  return (
    <>
      <Head>
        <title>Instant payout - Bicyclebluebook.com</title>
      </Head>
      <InstantPayoutLandingPage />
    </>
  );
}

InstantPayoutPage.renderLayout = renderMainLayout;

export default withInjectAllSaga(InstantPayoutPage);
