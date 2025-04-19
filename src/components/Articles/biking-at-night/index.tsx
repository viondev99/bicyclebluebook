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
import classes from './biking-at-night.module.scss';
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
  const imgBikingAtNight = useMemo(() => {
    if (isPc) {
      return `${CONFIG.IMAGE_CDN_URL}/biking-at-night-pc.webp`;
    }
    if (isMoblie) {
      return `${CONFIG.IMAGE_CDN_URL}/biking-at-night-mobile.webp`;
    }
    return `${CONFIG.IMAGE_CDN_URL}/biking-at-night-tablet.webp`;
  }, [isPc, isMoblie]);
  return (
    <Container className={classes.container}>
      <div className={classes.headerSection}>
        <div className={classes.wrapDateArticles}>
          <p className={classes.dateArticles}>February 2023</p>
        </div>
        <div className={classes.wrapTitleArticles}>
          <h1 className={classes.titleArticles}>Biking at Night: An Essential Guide to Staying Safe</h1>
        </div>
      </div>
      <div className={classes.sectionBody1}>
        <div className={classes.coverSection1}>
          <Image src={imgBikingAtNight} alt="" className={classes.imageBgr} unsized={true} unoptimized={true} />
        </div>
      </div>
      <div className={classes.wrapBody}>
        <div className={classes.textBody}>
          There's something special about biking at night. Unless you're in the heart of a metropolis, you'll be
          submerged in silence, and your only company is your thoughts. This moment of solitude makes it easy to see the
          allure of night bicycle rides. However, just because you're alone for a short stretch doesn't mean you won't
          have to share the road around the bend. Cycling at night can be an amazing experience. That said, you'll want
          to take precautions against the known and unknown risks you can find on the road in the dark. Today, we'll
          cover how to be safe when riding a bicycle at night.
        </div>
        <div>
          <h3 className={classes.titleArticles}>10 Tips for Safe Biking at Night</h3>
        </div>
        <div className={classes.textBody}>
          Whether biking at night as part of your daily commute, or you just enjoy the quiet that the night time brings.
          Here are 10 tips for staying safe when riding at night:
        </div>
        <div>
          <h3 className={classes.titleArticles}>Tip 1: Light the Road</h3>
        </div>
        <div className={classes.textBody}>
          See and be seen. While this statement is true even if you're cycling during the day, it's doubly so at night.
          Your ability to see the road and hazards ahead of you and be seen by others is your first line of defense when
          biking at night. After all, you and your bike are less visible to drivers on the road since bikes do not have
          lights as cars do.
        </div>
        <div className={classes.textBody}>
          You should always equip your bike with at least a headlight and taillight if you plan on riding it at night.
          Your headlights should be pointed directly ahead of you for a few feet of unobstructed visibility, and your
          taillight should be flashing, as this will help grab the attention of drivers behind you.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Tip 2: Avoid Blinding Motorists</h3>
        </div>
        <div className={classes.textBody}>
          Okay, you want to be seen at night. However, you should avoid attaching a floodlight to your handlebars. While
          biking, your night riding lights should be bright, 400 to 800 lumens should be plenty, though you may need
          more if you frequently ride on the darkest roads without road lines or on off-road paths.
        </div>
        <div className={classes.textBody}>
          When riding at night, speed is also crucial; the faster you go, the brighter the biking night light needs to
          be, or else you might out-ride your visibility range.
        </div>
        <div className={classes.textBody}>
          However, unreasonably bright bike headlights can distract oncoming drivers and lead them to lose control of
          their vehicles.
        </div>
        <div className={classes.textBody}>
          In addition, when riding a bike at night, it's a good idea to wear lights that strap to your ankle. Just like
          how a flashing rear light can catch the attention of motorists, you stand a better chance of being seen if
          they can follow your pedaling motion.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Tip 3: Ride to be Seen</h3>
        </div>
        <div className={classes.textBody}>
          While lights are your first layer of protection when bike riding at night, you also need to avoid drifting
          into the blind spot of automobilists.
        </div>
        <div className={classes.textBody}>
          Generally speaking, drivers have a habit of getting tunnel vision and are fixed on looking ahead. So, when
          biking at night, keep this in mind and stay in their line of sight. Always make sure you're in a visible
          position. You can do this by riding around three feet into the road. By doing so, you can escape the worst of
          the roadside hazards without having to swerve off the road.
        </div>
        <div className={classes.textBody}>
          Best practice is to signal your intentions to others sooner than you typically would during the day, giving
          the drivers enough time to slow down or maneuver.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Tip 4: Obey Traffic Laws</h3>
        </div>
        <div className={classes.textBody}>
          Obeying traffic laws while biking is important for cyclist safety day or night. However, because of the
          lowered visibility at night, its extremely important to ensure you're following the same rules of the road
          that cars do. Always stop at stop signs, ride with the flow of traffic, and avoid riding on sidewalks. It's
          important to be extra aware of your surroundings while biking at night, not only to watch for other cars , but
          also to be aware of pedestrians.
        </div>
        <div className={classes.textBody}>
          When crossing a street, use hand signals to indicate your intention to turn. When biking on roads, always ride
          in the same direction as the vehicle traffic. At intersections, cyclists should never try to squeeze between
          cars and should always use the proper crossing points. Remember to always use caution and be mindful of the
          speed limit. Obey all traffic signs and signals, and always yield to pedestrians.
        </div>
        <div className={classes.textBody}>
          By following all traffic laws and being mindful of your environment, you can help ensure a safe ride for
          everyone.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Tip 5: Dress for the Occasion</h3>
        </div>
        <div className={classes.textBody}>
          When biking at night, it is important to dress properly to remain safe and visible to other drivers and
          pedestrians. This means wearing bright and reflective clothing, such as high-visibility jackets and vests, to
          help others to see you from a distance. Wearing layers to keep warm and dry is also recommended, as the
          temperature can change quickly at night. A biking headlamp to help you see in the dark can also come in handy.
          By dressing properly for biking at night, you can ensure that you remain safe and visible while riding.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Tip 6: Perform a Pre-ride Bike Inspection</h3>
        </div>
        <div className={classes.textBody}>
          It would be best if you always gave your bicycle a once-over before you head out on it. This usually includes
          checking your chain and your tire pressure. Inspect your bike for any potential problems before setting out;
          fixing seemingly easy things like flat tires and damaged chains can be much more difficult in the middle of
          the night.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Tip 7: Know Your Route</h3>
        </div>
        <div className={classes.textBody}>
          Biking at night can be a great experience, but it is important to know your route ahead of time. Taking the
          time to plan your route and familiarize yourself with it can help ensure a safe and enjoyable ride.
        </div>
        <div className={classes.textBody}>
          Before heading out, take the time to look up your route online and make sure you understand where you are
          going. This will help you to avoid any unexpected turns or detours. You should also take note of any areas
          that may be particularly dark or difficult to navigate at night. Pay attention to any features of your route
          that may be difficult to see in the dark, such as intersections, bridges, or sudden changes in elevation.
        </div>
        <div className={classes.textBody}>
          Knowing your route can also help you stay alert and focused while you ride since you will be familiar with the
          roads and be able to anticipate potential hazards. Additionally, if you get lost or have other difficulties,
          you will have an idea of where you are and be able to ask for directions.
        </div>
        <div className={classes.textBody}>
          Overall, planning your route ahead of time can help ensure that you have a safe and enjoyable biking
          experience at night.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Tip 8: Ride with Caution</h3>
        </div>
        <div className={classes.textBody}>
          If you're unfamiliar with riding at night or exploring unknown territory, take your time. Although you may be
          familiar with the road you'll be traveling on, its look will change significantly once the sun goes down. Keep
          an eye out for hazards like wet leaves, and stick to well-known roads or well-lit trails wherever possible.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Tip 9: Ride with Friends</h3>
        </div>
        <div className={classes.textBody}>
          Riding at night can be a great way to get out and explore the city, but it can also be dangerous. One of the
          best ways to stay safe while riding at night is to ride with friends. When you ride with friends, you have a
          group of people who can look out for each other and be aware of their surroundings. This can help you stay out
          of trouble and avoid any potential dangers.
        </div>
        <div className={classes.textBody}>
          Moreover, having friends with you can help you remain visible and make sure that you stay in well-lit areas.
          It can also help give you a sense of security and provide someone to call for help in an emergency situation.
          Overall, riding at night with friends is a great way to stay safe and have fun.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Tip 10: Bundle Up</h3>
        </div>
        <div className={classes.textBody}>
          When biking at night, you must consider that the temperature will drop when the sun goes down. So bundle up
          and be ready for the nighttime chill. If you're expecting to ride consistently through the cooler months,
          buying winter cycling apparel can help fight the cold.
        </div>
        <div>
          <h3 className={classes.titleArticles}>The Bottom Line</h3>
        </div>
        <div className={classes.textBody}>
          Biking at night has additional hurdles to those found during your daytime ride. Generally, it's safe if you
          obey traffic laws and wear a helmet and reflectors at night. However, before you cruise along the evening
          streets, one final consideration is to let someone know you’re heading out. Be sure to also share your route.
          If something happens to you during your night bike ride, this extra measure can help you be found. Extra
          precautions are a must!
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
            router.push('/articles/how-to-choose-a-bike-helmet');
            window.scrollTo(0, 0);
          }}>
          <div className={classes.back}>
            <img src={iconBack} alt="icon tick" className={classes.iconTick} /> Previous post
          </div>
          <div className={classes.titlePost}>How to Choose a Bike Helmet</div>
        </div>
        <div
          className={classes.wrapNext}
          onClick={() => {
            router.push('/articles/take-the-right-pictures-for-your-listing');
            window.scrollTo(0, 0);
          }}>
          <div className={classes.next}>
            Next post <img src={iconBack} alt="icon tick" className={classes.iconNext} />
          </div>
          <div className={classes.titlePost}>Take better photos to help sell your used bike</div>
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
      <h1 className={classes.customSeoH1}>Biking at Night: An Essential Guide to Staying Safe</h1>
    </Container>
  );
};

export default ArticleSection;
