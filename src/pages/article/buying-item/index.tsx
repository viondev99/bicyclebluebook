import React from 'react';
import Marketplace from 'components/Article/Marketplace';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
function MarketplacePage() {
  return <Marketplace />;
}

export default MarketplacePage;

MarketplacePage.renderLayout = renderMainLayout;
