import React from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import ProgramTermsPage from 'components/Policy/ProgramTerms';

function ProgramTerms() {
  return (
    <>
      <title>Bicyclebluebook.com Program</title>
      <meta name="description" content={`Bicycle Blue Book Program`} />
      <ProgramTermsPage />
    </>
  );
}

export default ProgramTerms;
ProgramTerms.renderLayout = renderMainLayout;
