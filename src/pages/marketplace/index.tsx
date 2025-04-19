import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { Bling as GPT } from 'react-gpt';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import CoverSection from 'components/Marketplace/Introduce/CoverSection';
import DescriptionSection from 'components/Marketplace/Introduce/DescriptionSection';
import WantToGrabGreatDealSection from 'components/Marketplace/Introduce/WantToGrabGreatDealSection';
import WhoWouldYouLikeSection from 'components/Marketplace/Introduce/WhoWouldYouLikeSection';
import { SEO_IMAGE_MARKETPLACE_LANDING } from 'helpers/constraint.helper';
import FooterNotExactlySure from 'components/Marketplace/Introduce/FooterNotExactlySure';
import ClientSide from '@ui/Common/ClientSide';
import { isProduction } from 'helpers/utilities.helper';
import CONFIG from 'config';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const ShopBuyCategorySection = React.lazy(() => import('components/Marketplace/Introduce/ShopBuyCategorySection'));
const ShopBuyBrandSection = React.lazy(() => import('components/Marketplace/Introduce/ShopBuyBrandSection'));

const imgMarketplaceIntrodudeTablet = `${CONFIG.IMAGE_CDN_URL}/img_marketplace_introdude_lg.webp`;

function ValueGuide() {
  const [visibleBottomContent, setVisibleBottomContent] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleScrollMarketplaceLanding = useCallback(() => {
    const position = window.pageYOffset;
    if (position > 200 && !visibleBottomContent) {
      setVisibleBottomContent(true);
    }
  }, [visibleBottomContent]);

  useEffect(() => {
    window.addEventListener('scroll', handleScrollMarketplaceLanding, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollMarketplaceLanding);
    };
  }, [handleScrollMarketplaceLanding]);

  return (
    <>
      <Head>
        <title>Marketplace - Bicycles for sale - BicycleBlueBook.com</title>
        <meta name="og:title" content="Marketplace - Bicycles for sale - BicycleBlueBook.com" />
        <meta name="keywords" content="Marketplace - Bicycles for sale - BicycleBlueBook.com" />
        <meta
          name="description"
          content="Whether you’re looking to buy or sell, our Marketplace of bicycles for sale offers a safe, secure, and hassle-free experience that is unmatched."
        />
        <meta
          name="og:description"
          content="Whether you’re looking to buy or sell, our Marketplace of bicycles for sale offers a safe, secure, and hassle-free experience that is unmatched."
        />
        <meta name="author" content="" />
        <meta name="og:image" content={SEO_IMAGE_MARKETPLACE_LANDING} />
        <meta name="og:image:type" content="image/png" />
        <meta name="og:image:width" content="1200" />
        <meta name="og:image:height" content="630" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:site" content="@handle" />
        <meta property="twitter:image" content={imgMarketplaceIntrodudeTablet} />
        <meta property="twitter:url" content={imgMarketplaceIntrodudeTablet} />
        <meta property="twitter:title" content="Marketplace - Bicycles for sale - BicycleBlueBook.com" />
        <meta
          property="twitter:description"
          content="Whether you’re looking to buy or sell, our Marketplace of bicycles for sale offers a safe, secure, and hassle-free experience that is unmatched."
        />
        <meta name="robots" content={isProduction() ? 'index, follow' : 'noindex'} />
      </Head>
      <CoverSection />
      {/* <DescriptionSection /> */}
      <WhoWouldYouLikeSection />
      {visibleBottomContent && (
        <Suspense fallback={null}>
          <ShopBuyCategorySection />
        </Suspense>
      )}
      <WantToGrabGreatDealSection />
      {visibleBottomContent && (
        <Suspense fallback={null}>
          <ShopBuyBrandSection />
        </Suspense>
      )}
      <FooterNotExactlySure />
      <ClientSide>
        <div className="bbb-ads">
          <GPT
            adUnitPath="/172907264/homepage_footer"
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
              { viewport: [768, 0], slot: [728, 90] },
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
