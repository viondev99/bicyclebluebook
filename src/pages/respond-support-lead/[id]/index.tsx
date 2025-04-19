import React from 'react';
import Head from 'next/head';
import RespondSupportLead from 'components/RespondSupportLead/RespindSupportLead';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { withInjectAllSaga } from 'hocs/withAllSagaInjected';

function RespondSupportLeadPage() {
  return (
    <>
      <Head>
        <title>Respond Support Lead</title>
        <meta name="description" content={`Respond Support Lead`} />
      </Head>
      <div className="wrapper-with-header extra-light-container">
        <RespondSupportLead />
      </div>
    </>
  );
}

RespondSupportLeadPage.renderLayout = renderMainLayout;
export default withInjectAllSaga(RespondSupportLeadPage);
