/* eslint-disable no-nested-ternary */
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
import classes from './take-the-right-pictures.module.scss';
import images from '@images';

const ArticleSection: FC = () => {
  const { asPath } = useRouter();
  const screen = useScreenDetect();
  const isPc = screen.currentWidthScreen >= 1025;
  const isTablet = screen.currentWidthScreen >= 768;
  const router = useRouter();
  const [popupSuccessVisible, setPopupSuccessVisible] = useState(false);
  const currentURL = useMemo(() => {
    return `${CONFIG.WEB_URL}${asPath.slice(1, asPath.length)}`;
  }, [asPath]);
  const linkFacebook = `https://www.facebook.com/sharer/sharer.php?u=${currentURL}`;
  const linkTwitter = `http://twitter.com/share?url=${currentURL}`;
  // const linkInstagram = `https://www.instagram.com`;
  const linkEmail = `mailto:?body=${encodeURIComponent(currentURL)}`;
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
          <p className={classes.dateArticles}>December 2022</p>
        </div>
        <div className={classes.wrapTitleArticles}>
          <h1 className={classes.titleArticles}>Take better photos to help sell your used bike</h1>
        </div>
      </div>
      <div className={classes.wrapBody}>
        <div className={classes.textBody}>
          When buying a bike online, photos are the first thing buyers notice. Clear photos will help you sell your bike
          faster, reduce questions, and minimize returns.
        </div>
        <div className={classes.textBody}>Use the following tips to create the best photos for selling your bike.</div>
        <ul>
          <li className={classes.textBody}>
            Start with a clean bike. A clean bike shows buyers that the bike has been well cared for.
          </li>
          <li className={classes.textBody}>
            Find an uncluttered location. Background clutter is distracting and looks unprofessional. Solid,
            light-colored backgrounds provide contrast to highlight the bike’s details.
          </li>
          <li className={classes.textBody}>
            Use good lighting. Avoid bright, direct light, which creates shadows and glare. If shooting outdoors, place
            your bike in a shady area. If taking pictures indoors, choose a location with enough light and the least
            amount of reflection and shadowing.
          </li>
          <li className={classes.textBody}>
            Use the high-resolution setting on your camera. Buyers should be able to enlarge the photos and view the
            details.
          </li>
          <li className={classes.textBody}>
            Get eye level with the components. Squat down to align your camera with each component instead of pointing
            your camera down from a standing position.
          </li>
          <li className={classes.textBody}>
            Think of yourself as a buyer and how you would inspect a bike in person. What would you want to see? Don’t
            forget to include pictures of any significant scuffs, chips, scratches, or damage. It’s also helpful to show
            areas of use and wear: tires, brake pads, saddle, and brake hoods. Use the following shot list and images as
            a guide.
          </li>
        </ul>
        <div className={classes.textBody}>
          {isPc ? (
            <Image
              src={`${CONFIG.IMAGE_CDN_URL}/bmc-drive-side-profile-gray-pc.webp`}
              alt="arrow right icon"
              className={classes.imageBgr}
              unsized={true}
              unoptimized={true}
            />
          ) : isTablet ? (
            <Image
              src={`${CONFIG.IMAGE_CDN_URL}/bmc-drive-side-profile-gray-tablet.webp`}
              alt="arrow right icon"
              className={classes.imageBgr}
              unsized={true}
              unoptimized={true}
            />
          ) : (
            <Image
              src={`${CONFIG.IMAGE_CDN_URL}/bmc-drive-side-profile-gray-mobile.webp`}
              alt="arrow right icon"
              className={classes.imageBgr}
              unsized={true}
              unoptimized={true}
            />
          )}
        </div>
        <div className={classes.textBody}>Profile view of the drive and non-drive sides</div>
        <div className={classes.textBody}>
          {isPc ? (
            <Image
              src={`${CONFIG.IMAGE_CDN_URL}/bmc-non-drive-side-profile-gray-pc.webp`}
              alt="arrow right icon"
              className={classes.imageBgr}
              unsized={true}
              unoptimized={true}
            />
          ) : isTablet ? (
            <Image
              src={`${CONFIG.IMAGE_CDN_URL}/bmc-non-drive-side-profile-gray-tablet.webp`}
              alt="arrow right icon"
              className={classes.imageBgr}
              unsized={true}
              unoptimized={true}
            />
          ) : (
            <Image
              src={`${CONFIG.IMAGE_CDN_URL}/bmc-non-drive-side-profile-gray-mobile.webp`}
              alt="arrow right icon"
              className={classes.imageBgr}
              unsized={true}
              unoptimized={true}
            />
          )}
        </div>
        <div className={classes.textBody}>Profile view of the drive and non-drive sides</div>

        <div className={classes.textBody}>
          {isPc ? (
            <Image
              src={`${CONFIG.IMAGE_CDN_URL}/bmc-handlebars-gray-pc.webp`}
              alt="arrow right icon"
              className={classes.imageBgr}
              unsized={true}
              unoptimized={true}
            />
          ) : isTablet ? (
            <Image
              src={`${CONFIG.IMAGE_CDN_URL}/bmc-handlebars-gray-tablet.webp`}
              alt="arrow right icon"
              className={classes.imageBgr}
              unsized={true}
              unoptimized={true}
            />
          ) : (
            <Image
              src={`${CONFIG.IMAGE_CDN_URL}/bmc-handlebars-gray-mobile.webp`}
              alt="arrow right icon"
              className={classes.imageBgr}
              unsized={true}
              unoptimized={true}
            />
          )}
        </div>
        <div className={classes.textBody}>45-degree view of the handlebars</div>
        <div className={classes.textBody}>
          {isPc ? (
            <Image
              src={`${CONFIG.IMAGE_CDN_URL}/bmc-crank-gray-pc.webp`}
              alt="arrow right icon"
              className={classes.imageBgr}
              unsized={true}
              unoptimized={true}
            />
          ) : isTablet ? (
            <Image
              src={`${CONFIG.IMAGE_CDN_URL}/bmc-crank-gray-tablet.webp`}
              alt="arrow right icon"
              className={classes.imageBgr}
              unsized={true}
              unoptimized={true}
            />
          ) : (
            <Image
              src={`${CONFIG.IMAGE_CDN_URL}/bmc-crank-gray-mobile.webp`}
              alt="arrow right icon"
              className={classes.imageBgr}
              unsized={true}
              unoptimized={true}
            />
          )}
        </div>
        <div className={classes.textBody}>Front derailleur and crank arms</div>
        <div className={classes.textBody}>
          {isPc ? (
            <Image
              src={`${CONFIG.IMAGE_CDN_URL}/bmc-rear-derailluer-gray-pc.webp`}
              alt="arrow right icon"
              className={classes.imageBgr}
              unsized={true}
              unoptimized={true}
            />
          ) : isTablet ? (
            <Image
              src={`${CONFIG.IMAGE_CDN_URL}/bmc-rear-derailluer-gray-tablet.webp`}
              alt="arrow right icon"
              className={classes.imageBgr}
              unsized={true}
              unoptimized={true}
            />
          ) : (
            <Image
              src={`${CONFIG.IMAGE_CDN_URL}/bmc-rear-derailluer-gray-mobile.webp`}
              alt="arrow right icon"
              className={classes.imageBgr}
              unsized={true}
              unoptimized={true}
            />
          )}
        </div>
        <div className={classes.textBody}>Rear derailleur</div>
        <div className={classes.textBody}>
          {isPc ? (
            <Image
              src={`${CONFIG.IMAGE_CDN_URL}/bmc-front-rotor-gray-pc.webp`}
              alt="arrow right icon"
              className={classes.imageBgr}
              unsized={true}
              unoptimized={true}
            />
          ) : isTablet ? (
            <Image
              src={`${CONFIG.IMAGE_CDN_URL}/bmc-front-rotor-gray-tablet.webp`}
              alt="arrow right icon"
              className={classes.imageBgr}
              unsized={true}
              unoptimized={true}
            />
          ) : (
            <Image
              src={`${CONFIG.IMAGE_CDN_URL}/bmc-front-rotor-gray-mobile.webp`}
              alt="arrow right icon"
              className={classes.imageBgr}
              unsized={true}
              unoptimized={true}
            />
          )}
        </div>
        <div className={classes.textBody}>Front and rear brake rotors or brake calipers</div>
        <div className={classes.textBody}>
          {isPc ? (
            <Image
              src={`${CONFIG.IMAGE_CDN_URL}/bmc-rear-rotor-gray-pc.webp`}
              alt="arrow right icon"
              className={classes.imageBgr}
              unsized={true}
              unoptimized={true}
            />
          ) : isTablet ? (
            <Image
              src={`${CONFIG.IMAGE_CDN_URL}/bmc-rear-rotor-gray-tablet.webp`}
              alt="arrow right icon"
              className={classes.imageBgr}
              unsized={true}
              unoptimized={true}
            />
          ) : (
            <Image
              src={`${CONFIG.IMAGE_CDN_URL}/bmc-rear-rotor-gray-mobile.webp`}
              alt="arrow right icon"
              className={classes.imageBgr}
              unsized={true}
              unoptimized={true}
            />
          )}
        </div>
        <div className={classes.textBody}>Front and rear brake rotors or brake calipers</div>
        <div className={classes.textBody}>
          Selling a bike online can be a challenge. By following these photo guidelines, you’ll grab the buyer’s
          attention and maximize the value of your bike sale.
        </div>
      </div>
      <div className={classes.hr} />
      <div className={classes.wrapChangePage}>
        <div
          className={classes.wrapBack}
          onClick={() => {
            router.push('/articles/biking-at-night');
            window.scrollTo(0, 0);
          }}>
          <div className={classes.back}>
            <img src={images.iconBack} alt="icon tick" className={classes.iconTick} /> Previous post
          </div>
          <div>Biking at Night: An Essential Guide to Staying Safe</div>
        </div>
        <div
          className={classes.wrapNext}
          onClick={() => {
            router.push('/articles/gear-for-cycling');
            window.scrollTo(0, 0);
          }}>
          <div className={classes.next}>
            Next post <img src={images.iconBack} alt="icon tick" className={classes.iconNext} />
          </div>
          <div>The Top Gear for Cycling: Your Guide to Must-Have Road Bike Accessories</div>
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
              <img src={images.iconWhiteFacebook} alt="icon facebook" />
              {/* <span className={classes.titleLogo}>Facebook</span> */}
            </a>
          </Link>
          <Link href={linkTwitter}>
            <a target="_blank" className={cx(classes.logoIcon, classes.iconTwitter)}>
              <img src={images.iconWhiteTwitterLogo} alt="icon twitter" />
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
              <img src={images.iconWhiteEmailLogo} alt="icon email" />
              {/* <span className={classes.titleLogo}>Email</span> */}
            </a>
          </Link>

          <Button className={cx(classes.logoIcon, classes.iconSaveLink)} buttonType="clear" onClick={handleCopyLink}>
            {popupSuccessVisible && (
              <InvisibleBackdrop onClick={handleCloseWhenClickOut}>
                <div className={classes.saveLinkSuccess}>
                  <img src={images.tradeIn.icCircleTickBlue} alt="icon tick" className={classes.iconTick} />{' '}
                  <span>URL copied to clipboard</span>
                </div>
              </InvisibleBackdrop>
            )}
            <img src={images.iconSaveLink} alt="icon save link" />
            {/* <span className={classes.titleLogo}>Copy Link</span> */}
          </Button>
        </div>
      </div>
      <h1 className={classes.customSeoH1}>The Top Gear for Cycling: Your Guide to Must-Have Road Bike Accessories</h1>
    </Container>
  );
};

export default ArticleSection;
