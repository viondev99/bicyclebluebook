import React from 'react';
import Head from 'next/head';

import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import CareersPage from 'components/Careers/CareersContainer';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

function Careers() {
  return (
    <>
      <Head>
        <title>Jobs - Used Bikes for Sale - BicycleBlueBook</title>
        <meta name="description" content="Jobs" />
      </Head>
      <CareersPage />
    </>
  );
}

Careers.renderLayout = renderMainLayout;
export default withInjectAllSaga(Careers);
