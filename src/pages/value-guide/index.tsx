import React, { useEffect } from 'react';
import Head from 'next/head';
import { Bling as GPT } from 'react-gpt';

import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import CoverSection from 'components/ValueGuide/CoverSection';
import ServiceSection from 'components/ValueGuide/ServiceSection';
import HelperSection from 'components/ValueGuide/HelperSection';
import ProductSection from 'components/ValueGuide/ProductSection';
import SearchSection from 'components/ValueGuide/SearchSection';
import ClientSide from '@ui/Common/ClientSide';
import V3BannerComponent from 'components/V3BannerComponent';
import { isProduction } from 'helpers/utilities.helper';
import classes from './value-guide.module.scss';
import images from '@images';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

function ValueGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Head>
        <title>Value Guide - Bicycle Values - BicycleBlueBook.com</title>
        <meta
          name="description"
          content="Our Value Guide provides the most comprehensive, reliable, and accurate valuation for bicycle values based on condition, year, brand, model and MSRP."
        />
        <meta
          property="og:description"
          content="Our bicycle database is the most comprehensive, reliable, accurate, and up-to-date valuation for your used bike value based on year, make, model and MSRP."
        />
        <meta name="author" />
        <meta id="MetaKeywords" name="KEYWORDS" content="bicycle values" />
        <meta name="og:image" content={images.common.imgBGValueGuideMobile} />
        <meta name="og:image:type" content="image/*" />
        <meta name="og:image:width" content="1200" />
        <meta name="og:image:height" content="630" />

        <meta name="robots" content={isProduction() ? 'index, follow' : 'noindex'} />
        {isProduction() && <meta id="MetaKeywords" name="KEYWORDS" content="bicycle values" />}

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:site" content="@handle" />
        <meta property="twitter:image" content={images.common.imgBGValueGuideMobile} />
        <meta property="twitter:url" content={images.common.imgBGValueGuideMobile} />
        <meta property="twitter:title" content="Value Guide - Bicycle Values - BicycleBlueBook.com" />
        <meta
          property="twitter:description"
          content="Our Value Guide provides the most comprehensive, reliable, and accurate valuation for bicycle values based on condition, year, brand, model and MSRP."
        />
      </Head>
      <V3BannerComponent customWrapBanner={classes.customWrapBanner} />
      <CoverSection />
      <ClientSide>
        <div className={'bbb-ads'}>
          <GPT
            adUnitPath="/172907264/value_guide_homepage_header"
            // adUnitPath="/4595/nfl.test.open"
            slotSize="fluid"
            sizeMapping={[
              {
                viewport: [990, 0],
                slot: [
                  [970, 90],
                  [970, 250],
                  [728, 90],
                ],
              },
              { viewport: [776, 0], slot: [728, 90] },
              { viewport: [0, 0], slot: [320, 50] },
            ]}
          />
        </div>
      </ClientSide>
      <SearchSection />
      <ServiceSection />
      <HelperSection />
      <ProductSection />
      <ClientSide>
        <div className={'bbb-ads'}>
          <GPT
            adUnitPath="/172907264/value_guide_homepage_footer"
            // adUnitPath="/4595/nfl.test.open"
            slotSize="fluid"
            sizeMapping={[
              {
                viewport: [990, 0],
                slot: [
                  [970, 90],
                  [728, 90],
                ],
              },
              { viewport: [776, 0], slot: [728, 90] },
              {
                viewport: [0, 0],
                slot: [
                  [300, 600],
                  [300, 250],
                ],
              },
            ]}
          />
        </div>
      </ClientSide>
    </>
  );
}

ValueGuide.getInitialProps = async () => {
  return {};
};

ValueGuide.renderLayout = renderMainLayout;

export default withInjectAllSaga(ValueGuide);
