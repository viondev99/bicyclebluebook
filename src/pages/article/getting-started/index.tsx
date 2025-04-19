import React from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import GettingStarted from 'components/Article/GettingStarted';

function GettingStartedPage() {
  return <GettingStarted />;
}

export default GettingStartedPage;
GettingStartedPage.renderLayout = renderMainLayout;
