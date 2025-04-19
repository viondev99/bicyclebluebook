import React from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import CookiePolicyPage from 'components/Policy/Cookie';
import Head from 'next/head';

function CookiePolicy() {
  return (
    <>
      <Head>
        <title>Cookie Policy</title>
        <meta name="description" content="Cookie Policy" />
      </Head>
      <CookiePolicyPage />
    </>
  );
}

export default CookiePolicy;
CookiePolicy.renderLayout = renderMainLayout;
