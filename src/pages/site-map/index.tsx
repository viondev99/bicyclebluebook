import React, { FC } from 'react';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import SiteMapContainer from 'components/SiteMap/SiteMapContainer';
import Head from 'next/head';

const SiteMap: FC & ComponentStatic = () => {
  return (
    <div>
      <Head>
        <title>Site Map</title>
      </Head>
      <SiteMapContainer />
    </div>
  );
};

SiteMap.renderLayout = renderMainLayout;

export default SiteMap;
