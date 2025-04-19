import React from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import ShippingOptions from 'components/Article/ShippingOptions';
function ShippingOptionsPage() {
  return <ShippingOptions />;
}

export default ShippingOptionsPage;
ShippingOptionsPage.renderLayout = renderMainLayout;
