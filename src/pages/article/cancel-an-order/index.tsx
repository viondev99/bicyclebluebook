import React from 'react';
import CanelAnOrder from 'components/Article/CanelAnOrder';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
function CanelAnOrderPage() {
  return <CanelAnOrder />;
}

export default CanelAnOrderPage;

CanelAnOrderPage.renderLayout = renderMainLayout;
