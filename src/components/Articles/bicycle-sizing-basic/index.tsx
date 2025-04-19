/* eslint-disable import/no-cycle */
import useScreenDetect from 'hooks/useScreenDetect';
import { useRouter } from 'next/router';
import CONFIG from 'config';
import Link from 'next/link';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Container } from 'reactstrap';
import InvisibleBackdrop from '@ui/Backdrop/InvisibleBackdrop';
import Image from 'next/image';
import classes from './bicycle-sizing-basic.module.scss';
import iconBack from '../../../assets/img/register/ic_back.svg';
import iconWhiteTwitterLogo from '../../../assets/img/logo/ic_twitter_white.svg';
import iconWhiteFacebook from '../../../assets/img/logo/ic_facebook_white.svg';
import iconWhiteEmailLogo from '../../../assets/img/logo/ic_email_white.svg';
import icCircleTickBlue from '../../../assets/img/trade-in/ic_circle_tick_blue.svg';
import iconSaveLink from '../../../assets/img/logo/ic_save_link.svg';

const BicycleSizingBasic: FC = () => {
  const { asPath } = useRouter();
  const screen = useScreenDetect();
  const router = useRouter();
  const isPc = screen.currentWidthScreen >= 1025;
  const isTablet = screen.currentWidthScreen >= 768;
  const [popupSuccessVisible, setPopupSuccessVisible] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const currentURL = useMemo(() => {
    return `${CONFIG.WEB_URL}${asPath.slice(1, asPath.length)}`;
  }, [asPath]);
  const linkFacebook = `https://www.facebook.com/sharer/sharer.php?u=${currentURL}`;
  const linkTwitter = `http://twitter.com/share?url=${currentURL}`;
  // const linkInstagram = `https://www.instagram.com`;
  const linkEmail = `mailto:?body=${encodeURIComponent(currentURL)}`;
  const imgChooseHelmet = useMemo(() => {
    if (isPc) {
      return `${CONFIG.IMAGE_CDN_URL}/bicycle_sizing_basic_desktop.webp`;
    }
    if (isTablet) {
      return `${CONFIG.IMAGE_CDN_URL}/bicycle_sizing_basic_tablet.webp`;
    }
    return `${CONFIG.IMAGE_CDN_URL}/bicycle_sizing_basic_mobile.webp`;
  }, [isTablet, isPc]);

  const handleCloseWhenClickOut = useCallback(() => {
    setPopupSuccessVisible(false);
  }, []);
  useEffect(() => {
    let closeTimeout: NodeJS.Timeout = null;
    if (popupSuccessVisible) {
      closeTimeout = setTimeout(() => {
        setPopupSuccessVisible(false);
      }, 2500);
    }
    return () => {
      clearTimeout(closeTimeout);
    };
  }, [popupSuccessVisible]);
  const handleCopyLink = useCallback(() => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', currentURL);
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand('copy');
    document.body.removeChild(input);
    if (screen.isMediumScreen()) {
      // onClose(true);
    } else {
      setPopupSuccessVisible(true);
    }
  }, [currentURL, screen]);
  return (
    <Container className={classes.container}>
      <div className={classes.headerSection}>
        <div className={classes.wrapDateArticles}>
          <p className={classes.dateArticles}>May 2023</p>
        </div>
        <div className={classes.wrapTitleArticles}>
          <h1 className={classes.titleArticles}>Bicycle Sizing Basics</h1>
        </div>
      </div>
      <div className={classes.sectionBody1}>
        <div className={classes.coverSection1}>
          <Image src={imgChooseHelmet} alt="arrow right icon" className={classes.imageBgr} unsized priority />
        </div>
      </div>
      <div className={classes.wrapBody}>
        <div className={classes.textBody}>
          Bike sizing is crucial to ensuring your comfort and safety while cycling. Choosing the correct bike size can
          help you avoid discomfort and injuries and enjoy a more efficient and comfortable riding experience. In this
          article, we will explore the factors that affect bike sizing and help you choose the perfect road bicycle
          frame size.
        </div>
        <div className={classes.textBody}>
          The most common method for determining the correct road bicycle frame size is measuring your inseam length.
          Your inseam length is the distance from the ground to your crotch, with your shoes on. A general rule of thumb
          is that your bike frame size should be around 1/3 of your inseam length. However, your precise bike size
          depends on several factors, such as your riding style, torso measurements, arm/leg length, along with other
          measurements and personal preferences. Therefore, we always recommend getting a fitting from a professional
          bike fitter to determine your exact size.
        </div>
        <div className={classes.textBody}>
          Road bicycles typically come in several sizes, ranging from 48 cm to 62 cm and corresponding to different
          rider heights. Many brands use “t-shirt sizing,” which includes XXS, XS, S, M, L, and XL, and XXL. It's
          important to note that bike sizes are not definitive and may vary depending on the brand and model of the
          bike. That's why it's essential to take a test ride and consult a professional bike fitter to ensure that you
          choose the correct size for your body type.
        </div>
        <div className={classes.textBody}>
          In addition to the overall bike size, several bike dimensions can affect your comfort and performance while
          riding. The top tube length, seat tube length, and standover height are some of the key dimensions to
          consider. The top tube length is the distance between the seat tube and the head tube of the bike. A longer
          top tube length can provide a more stretched-out riding position, while a shorter top tube length can provide
          a more upright riding position. The seat tube length is the distance between the bottom bracket and the top of
          the seat tube. A longer seat tube length can provide a more aggressive riding position, while a shorter seat
          tube length can provide a more comfortable and relaxed riding position. Finally, the standover height is the
          distance between the ground and the top tube. It is essential to consider the standover height when choosing a
          bike frame size as it not only ensures a proper fit but can make dismounting the bike difficult if the bike is
          too big for the rider.
        </div>
        <div className={classes.textBody}>
          Aside from bike dimensions, other factors can also affect your comfort and performance while riding, such as
          the bike's components. The handlebars, saddle, and pedals are some of the crucial components that can make a
          significant difference in your riding experience. Handlebars come in several different styles, including drop
          bars, flat bars, and riser bars, each with their unique benefits. Saddles also come in various styles, with
          different levels of padding and support. A comfortable saddle is essential for longer rides and can help
          prevent discomfort and injuries. Pedals also affect your performance while riding, with clipless pedals
          providing a more efficient transfer of power from your legs to the bike. However, they can take some time to
          get used to and may not be suitable for all riders.
        </div>
        <div className={classes.textBody}>
          In conclusion, choosing the right road bicycle frame size is essential for maximizing your comfort and
          performance while riding. By considering your inseam length, riding style, and bike dimensions, you can find a
          bike for your body type and riding goals. Whenever possible, we recommend taking a test ride and consulting a
          professional bike fitter as crucial steps in choosing the correct bike size and components for your riding
          needs. When shopping on the Bicycle Blue Book Marketplace, use our{' '}
          <Link href={`${CONFIG.WEB_URL}bike-finder/request/`}>Bike Finder</Link> to narrow down your options by price,
          size, and bike type to improve your online shopping experience.
        </div>
      </div>
      <div className={classes.hr} />
      <div className={classes.wrapChangePage}>
        <div
          className={classes.wrapBack}
          onClick={() => {
            router.push('/articles/bike-tune-up-check-list');
            window.scrollTo(0, 0);
          }}>
          <div className={classes.back}>
            <img src={iconBack} alt="icon tick" className={classes.iconTick} /> Previous post
          </div>
          <div>Bike Tune-Up Checklist: How to Tune Up Your Road or Mountain Bike</div>
        </div>
        <div
          className={classes.wrapNext}
          onClick={() => {
            router.push('/articles/how-to-choose-a-bike-helmet');
            window.scrollTo(0, 0);
          }}>
          <div className={classes.next}>
            Next post <img src={iconBack} alt="icon tick" className={classes.iconNext} />
          </div>
          <div>How to Choose a Bike Helmet </div>
        </div>
      </div>
      <div className={classes.hr} />
      <div className={classes.wrapSocial}>
        <div className={classes.titleShare}>
          <p>Share this article</p>
        </div>
        <div className={cx('d-flex justify-content-center', classes.wrapWhenMobile)}>
          <Link href={linkFacebook}>
            <a target="_blank" className={cx(classes.logoIcon, classes.iconFaceBook)}>
              <img src={iconWhiteFacebook} alt="icon facebook" />
              {/* <span className={classes.titleLogo}>Facebook</span> */}
            </a>
          </Link>
          <Link href={linkTwitter}>
            <a target="_blank" className={cx(classes.logoIcon, classes.iconTwitter)}>
              <img src={iconWhiteTwitterLogo} alt="icon twitter" />
              {/* <span className={classes.titleLogo}>Twitter</span> */}
            </a>
          </Link>
          {/* <Link href={linkInstagram}>
          <a target="_blank" className={cx(classes.logoIcon, classes.iconInstagram)}>
            <img src={images.iconWhiteInstagramLogo} alt="icon instagram" />
          </a>
        </Link> */}

          <Link href={linkEmail}>
            <a target="_blank" className={cx(classes.logoIcon, classes.iconEmail)}>
              <img src={iconWhiteEmailLogo} alt="icon email" />
              {/* <span className={classes.titleLogo}>Email</span> */}
            </a>
          </Link>

          <Button className={cx(classes.logoIcon, classes.iconSaveLink)} buttonType="clear" onClick={handleCopyLink}>
            {popupSuccessVisible && (
              <InvisibleBackdrop onClick={handleCloseWhenClickOut}>
                <div className={classes.saveLinkSuccess}>
                  <img src={icCircleTickBlue} alt="icon tick" className={classes.iconTick} />{' '}
                  <span>URL copied to clipboard</span>
                </div>
              </InvisibleBackdrop>
            )}
            <img src={iconSaveLink} alt="icon save link" />
            {/* <span className={classes.titleLogo}>Copy Link</span> */}
          </Button>
        </div>
      </div>
      <h1 className={classes.customSeoH1}>Bicycle Sizing Basics</h1>
    </Container>
  );
};

export default BicycleSizingBasic;
