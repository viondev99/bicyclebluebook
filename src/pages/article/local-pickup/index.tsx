import React from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import LocalPickupOptions from 'components/Article/LocalPickup';
function LocalPickupPage() {
  return <LocalPickupOptions />;
}

export default LocalPickupPage;
LocalPickupPage.renderLayout = renderMainLayout;
