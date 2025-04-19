import React, { FC } from 'react';
import { getSellerInfo } from 'store/marketplace/seller/seller.action';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import HomePage from 'components/Marketplace/OnlineStore/HomePage';
import { ReduxWrapperAppContext } from 'next-redux-wrapper';
import Head from 'next/head';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';
import { ComponentStatic } from '../../../../model/common';

const SellerPage: FC & ComponentStatic = () => {
  return (
    <>
      <Head>
        <title>Bicyclebluebook.com Online stores</title>
        <meta name="description" content="Bicyclebluebook.com Online stores" />
      </Head>
      <HomePage />
    </>
  );
};

SellerPage.getInitialProps = async ({ query, store }) => {
  store.dispatch(getSellerInfo(String(query.sellerId)));
  return {};
};

SellerPage.renderLayout = renderMainLayout;

export default withInjectAllSaga(SellerPage);
