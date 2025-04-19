import React from 'react';
import Head from 'next/head';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import PrivacyPolicyPage from 'components/Policy/PrivacyPolicy';

function TermsPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
        <meta name="description" content="PRIVACY POLICY" />
      </Head>
      <PrivacyPolicyPage />
    </>
  );
}

export default TermsPolicy;
TermsPolicy.renderLayout = renderMainLayout;
