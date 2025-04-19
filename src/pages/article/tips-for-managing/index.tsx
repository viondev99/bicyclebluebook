import React from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import TipsForManaging from 'components/Article/TipsForManaging';
function TipForManagingPage() {
  return <TipsForManaging />;
}
export default TipForManagingPage;
TipForManagingPage.renderLayout = renderMainLayout;
