import React from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import OnlineStore from 'components/Article/Return';

function Online() {
  return <OnlineStore />;
}

export default Online;
Online.renderLayout = renderMainLayout;
