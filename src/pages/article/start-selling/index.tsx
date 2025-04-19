import React from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import StartSelling from 'components/Article/StartSelling';
function StartSellingPage() {
  return <StartSelling />;
}

export default StartSellingPage;
StartSellingPage.renderLayout = renderMainLayout;
