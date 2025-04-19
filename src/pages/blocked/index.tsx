import React from 'react';
import Head from 'next/head';
import AccessDenySection from 'components/AccessDeny/AccessDenySection';

function AccessDeny() {
  return (
    <div>
      <Head>
        <title>Access denied</title>
        <meta name="description" content="ACCESS DENIED" />
      </Head>
      <AccessDenySection />
    </div>
  );
}

export default AccessDeny;
AccessDeny.renderLayout = null;
