import React from 'react';
import Head from 'next/head';

import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import TermsPage from 'components/Policy/Terms';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

function TermsPolicy() {
  return (
    <>
      <Head>
        <title>Terms Of User</title>
        <meta name="description" content={`Terms Of User`} />
      </Head>
      <TermsPage />
    </>
  );
}

TermsPolicy.renderLayout = renderMainLayout;
export default withInjectAllSaga(TermsPolicy);
