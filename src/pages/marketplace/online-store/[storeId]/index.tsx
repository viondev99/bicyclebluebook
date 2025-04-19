import React, { FC } from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import Head from 'next/head';
import HomePage from 'components/Marketplace/OnlineStore/HomePage';
import { ReduxWrapperAppContext } from 'next-redux-wrapper';
import { getOnlineStoreInfo } from 'store/marketplace/seller/seller.action';
import { stopAndAwaitSagaTask } from '../../../../store';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';
import { ComponentStatic } from '../../../../model/common';

const OnlineStorePage: FC & ComponentStatic = () => {
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

OnlineStorePage.getInitialProps = async ({ query, store, isServer }) => {
  store.dispatch(getOnlineStoreInfo(String(query.storeId)));
  if (isServer) {
    await stopAndAwaitSagaTask(store);
  }
  return {};
};

OnlineStorePage.renderLayout = renderMainLayout;

export default withInjectAllSaga(OnlineStorePage);
