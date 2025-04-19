/* eslint-disable no-nested-ternary */
import React, { FC, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { Bling as GPT } from 'react-gpt';
import ClientSide from '@ui/Common/ClientSide';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import CoverSection from 'components/Home/CoverSection';
import ServiceSection from 'components/Home/ServiceSection';
import ValueGuide from 'components/Home/ValueGuide';
import Marketplace from 'components/Home/Marketplace';
import TradeIn from 'components/Home/TradeIn';
import { ComponentStatic } from 'model/common';
import { isProduction } from 'helpers/utilities.helper';
import useScreenDetect from 'hooks/useScreenDetect';
import dayjs from 'dayjs';
import CONFIG from 'config';

const Benefits = React.lazy(() => import('components/Home/Benefits'));
const Recommended = React.lazy(() => import('components/Home/Recommended'));

const imgHome1 = `${CONFIG.IMAGE_CDN_URL}/imgHome1PC.webp`;
const imgHome1Tablet = `${CONFIG.IMAGE_CDN_URL}/imgHome1Tablet.png`;
const imgHome1Mobile = `${CONFIG.IMAGE_CDN_URL}/imgHome1Tablet.png`;

const imgHome2 = `${CONFIG.IMAGE_CDN_URL}/imgHome2PC.webp`;
const imgHome2Tablet = `${CONFIG.IMAGE_CDN_URL}/imgHome2Tablet.png`;
const imgHome2Mobile = `${CONFIG.IMAGE_CDN_URL}/imgHome2Tablet.png`;

const imgHome3 = `${CONFIG.IMAGE_CDN_URL}/imgHome3PC.webp`;
const imgHome3Tablet = `${CONFIG.IMAGE_CDN_URL}/imgHome3Tablet.png`;
const imgHome3Mobile = `${CONFIG.IMAGE_CDN_URL}/imgHome3Tablet.png`;

const imgHome4 = `${CONFIG.IMAGE_CDN_URL}/imgHome4PC.webp`;
const imgHome4Tablet = `${CONFIG.IMAGE_CDN_URL}/imgHome4Tablet.png`;
const imgHome4Mobile = `${CONFIG.IMAGE_CDN_URL}/imgHome4Tablet.png`;

const listImagePicked = [
  { large: imgHome1, medium: imgHome1Tablet, small: imgHome1Mobile },
  { large: imgHome2, medium: imgHome2Tablet, small: imgHome2Mobile },
  { large: imgHome3, medium: imgHome3Tablet, small: imgHome3Mobile },
  { large: imgHome4, medium: imgHome4Tablet, small: imgHome4Mobile },
];

const Home: FC & ComponentStatic = () => {
  const { currentWidthScreen } = useScreenDetect();
  const [visibleBottomContent, setVisibleBottomContent] = useState(false);

  const getBackgroundImageHomeIndex = () => {
    const timestampToday = dayjs().unix();
    const firstMonday = dayjs('2022-01-03 00:00:00').unix();
    const checkDiffTime = Math.ceil((timestampToday - firstMonday) / 7 / 24 / 60 / 60);
    return checkDiffTime % 4;
  };

  const setBackGroundImageDefault = useCallback(() => {
    const index: number = getBackgroundImageHomeIndex();

    const _coverImg =
      currentWidthScreen >= 1025
        ? listImagePicked[index].large
        : currentWidthScreen >= 768
        ? listImagePicked[index].medium
        : listImagePicked[index].small;
    return _coverImg;
  }, [currentWidthScreen]);

  const coverImageUrl = useMemo(() => {
    return setBackGroundImageDefault();
  }, [setBackGroundImageDefault]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleScroll = useCallback(() => {
    const position = window.pageYOffset;
    if (position > 1000 && !visibleBottomContent) {
      setVisibleBottomContent(true);
    }
  }, [visibleBottomContent]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      <Head>
        <title>Home - Bicycle Values - BicycleBlueBook.com</title>
        <meta name="keywords" content="bicycle values" />
        <meta
          name="description"
          content="Search for bicycle values with confidence with the world’s only trusted online bicycle valuation tool and shopping destination for used bicycle sales."
        />
        <meta
          property="og:description"
          content="The world's only trusted resource for finding the value of used bikes. Our experts give you the confidence to buy, sell, or trade so you are back on the road faster!"
        />
        <meta name="p:domain_verify" content="c7286a4af92df09cd023953cbde428a8" />
        <meta name="author" />
        <meta id="MetaKeywords" name="KEYWORDS" content="used bikes" />
        <meta name="og:image" content={imgHome2Tablet} />
        <meta name="og:image:type" content="image/png" />
        <meta name="og:image:width" content="1200" />
        <meta name="og:image:height" content="630" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:site" content="@handle" />
        <meta property="twitter:image" content={imgHome2Tablet} />
        <meta property="twitter:url" content={imgHome2Tablet} />
        <meta property="twitter:title" content="Home - Bicycle Values - BicycleBlueBook.com" />
        <meta
          property="twitter:description"
          content="Search for bicycle values with confidence with the world’s only trusted online bicycle valuation tool and shopping destination for used bicycle sales."
        />
        <meta name="robots" content={isProduction() ? 'index, follow' : 'noindex'} />
      </Head>
      {coverImageUrl && <CoverSection coverImageUrl={coverImageUrl} />}
      <ServiceSection />
      <ValueGuide />
      <Marketplace />
      <TradeIn />

      {visibleBottomContent && (
        <Suspense fallback={null}>
          <>
            <Benefits />
            <Recommended />
          </>
        </Suspense>
      )}
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
};

const MemoHome: ComponentStatic & FC = React.memo(Home);

MemoHome.getInitialProps = async () => {
  return {};
};

MemoHome.renderLayout = renderMainLayout;

export default MemoHome;
