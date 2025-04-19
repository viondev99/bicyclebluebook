import React from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import Listing from 'components/Article/Listing';

function ListingPage() {
  return <Listing />;
}

export default ListingPage;
ListingPage.renderLayout = renderMainLayout;
