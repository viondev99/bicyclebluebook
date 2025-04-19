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
import classes from './how-to-choose-a-bike-helmet.module.scss';
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
  const isMobie = screen.currentWidthScreen < 768;
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
  const imgChooseHelmet = useMemo(() => {
    if (isPc) {
      return `${CONFIG.IMAGE_CDN_URL}/how_to_choose_a_bike_helmet_pc.webp`;
    }
    if (isMobie) {
      return `${CONFIG.IMAGE_CDN_URL}/how_to_choose_a_bike_helmet_mobile.webp`;
    }
    return `${CONFIG.IMAGE_CDN_URL}/how_to_choose_a_bike_helmet_tablet.webp`;
  }, [isMobie, isPc]);
  return (
    <Container className={classes.container}>
      <div className={classes.headerSection}>
        <div className={classes.wrapDateArticles}>
          <p className={classes.dateArticles}>March 2023</p>
        </div>
        <div className={classes.wrapTitleArticles}>
          <h1 className={classes.titleArticles}>How to Choose a Bike Helmet</h1>
        </div>
      </div>
      <div className={classes.sectionBody1}>
        <div className={classes.coverSection1}>
          <Image src={imgChooseHelmet} alt="" className={classes.imageBgr} unsized={true} unoptimized={true} />
        </div>
      </div>
      <div className={classes.wrapBody}>
        <div className={classes.textBody}>
          A bike helmet is a must-have for any cyclist. While they may not always be the first consideration when it
          comes to cycling gear, wearing one can be the difference between surviving a crash or not, should the worst
          happen.
        </div>
        <div className={classes.textBody}>
          When searching for a bike helmet, choosing one that fits your head correctly and meets safety standards is
          critical.
        </div>
        <div className={classes.textBody}>
          Today, we'll cover what to look for in a bike helmet, the importance of wearing one, the features to pay
          attention to, and what you can expect from different helmet types.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Why You Should Never Ride Without a Helmet</h3>
        </div>
        <div className={classes.textBody}>Choosing the right helmet is just as critical as your choice of bike.</div>

        <div className={classes.textBody}>
          Nearly 800 cyclists are killed yearly, and half a million more are treated in U.S. hospital emergency rooms.
          Of these tragic accidents, injuries to the head led to almost two-thirds of fatalities and one-third of
          injuries.
        </div>
        <div className={classes.textBody}>
          According to research funded by the National Institute of Health, wearing a bicycle helmet can significantly
          reduce the risk of injury in the event of a collision. Researchers at the Cochrane Database of Systematic
          Reviews even found that cyclists of all ages who used helmets had a{' '}
          <a
            className={classes.link}
            href="https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD001855/abstract">
            63-88% lower risk{' '}
          </a>
          of sustaining a traumatic brain injury.
        </div>

        <div className={classes.textBody}>
          Additionally, bicycle helmets are required by law in most states. Some jurisdictions mandate helmet use for
          all riders, while others limit exemptions to minors under a certain age.
        </div>
        <div className={classes.textBody}>
          A staggering{' '}
          <a className={classes.link} href="https://crashstats.nhtsa.dot.gov/Api/Public/ViewPublication/810625">
            70% of all fatal accidents
          </a>{' '}
          happen in city environments, so if you’re riding in a high-traffic area, it's crucial to take extra
          precautions to stay safe and visible to other motorists. Wearing a helmet is an excellent first step in
          reducing the likelihood of head injuries occurring during your ride.
        </div>

        <div>
          <h3 className={classes.titleArticles}>How to Choose a Bike Helmet: Four Things to Consider</h3>
        </div>
        <div className={classes.textBody}>
          There is a wide range of bike helmet styles on the market. While you might think choosing a bike helmet is
          relatively straightforward, it can be challenging when you don’t know what to look for. You might also be
          overlooking certain features that you should consider.
        </div>
        <div className={classes.textBody}>
          First, finding a helmet that stands out on the road is critical. To do this, consider choosing a
          bright-colored helmet that will increase visibility to motorists. You can make your helmet even more visible
          by wearing one with a headlamp or reflective tape.
        </div>
        <div className={classes.textBody}>
          Additionally, if you're spending your weekends tearing up downhill tracks, the type of helmet you need will be
          significantly different than the one you pick to ride to work. Since you're going to wear a helmet anyway, you
          should get the best one possible for your riding situation.
        </div>
        <div className={classes.textBody}>
          One thing we can't stress enough is this: never base how to choose a bike helmet solely on aesthetics. Safety
          should always be the top priority.
        </div>
        <div className={classes.textBody}>
          Here are four additional considerations regarding how to buy a bike helmet:
        </div>
        <div>
          <h4 className={classes.numberTitle}>1. Types of Bike Helmets</h4>
        </div>
        <div className={classes.textBody}>
          You can quickly narrow your helmet selection down by browsing three primary categories. These bike helmet
          types include:
        </div>
        <div>
          <h4 className={classes.titleArticles}>Recreational Bike Helmets</h4>
        </div>
        <div className={classes.textBody}>
          When it comes to basic impact protection, recreational bike helmets are the most cost-effective option.
        </div>
        <div className={classes.textBody}>
          Those who ride bikes for commuting or recreationally often prefer this type of helmet. Some standard commuter
          and recreational helmets feature a visor similar to those used on mountain bikes. Others have built-in front
          and rear LED light mounts for increased nighttime visibility.
        </div>
        <div className={classes.textBody}>
          A BMX or skate-style helmet, a full hardshell helmet with more head covering than a regular helmet, is another
          option if you're in the market for a commuting or recreational helmet. Compared to other helmets, the strap
          and retention system are relatively easy to use and provide a more streamlined look for casual rides.
        </div>
        <div>
          <h4 className={classes.titleArticles}>Road Bike Helmets</h4>
        </div>
        <div className={classes.textBody}>
          Road bike helmets are the most aerodynamic option available. While these are fantastic for professional
          riders, recreational helmets may be more user-friendly for beginners.
        </div>

        <div className={classes.textBody}>
          The top options are lightweight and ventilated to keep your head cool. The helmet is secured to the rider with
          an adjustable retention chin strap. The Y-shape of the straps should be adjustable so that they don't rub
          against your ears. The width of the retention system should be changeable, and the system itself should be
          simple enough to alter while riding.
        </div>

        <div className={classes.textBody}>
          Retention systems might be either parallel sliders (seen on cheaper helmets) or an adjustable dial.
        </div>
        <div className={classes.textBody}>
          A tough outer shell always protects a helmet's EPS foam interior. Try to find a helmet where the shell is
          molded into it (making it part of the EPS.)
        </div>
        <div className={classes.textBody}>
          Over time, a glued-on shell will flake off. When shopping for a helmet, look for one with a thick outer shell
          that completely encases the helmet's inner shell.
        </div>
        <div className={classes.textBody}>
          Padding is another essential feature of a road bike helmet. The pads help secure the helmet to your head,
          making it more secure and comfortable. In addition to being treated with anti-bacterial agents to prevent the
          growth of bacteria, high-quality pads are removable, allowing for easy washing and drying. While helmet pads
          might vary widely, it's always preferable to have a second set on hand in case one set is damaged.
        </div>
        <div className={classes.textBody}>
          Some helmets have been tested in wind tunnels to be as drag resistant as possible and provide aerodynamic
          benefits at high speeds. The vents on some helmets can be closed off, making the helmet more aerodynamic with
          a clip-on aero shell.
        </div>
        <div>
          <h4 className={classes.titleArticles}>Mountain Bike Helmets</h4>
        </div>
        <div className={classes.textBody}>
          A mountain bike helmet may be your most critical trail gear. Lightweight, well-ventilated helmets are the norm
          in modern helmet design.
        </div>
        <div className={classes.textBody}>
          Because of the ventilation in these helmets, you are less likely to overheat as you ride through tough terrain
          on a hot summer day.
        </div>

        <div className={classes.textBody}>
          While similar to recreational helmets in visor design, mountain bike helmets are tougher and better suited to
          protecting riders on rougher surfaces or when traversing obstacles like rocks.
        </div>

        <div className={classes.textBody}>
          One popular option for mountain bike riders is a helmet with full-face protection. A mountain biker's head
          protection options are centered on three main varieties.
        </div>
        <ul>
          <li className={classes.textBody}>The standard helmet for cross-country is small, light, and airy.</li>
          <li className={classes.textBody}>
            A cross-country helmet is a good option if you prefer rides where ease of ascent is as crucial as
            protection.
          </li>
          <li className={classes.textBody}>
            A trail helmet's coverage of your head is typically more than that of a road helmet. It is handy if you want
            even more protection than a cross-country helmet provides. When riding downhill, it's vital to have maximum
            protection, and a full-face helmet does just that.
          </li>
        </ul>
        <div>
          <h4 className={classes.numberTitle}>2. Sizing and Fit </h4>
        </div>
        <div className={classes.textBody}>
          Here are a few tips on how to choose a bike helmet and achieve a snug, comfortable fit.
        </div>
        <div>
          <h4 className={classes.titleArticles}>Measure the circumference of your head</h4>
        </div>
        <div className={classes.textBody}>
          Learning how to measure your head for a bike helmet is pretty simple. All you need to do is wrap flexible
          measuring tape snugly around your head above your forehead.
        </div>
        <div className={classes.textBody}>
          If you don't have a cloth measuring tape, you can always use a piece of string for bike helmet measurements.
          After taking your head circumference, pick between the bike helmet sizes closest to your measurements.
        </div>
        <div>
          <h4 className={classes.titleArticles}>Put on the helmet</h4>
        </div>
        <div className={classes.textBody}>
          The helmet's front should rest no higher than an inch over your eyebrows to protect your forehead. Tweak the
          retention straps until the helmet fits snugly without any give or wiggle room. Any awkward spots could mean
          the helmet is too small for your head. Only one finger should fit under the strap at the base of your chin.
          The helmet should make light but noticeable contact with your head.
        </div>
        <div className={classes.textBody}>
          Only one finger should fit under the strap at the base of your chin. The helmet should make light but
          noticeable contact with your head.
        </div>
        <div>
          <h4 className={classes.titleArticles}>Shake your head</h4>
        </div>
        <div className={classes.textBody}>
          Once everything is buckled in place, give your head a gentle shake. If you notice some give, twist the
          retention mechanism a few times to prevent noticeable movement. When you've found the optimal fit for your
          helmet, there shouldn't be more than an inch of movement in any direction during the shake test.
        </div>
        <div>
          <h4 className={classes.titleArticles}>Ready, Set, Go!</h4>
        </div>
        <div className={classes.textBody}>
          Now you're prepared to hit the open road! One important thing to note is that helmet straps often come loose
          while riding or transporting a bike. Before every trip, give your helmet a brief shaking test.
        </div>
        <div>
          <h4 className={classes.numberTitle}>3. Budget and Features</h4>
        </div>
        <div className={classes.textBody}>
          If you’re in the market for a helmet, you’re probably wondering if you should opt for an expensive option or
          cheaper one. Are you really getting more protection if you choose a helmet with a heftier price tag?
        </div>
        <div className={classes.textBody}>
          The key differentiating factors between expensive and more budget-friendly helmets are typically construction,
          weight, air circulation, aerodynamics, and comfort.
        </div>
        <div className={classes.textBody}>
          A bike helmet is made up of multiple individual parts. The shell is the outer covering of the helmet. Most
          helmets are protected from damage in a collision by plastic sheathing.
        </div>
        <div className={classes.textBody}>
          Typically, the outer shell of cheaper helmets is glued or taped on, but the inner shell of more expensive
          choices is molded along with the outer shell to provide greater coverage and lighter weight.
        </div>
        <div className={classes.textBody}>
          More expensive helmets have removable padding and are available in different densities to better conform to
          the head. Chin retention mechanisms on more costly helmet options are softer and more pliable. Additionally,
          several high-end helmet manufacturers sell extra pads for easy replacement.
        </div>
        <div className={classes.textBody}>
          Ultimately, your helmet choice comes down to preference. When you pay more for a helmet, you may get more
          comfort, vents, and stylish graphics, but studies have found that the basic impact protection of more costly
          helmets is the same as cheaper options. Just be sure to find a helmet that fits you properly.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Are You Ready to Ride? </h3>
        </div>
        <div className={classes.textBody}>
          Now that you know how to choose a bike helmet, it's time to{' '}
          <a href="https://articles.bicyclebluebook.com/buying-a-new-ride-has-never-been-easier/">
            learn how to choose a bike
          </a>
          !
        </div>
        <div className={classes.textBody}>
          If you want to upgrade to a new ride, check out Bicycle Blue Book. We have the finest selection of pre-owned{' '}
          <Link href={`${CONFIG.BASE_URL}/marketplace/buy-now/`}>bicycles for sale</Link> on the market.
        </div>
        <div className={classes.textBody}>
          Finding and selling has never been easier with our trade-in program. This option is a fast way to bring down
          the price of the bike that’s caught your eye.
        </div>
        <div className={classes.textBody}>
          Don’t have a bike you want to trade in? That’s okay! You can also explore our marketplace, which includes a
          vast selection of top-quality, professionally inspected used bikes. No matter what type of ride you’re looking
          for, we have the perfect bike for you.
        </div>
        <div className={classes.textBody}>
          Contact us today to find your next set of wheels. The bike of your dreams is just around the corner!
        </div>
      </div>
      <div className={classes.hr} />
      <div className={classes.wrapChangePage}>
        <div
          className={classes.wrapBack}
          onClick={() => {
            router.push('/articles/bicycle-sizing-basics');
            window.scrollTo(0, 0);
          }}>
          <div className={classes.back}>
            <img src={iconBack} alt="icon tick" className={classes.iconTick} /> Previous post
          </div>
          <div className={classes.titlePost}>Bicycle Sizing Basics</div>
        </div>
        <div
          className={classes.wrapNext}
          onClick={() => {
            router.push('/articles/biking-at-night');
            window.scrollTo(0, 0);
          }}>
          <div className={classes.next}>
            Next post <img src={iconBack} alt="icon tick" className={classes.iconNext} />
          </div>
          <div className={classes.titlePost}>Biking at Night: An Essential Guide to Staying Safe</div>
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
      <h1 className={classes.customSeoH1}>How to Choose a Bike Helmet</h1>
    </Container>
  );
};

export default ArticleSection;
