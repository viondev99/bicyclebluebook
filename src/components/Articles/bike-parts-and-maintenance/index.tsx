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
import classes from './bike-parts-and-maintenance.module.scss';
import images from '@images';

const BikePartsAndMaintenance: FC = () => {
  const { asPath } = useRouter();
  const screen = useScreenDetect();
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
          <h1 className={classes.titleArticles}>A Quick and Easy Guide to Bike Parts & Maintenance</h1>
        </div>
      </div>
      <div className={classes.sectionBody1}>
        <div className={classes.coverSection1}>
          <img src={images.common.imgArticle1} alt="arrow right icon" className={classes.imageBgr} />
        </div>
      </div>
      <div className={classes.wrapBody}>
        <div className={classes.textBody}>
          We get it — your bike is like your baby and you want to take care of it, but you’re no mechanic. Luckily, it’s
          fairly easy to learn basic bike maintenance and keep your bike in tip-top shape.
        </div>
        <div className={classes.textBody}>
          That’s why we always recommend that cyclists spend some time learning basic bike parts & maintenance
          requirements. It will not only make your bike more efficient and your ride more comfortable, but it will also
          help you save money (and a lot of headaches) in the long run. For example, learning how to keep your chain
          healthy and lubricated is much better than paying a professional to fix a broken one down the line.
        </div>
        <div className={classes.textBody}>
          In this guide, we’ll go over basic bike parts and how to keep up road bike maintenance — without a garage full
          of pricey equipment.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Bicycle Parts: an Overview</h3>
        </div>
        <div className={classes.textBody}>
          <p>
            There are many things in life we take for granted because we don’t take the time to learn their intricacies.
            Getting to know your bike and all of its various components will help you feel more connected and
            appreciative while you cycle. Maintenance also becomes a lot easier when you know the terms in all those
            online DIY repair guides.
          </p>
          <p>Here’s a quick breakdown of basic bicycle parts:</p>
        </div>
        <div>
          <h4 className={classes.titleArticles}>Bike Frame</h4>
        </div>
        <div className={classes.textBody}>
          The frame is the structural core of the bike — think of it as the bike’s backbone. Most modern bikes are made
          of aluminum alloy, with high-end bikes often crafted from carbon fiber and titanium.
        </div>
        <div>
          <h4 className={classes.titleArticles}>Fork</h4>
        </div>
        <div className={classes.textBody}>
          The fork joins the front wheel and frame. The handlebars connect to the fork with the stem and this is how you
          steer the bike.
        </div>
        <div>
          <h4 className={classes.titleArticles}>Headset</h4>
        </div>
        <div className={classes.textBody}>
          The headset is located in the headtube of the bicycle frame. It acts as the interface between the fork and
          frame allowing the fork to rotate to provide steering.
        </div>
        <div>
          <h4 className={classes.titleArticles}>Stem</h4>
        </div>
        <div className={classes.textBody}>
          A bicycle's stem is what connects the handlebars to the bike’s frame. The length and angle of the stem will
          provide different riding characteristics. For example, a shorter stem will result in more active steering
          while a longer stem will make the smaller movements in the handlebars not as noticeable.
        </div>
        <div>
          <h4 className={classes.titleArticles}>Handlebars</h4>
        </div>
        <div className={classes.textBody}>
          This one likely doesn’t need much introduction. Handlebars are used to steer the bike and are often compared
          to the steering wheel in a car.
        </div>
        <div>
          <h4 className={classes.titleArticles}>Brake Levers</h4>
        </div>
        <div className={classes.textBody}>
          Brake levers integrate with the brake pads by hydraulic or mechanical pull. Hydraulic brakes use fluid to
          engage the brake pads while mechanical brakes utilize a cable.
        </div>
        <div>
          <h4 className={classes.titleArticles}>Crankset</h4>
        </div>
        <div className={classes.textBody}>
          The crankset is a key part of the driving force of your bike, the drivetrain. It is powered by your legs and
          connected to the rear derailleur with the chain. The front and rear derailleur guide the chain to the correct
          gears based on the cyclist’s preference and riding terrain.
        </div>
        <div>
          <h4 className={classes.titleArticles}>Bottom Bracket</h4>
        </div>
        <div className={classes.textBody}>
          The bottom bracket is a small piece that connects the crankset to the bike’s frame, keeping everything stable
          and moving. It is a critical component of the bike’s drivetrain.
        </div>
        <div>
          <h4 className={classes.titleArticles}>Chain</h4>
        </div>
        <div className={classes.textBody}>
          When you rotate your legs, the chain moves and propels the bike forward. This part is one that will need more
          regular upkeep and maintenance.
        </div>
        <div>
          <h4 className={classes.titleArticles}>Cassette</h4>
        </div>
        <div className={classes.textBody}>
          <p>
            The cassette is the cluster of gears on the rear wheel. They’re part of the drivetrain and are responsible
            for rear wheel drive.
          </p>
        </div>
        <div>
          <h4 className={classes.titleArticles}>Derailleur</h4>
        </div>
        <div className={classes.textBody}>
          This is what actually changes gears on the bike, moving the chain from one set of sprockets to another.
        </div>
        <div>
          <h3 className={classes.titleArticles}>How to Maintain a Bike</h3>
        </div>
        <div className={classes.textBody}>
          <p>
            As you probably already know, bicycle maintenance is an important part of being a bike owner. But that means
            more than just performing some basic DIY road bike repairs every once in a while. Whether you ride your bike
            to work every day, are training for a big race, or just like to hit the trails a few times a month, regular
            maintenance keeps your bike in tip-top shape.
          </p>
          <p>Here are a few tips to get you started:</p>
        </div>
        <div>
          <h4 className={classes.titleArticles}>Regularly Clean Your Bike</h4>
        </div>
        <div className={classes.textBody}>
          Keeping your bike clean is the first step in basic road bicycle maintenance. When you regularly clean your
          bike, you reduce the chances of dirt and grime accumulating. This improves your bike’s performance and avoids
          more severe problems down the road. Be sure to pay extra attention when cleaning your bike chain, as this is
          often a culprit of grime buildup.
        </div>
        <div>
          <h4 className={classes.titleArticles}>Check Tire Pressure</h4>
        </div>
        <div className={classes.textBody}>
          You know how important proper tire pressure is in a car, so why should your bike be any different? Because
          your tire pressure is all that stands between you and the road, adequately filling them is essential for
          bicycle repairs and maintenance. This means checking tire pressure regularly and making sure you don’t fill
          them up too much (this can also be dangerous). We recommend investing in a floor pump with a reliable tire
          pressure gauge for the most accurate results.
        </div>
        <div className={classes.textBody}>
          Not sure how much air to put in your tires? All tires have their designated range printed on the side. As long
          as you’re within this range, you’re good to go!
        </div>
        <div>
          <h4 className={classes.titleArticles}>Inspect Brake Pads</h4>
        </div>
        <div className={classes.textBody}>
          The brake pads on your bike suffer some of the most wear and tear, which means they need more upkeep than
          other parts. This is especially true for basic mountain bike maintenance, which requires regular brake pad
          checks as a result of sudden braking and tough terrain. Failing to properly monitor and maintain your brake
          pads can have serious consequences — just like a vehicle.
        </div>
        <div className={classes.textBody}>
          But how can you tell whether your brake pads need a little TLC? There are a few things to look out for:
          <ul>
            <li>If you look at your pads and the grooves are hardly visible, that means they are badly worn.</li>
            <li>
              If squeezing the brake lever causes it to travel more than midway toward the handlebars, the brakes should
              be tightened. Adjusting the barrel adjuster next to the brake lever should do the trick. If it doesn't
              work, you'll need to open the brake nut using an Allen key, pull the brake wire taut, and re-tighten it.
            </li>

            <li>
              If your brakes start to screech, it might be time to switch them out. However, sometimes they’ll screech
              simply because they’re dirty, so make sure to look out for other signs of wear and tear before spending
              the money on a new set of brake pads.
            </li>

            <li>
              If your brakes start to feel less responsive after you’ve tightened and cleaned them, it’s time for a
              change.
            </li>
          </ul>
          Luckily, changing brake pads on a bike is generally a fast, simple, and inexpensive road bike repair.
        </div>
        <div>
          <h4 className={classes.titleArticles}>Lubricate Moving Parts</h4>
        </div>
        <div className={classes.textBody}>
          Friction is the number one cause of wear and tear on any bike, making it a critical component of bicycle
          maintenance. Remember what we said about the chain earlier? While the chain is often the most likely culprit,
          it’s not the only one. Get some lube designed for your bike and use it gently anywhere metal meets metal.
          However, remember that you must clean your bike before applying lube (this includes the chain).
        </div>
        <div>
          <h4 className={classes.titleArticles}>Have It Checked by a Professional</h4>
        </div>
        <div className={classes.textBody}>
          Who doesn’t want to save money on bike maintenance? These days, we’re all looking for ways to cut costs. It’s
          easy to want to fix bike issues on your own, especially when you have a DIY mindset.
        </div>
        <div className={classes.textBody}>
          While there’s a lot you can do yourself, sometimes it’s best to have your bike maintained by a technician with
          the proper equipment. Removing, installing, and servicing many of these parts necessitates using dedicated
          equipment. A professional will be able to expertly assess your bike’s overall health, including checking the
          bike’s balance, fixing any minor damage to the spokes, and more.
        </div>
        <div className={classes.textBody}>
          Generally speaking, it’s recommended that you bring your bike in for a “check up” at least once a year. Unless
          you’re trained in bike parts & maintenance, you may not spot an issue before it’s too late.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Find Your Bike with BicycleBlueBook.com </h3>
        </div>
        <div className={classes.textBody}>
          The last thing you want is for your bike to break down mid-ride and have to shell out a bunch of money in
          unexpected expenses. Riding your bike should be fun, not costly!
        </div>
        <div className={classes.textBody}>
          Aside from the obvious benefit of saving you money, understanding basic bike parts & maintenance will improve
          your bike’s performance on the road — as well as yours.
        </div>
        <div className={classes.textBody}>
          If your current ride is beyond repair or you’re looking to upgrade, contact BicycleBlueBook.com. We use
          cutting-edge technology, live data, and updated algorithms to ensure our online marketplace offers the best
          values.
        </div>
        <div className={classes.textBody}>
          Check out BicycleBlueBook.com and explore our inventory of{' '}
          <a className={classes.link} href="https://www.bicyclebluebook.com/marketplace/buy-now/">
            used bicycles for sale
          </a>
          . Find your next bike today!
        </div>
      </div>
      <div className={classes.hr} />
      <div className={classes.wrapChangePage}>
        <div
          className={classes.wrapBack}
          onClick={() => {
            router.push('/articles/gear-for-cycling');
            window.scrollTo(0, 0);
          }}>
          <div className={classes.back}>
            <img src={images.iconBack} alt="icon tick" className={classes.iconTick} /> Previous post
          </div>
          <div>The top gear for cycling: Your guide to must-have road bike accessories</div>
        </div>
        <div
          className={classes.wrapNext}
          onClick={() => {
            router.push('/articles/bike-tune-up-check-list');
            window.scrollTo(0, 0);
          }}>
          <div className={classes.next}>
            Next post <img src={images.iconBack} alt="icon tick" className={classes.iconNext} />
          </div>
          <div>Bike Tune-Up Checklist: How to Tune Up Your Road or Mountain Bike</div>
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
      <h1 className={classes.customSeoH1}>A Quick and Easy Guide to Bike Parts & Maintenance</h1>
    </Container>
  );
};

export default BikePartsAndMaintenance;
