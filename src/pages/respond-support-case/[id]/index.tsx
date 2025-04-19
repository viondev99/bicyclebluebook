import React from 'react';
import Head from 'next/head';

import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import RespondSupport from 'components/RespondSupport/RespondSupport';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

function RespondSupportPage() {
  return (
    <>
      <Head>
        <title>Respond Support Case</title>
        <meta name="description" content={`Respond Support Case`} />
      </Head>
      <div className="wrapper-with-header extra-light-container">
        <RespondSupport />
      </div>
    </>
  );
}

RespondSupportPage.renderLayout = renderMainLayout;
export default withInjectAllSaga(RespondSupportPage);
