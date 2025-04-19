import React from 'react';
import AccoutType from 'components/Article/AccoutType';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';

function Account() {
  return <AccoutType />;
}

export default Account;

Account.renderLayout = renderMainLayout;
