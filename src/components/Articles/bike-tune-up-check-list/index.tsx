/* eslint-disable import/no-cycle */
import useScreenDetect from 'hooks/useScreenDetect';
import { useRouter } from 'next/router';
import CONFIG from 'config';
import Link from 'next/link';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import Container from 'reactstrap/lib/Container';
import InvisibleBackdrop from '@ui/Backdrop/InvisibleBackdrop';
import Image from 'next/image';
import classes from './bike-turn-up-check-list.module.scss';
import iconBack from '../../../assets/img/register/ic_back.svg';
import iconWhiteTwitterLogo from '../../../assets/img/logo/ic_twitter_white.svg';
import iconWhiteFacebook from '../../../assets/img/logo/ic_facebook_white.svg';
import iconWhiteEmailLogo from '../../../assets/img/logo/ic_email_white.svg';
import icCircleTickBlue from '../../../assets/img/trade-in/ic_circle_tick_blue.svg';
import iconSaveLink from '../../../assets/img/logo/ic_save_link.svg';

const ArticleSection: FC = () => {
  const { asPath } = useRouter();
  const screen = useScreenDetect();
  const isPc = screen.currentWidthScreen >= 1025;
  const isMoblie = screen.currentWidthScreen < 768;
  const router = useRouter();
  const [popupSuccessVisible, setPopupSuccessVisible] = useState(false);
  const currentURL = useMemo(() => {
    return `${CONFIG.WEB_URL}${asPath.slice(1, asPath.length)}`;
  }, [asPath]);
  const linkFacebook = `https://www.facebook.com/sharer/sharer.php?u=${currentURL}`;
  const linkTwitter = `http://twitter.com/share?url=${currentURL}`;
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
  const imgBikingAtNight = useMemo(() => {
    if (isPc) {
      return `${CONFIG.IMAGE_CDN_URL}/bike-tune-up-check-list-pc.webp`;
    }
    if (isMoblie) {
      return `${CONFIG.IMAGE_CDN_URL}/bike-tune-up-check-list-mobile.webp`;
    }
    return `${CONFIG.IMAGE_CDN_URL}/bike-tune-up-check-list-tablet.webp`;
  }, [isPc, isMoblie]);
  return (
    <Container className={classes.container}>
      <div className={classes.headerSection}>
        <div className={classes.wrapDateArticles}>
          <p className={classes.dateArticles}>June 2023</p>
        </div>
        <div className={classes.wrapTitleArticles}>
          <h1 className={classes.titleArticles}>Bike Tune-Up Checklist: How to Tune Up Your Road or Mountain Bike</h1>
        </div>
      </div>
      <div className={classes.sectionBody1}>
        <div className={classes.coverSection1}>
          <Image src={imgBikingAtNight} alt="" className={classes.imageBgr} unsized={true} unoptimized={true} />
        </div>
      </div>
      <div className={classes.wrapBody}>
        <div className={classes.textBody}>
          Tuning up your bike is an important part of maintaining it and ensuring a comfortable and safe ride. Here's a
          checklist of steps you can follow to tune up your road or mountain bike:
        </div>
        <div>
          <h3 className={classes.titleArticles}>Step 1: Clean Your Bike</h3>
        </div>
        <div className={classes.textBody}>
          Before beginning any tune-up work, it's essential to clean your bike thoroughly. Use a bucket of soapy water
          and a soft brush to scrub your bike down, including all components like the chain, cassette, and derailleurs.
          Once your bike is clean, dry it thoroughly before beginning the tune-up process.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Step 2: Check Your Tires</h3>
        </div>
        <div className={classes.textBody}>
          The next step is to check your bike's tires. Make sure that they are inflated to the recommended pressure and
          that the treads are not worn down or damaged. You can use a tire pressure gauge to check the pressure and do a
          visible check on the tire depth to ensure your tires aren’t too worn down. If you notice any damage or wear,
          it's time to replace your tires. It's also a good idea to check for any punctures or cuts that may cause a
          flat tire on your next ride.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Step 3: Adjust Your Brakes</h3>
        </div>
        <div className={classes.textBody}>
          Properly functioning brakes are crucial for your safety while riding. If your bike has rim brakes, inspect the
          brake pads to make sure they are not worn down and that they make contact with the rim evenly. If your bike
          has disc brakes, inspect the brake pads to make sure they are not worn down and that they make contact with
          the rotor evenly. Also, check the cables for any fraying or rust and adjust/replace them if necessary. If you
          experience or see any sign of improper brake function or are not sure what to look for, we strongly recommend
          bringing your bike into your local bike shop and have a professional mechanic inspect and service your braking
          systems
        </div>
        <div>
          <h3 className={classes.titleArticles}>Step 4: Tune Your Gears</h3>
        </div>
        <div className={classes.textBody}>
          Tuning your gears ensures that your bike shifts smoothly and efficiently. If your drivetrain is not shifting
          smoothly or makes noises when riding or does not shift into all of the gears, we recommend you bring your bike
          into your local bike shop and have a professional mechanic service your drivetrain. You can also clean your
          chain and cassette and lubricate them with a high-quality chain lube.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Step 5: Check Your Bearings</h3>
        </div>
        <div className={classes.textBody}>
          The bearings in your bike's hubs, bottom bracket, and headset are critical components that can wear out over
          time. Check for any play or roughness in these areas and adjust or replace the bearings as needed. To check
          the bearings, grab the wheel or other component and try to move it from side to side. If there is any play or
          roughness, it's time to adjust or replace the bearings.We recommend that you bring your bike into your local
          bike shop and have a professional mechanic inspect and replace worn bearings.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Step 6: Tighten Bolts and Screws</h3>
        </div>
        <div className={classes.textBody}>
          Finally, it's important to check and tighten all bolts and screws on your bike, including the stem,
          handlebars, seat post, and pedals. Loose bolts and screws can cause your bike to rattle or, worse, fail while
          you're riding. Use a torque wrench or Allen key to tighten the bolts and screws to the recommended torque
          specification.
        </div>
        <div className={classes.textBody}>
          By following this checklist, you can tune up your bike and ensure that it's in excellent condition for your
          next ride. Regular bike tune-ups can help extend the lifespan of your bike and save you money in the long run.
          Whether you're tuning up your road bike or mountain bike, these steps can help you keep your bike running
          smoothly and efficiently.
        </div>
        <div className={classes.textBody}>
          Safety Disclosure: Adjusting components on your bike can be dangerous if not done properly. Make sure to
          follow manufacturer instructions and, if you are not comfortable with making adjustments, take your bike to a
          professional bike shop for service.
        </div>
        <div className={classes.textBody}>
          Contact Bicycle Blue Book today and look through our selection of{' '}
          <Link href={`${CONFIG.BASE_URL}/marketplace/buy-now/`}>bicycles for sale.</Link>. We're sure you'll find one
          perfect for biking at night.
        </div>
      </div>
      <div className={classes.hr} />
      <div className={classes.wrapChangePage}>
        <div
          className={classes.wrapBack}
          onClick={() => {
            router.push('/articles/bike-parts-and-maintenance');
            window.scrollTo(0, 0);
          }}>
          <div className={classes.back}>
            <img src={iconBack} alt="icon tick" className={classes.iconTick} /> Previous post
          </div>
          <div className={classes.titlePost}>A quick and easy guide to bike parts and maintenance</div>
        </div>
        <div
          className={classes.wrapNext}
          onClick={() => {
            router.push('/articles/bicycle-sizing-basics');
            window.scrollTo(0, 0);
          }}>
          <div className={classes.next}>
            Next post <img src={iconBack} alt="icon tick" className={classes.iconNext} />
          </div>
          <div className={classes.titlePost}>Bicycle Sizing Basics</div>
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
            </a>
          </Link>
          <Link href={linkTwitter}>
            <a target="_blank" className={cx(classes.logoIcon, classes.iconTwitter)}>
              <img src={iconWhiteTwitterLogo} alt="icon twitter" />
            </a>
          </Link>
          <Link href={linkEmail}>
            <a target="_blank" className={cx(classes.logoIcon, classes.iconEmail)}>
              <img src={iconWhiteEmailLogo} alt="icon email" />
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
          </Button>
        </div>
      </div>
      <h1 className={classes.customSeoH1}>Biking at Night: An Essential Guide to Staying Safe</h1>
    </Container>
  );
};

export default ArticleSection;
