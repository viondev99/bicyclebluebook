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
import classes from './gear-for-cycling.module.scss';
import images from '@images';

const ArticleSection: FC = () => {
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
          <h1 className={classes.titleArticles}>
            The Top Gear for Cycling: Your Guide to Must-Have Road Bike Accessories
          </h1>
        </div>
      </div>
      <div className={classes.sectionBody1}>
        <div className={classes.coverSection1}>
          <img src={images.common.imgArticle2} alt="arrow right icon" className={classes.imageBgr} />
        </div>
      </div>
      <div className={classes.wrapBody}>
        <div className={classes.textBody}>
          There’s no better feeling than riding your bike down an open road, with the warm sun on your face. Before
          heading out on your next ride, there are some cycling essentials every cyclist needs to consider.
        </div>
        <div className={classes.textBody}>
          Whether you're a seasoned cyclist hopping on your road bike or getting in the saddle for the first time,
          everyone needs the right gear for cycling. For beginners and experts alike, it’s not just a matter of comfort
          on the road or trail — it’s also about safety. No matter where you are in your cycling journey,
          BicycleBlueBook.com will get you rolling in the right direction.
        </div>
        <div className={classes.textBody}>
          If you want to be a safe and well–prepared cyclist, gear checklists are the best place to start. This guide
          provides the ultimate checklist of essential cycling gear to ensure you have everything you need for your next
          ride, no matter the distance.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Must-Have Gear for Cycling</h3>
        </div>
        <div className={classes.textBody}>
          Cycling isn’t just a great form of exercise, it’s also{' '}
          <a className={classes.link} href="https://momentummag.com/mental-health-benefits-of-cycling/">
            great for your mental health
          </a>
          . What’s also good for your mental health? Knowing you’re prepared for anything out on the road. Whether
          you’re commuting to work, exploring a new nature trail, or joining a friend for a lazy afternoon ride, make
          sure you have these bike essentials on hand. They’re a no-brainer for a safe and enjoyable ride!
        </div>
        <div>
          <h3 className={classes.titleArticles}>Helmet</h3>
        </div>
        <div className={classes.textBody}>
          We know — this one is obvious. But it’s #1 on any list of essential biking equipment for a reason. Wearing a
          helmet reduces the risk of head injury by a{' '}
          <a
            className={classes.link}
            href="https://my.clevelandclinic.org/health/articles/4374-bicycle-helmet-safety#:~:text=About%202%2F3%20of%20the,as%20much%20as%2085%20percent.">
            whopping 85 percent
          </a>
          !
        </div>
        <div className={classes.textBody}>
          A wide range of sizes and padding densities are available for bicycle helmets, allowing for a snug and
          comfortable fit for each rider. Internal pads should be positioned in the helmet's front, rear, and sides
          wherever there is extra room for the cyclist's head. The pads need to be spread out uniformly inside the
          helmet to ensure comprehensive protection.
        </div>
        <div className={classes.textBody}>
          This is not like trying on a sweater that’s a little too big or small — your helmet must fit perfectly. If the
          helmet still doesn't seem snug after you've adjusted the pads and buckled the straps, try a different helmet.
          A correctly fitted and fastened helmet should be impossible to remove from the head without twisting or
          pulling.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Water Bottle</h3>
        </div>
        <div className={classes.textBody}>
          Drinking plenty of water is essential to staying hydrated and safe on the road. While dehydration can happen
          at any time throughout the year, it’s especially important to bring a water bottle during those hot and sweaty
          summer rides.
        </div>
        <div className={classes.textBody}>
          A bottle with a capacity of 21-26 ounces is ideal, though it depends on how long your ride will be. You'll
          find the vast majority of cycling bottles in this size range, making them compatible with most water bottle
          cages. While a lesser capacity will suffice for commuting or riding about town, cyclists should be aware of
          their total water capacity for longer journeys and consider bringing additional bottles if they anticipate
          difficulty obtaining water.
        </div>
        <div className={classes.textBody}>
          Dehydration on the road is more than feeling a little thirsty or weak — it can put you and those around you in
          danger. It can result in cramps, dizziness, and in severe cases, fainting. In addition to bringing enough
          water on your ride, it’s also important to know how to recognize the{' '}
          <a
            className={classes.link}
            href="https://www.bicycling.com/health-nutrition/a25051470/signs-of-dehydration/#:~:text=Your%20Heart%20Is%20Racing,our%20muscles%2C%E2%80%9D%20says%20Modabber.">
            signs of dehydration
          </a>
          .
        </div>
        <div className={classes.textBody}>
          While choosing a water bottle that matches your bike and personality is fun, all you really need is one that
          keeps you hydrated and is easy to use and access. Consider doubling up on bottles for your bike adventure and
          the ride home.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Snacks</h3>
        </div>
        <div className={classes.textBody}>
          While cycling, your body is the engine and like every engine, it needs fuel. One of the most important cycling
          must-haves is bringing proper nutrition on your ride. Ask yourself: Have you ever worked out without eating
          first? Not a great experience.
        </div>
        <div className={classes.textBody}>
          For cycling journeys that will last more than an hour, it’s essential to bring snacks and water to nourish
          your body and keep your strength up. The number of snacks you bring depends on the duration and intensity of
          your ride, so make sure to do some mental math before heading out the door. As a general rule of thumb, aim to
          consume between a minimum of 30 to 60 grams of carbohydrates every hour.
        </div>
        <div className={classes.textBody}>
          Without enough food to keep up your blood glucose levels, you'll feel depleted long before you reach your
          goal. But it goes much deeper than not hitting your cycling goals or experiencing inferior performance on the
          roads. Similar to dehydration, you can put your body at risk, experiencing dizziness or feeling faint.
        </div>
        <div className={classes.textBody}>
          So, next time you’re cycling, be sure to tuck your favorite super snacks into your jersey pockets. Your body
          will thank you.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Hand Pump</h3>
        </div>
        <div className={classes.textBody}>
          Anything can happen on the road, which is why a hand pump is always on our list of essential road bike
          accessories. Manual hand pumps, a more portable alternative to the standard T-shaped standing bicycle pump,
          are available in various sizes and price ranges. Many of them are bracket-mounted on the frame of the bicycle.
          Some options are small enough to easily store in a seat bag or a pocket. You can also find ones that come with
          mounts that you can attach next to your bottle cage.
        </div>
        <div className={classes.textBody}>
          These portable hand pumps are easy to use. Simply clip onto the valve's stem and get the pump going! For a
          smaller and less laborious option, consider a CO2 inflator instead. No matter which one you choose, it’s
          important to have a pump on hand so you don’t get stuck on the side of the road.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Chain Lube</h3>
        </div>
        <div className={classes.textBody}>
          Your chain is one of the hardest working components on your bike (other than you, of course). That means a
          higher risk of damage from wear and tear, as well as a higher demand for maintenance. But again — anything can
          happen on the road, and you never know when your bike might need a little extra TLC.
        </div>
        <div className={classes.textBody}>
          But with so many kinds out there, which one should you use? The short answer is: it depends on your bike and
          how you use it. Wet, dry, ceramic, and wax lubes are just a few of the varieties of lubes for bicycles.
          Synthetic oils and other friction-reducing additives like PTFE (Teflon) are the main components of most lubes;
          these are combined with evaporable carrier fluids. Waxed-based lubricants have recently surged in popularity
          among performance-oriented cyclists, partly due to the greater availability of independent testing data.
        </div>
        <div className={classes.textBody}>
          When lubing a bike chain, the oil must reach the chain's inner workings (among the rollers and pins). It's
          essential to thoroughly clean before applying any lubricant to ensure nothing gets stuck in there. Chain lube
          keeps your bike operating at peak performance, which keeps you at peak performance as well. So don’t skimp on
          chain maintenance and always bring backup chain lube on your rides.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Lights</h3>
        </div>
        <div className={classes.textBody}>
          Lights might be one of the most important things on this list of gear for cycling safety. Studies have shown
          that bike lights can{' '}
          <a
            className={classes.link}
            href="https://www.outsideonline.com/outdoor-gear/bikes-and-biking/you-have-no-excuse-not-bike-light-day-or-night/">
            reduce the risk of accidents by 30-50 percent
          </a>{' '}
          during the daytime — so just imagine how much they reduce risk at night. Hopefully, this helps you see the
          light!
        </div>
        <div className={classes.textBody}>
          There’s a reason why lights are always on every list of must-have road bike accessories. You should always
          have at least two lights on your bike, one facing forward to light the way and another facing backward to make
          you more visible to oncoming traffic. Your headlights should be white, bright, and set to a solid beam so you
          can see any potential hazards ahead. The output of the most reliable daytime headlights is between 250 and
          2,000 lumens.
        </div>
        <div className={classes.textBody}>
          Your taillight must be red and blinking to be seen by other drivers, but it need not be exceptionally bright.
          You can get away with a weaker rear light (50-100 lumens) when compared to your headlight. It doesn't have to
          improve your vision — it just has to be seen.
        </div>
        <div className={classes.textBody}>
          The bottom line is that no matter what setting your light is at (blinking or static) or how expensive it was,
          it’s worthless if it’s not visible to traffic. That means not only investing in a bright enough light, but
          that placement and maintenance are also a crucial part of road safety. Make sure your lights are placed
          directly in the middle of your handlebars and back of your bike, that they’re not drooping or pointing down
          towards the ground, and that their batteries don’t need to be replaced. Pro-tip: Anytime you’re about to head
          out on a ride (especially if riding at night), take 20 steps in front of and behind your bike to ensure the
          lights are clear and pointed in the right direction.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Gloves</h3>
        </div>
        <div className={classes.textBody}>
          Cycling is a great way to work up a sweat, which means those handlebars can get slippery real quick! That’s
          why we always recommend cycling gloves to keep your grip firm and strong, as well as offer a layer of
          protection if you take a little spill.
        </div>
        <div className={classes.textBody}>
          The benefits extend past being a great safety measure — they can also make your ride more comfortable. For
          example, padded palms on a pair of gloves help reduce fatigue by isolating your hands from vibrations
          transmitted from the bike and the handlebar. You can get thicker gloves for winter rides and light, airy
          gloves for summer cycling.
        </div>
        <div className={classes.textBody}>
          If you would rather not have any padding at all, there are plenty of gloves available with a plain, unpadded
          palm. Just keep in mind that these will only serve to absorb moisture from your hands, they won’t provide much
          defense in case of a fall. Sticking your hands out in front of you to break your fall is frequently an
          automatic response, and padded gloves can reduce the severity of any cuts or scrapes.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Locks</h3>
        </div>
        <div className={classes.textBody}>
          A reliable, heavy duty lock should be on any list of biking essentials. In fact, bicycle theft is one of the
          most frequently reported crimes in the U.S., with approximately{' '}
          <a
            className={classes.link}
            href="https://socalcycling.com/2022/02/28/bicycle-theft-is-becoming-increasingly-common/">
            190,000 bike thefts
          </a>{' '}
          reported each year. So don’t make it easy for the bad guys and get a lock for your bike.
        </div>
        <div className={classes.textBody}>
          But what kind of lock should you get? While it will depend on a variety of factors — like the size of your
          bike, how often you use it, what weather you typically cycle in, and your price range — there are some locks
          that are more secure than others. Here are the different types of bike locks available, ranked from least to
          most secure: cable locks, chain locks, folding locks, and U-locks.
        </div>
        <div className={classes.textBody}>
          When it comes to methods for unlocking your bike, you’ve typically got two options: combination vs. key locks.
          Which one you choose is up to you. For example, if you’re prone to losing things, go for the combination lock.
          But if you’re terrible at remembering combinations, a key lock might be better for you.
        </div>
        <div>
          <h3 className={classes.titleArticles}>Repair Kit</h3>
        </div>
        <div className={classes.textBody}>
          A critical cycling need is to have the tools necessary to change a flat tire, patch a broken chain, or secure
          a loose bolt in the event that they break while you're out riding. The last thing you want is to end up with a
          damaged bike that you need to walk back home (and risk worsening the damage along the way).
        </div>
        <div className={classes.textBody}>
          The tools you require will depend on the terrain you'll be traveling on, the distance you'll be traveling, and
          your level of mechanical expertise. However, there are some basics that any well-prepared cyclist should have
          on hand:
        </div>
        <div>
          <h4 className={classes.titleArticles}>Spare Tube</h4>
        </div>
        <div className={classes.textBody}>
          A critical cycling need is to have the tools necessary to change a flat tire, patch a broken chain, or secure
          a loose bolt in the event that they break while you're out riding. The last thing you want is to end up with a
          damaged bike that you need to walk back home (and risk worsening the damage along the way).
        </div>
        <div>
          <h4 className={classes.titleArticles}>Tire Lever</h4>
        </div>
        <div className={classes.textBody}>
          A critical cycling need is to have the tools necessary to change a flat tire, patch a broken chain, or secure
          a loose bolt in the event that they break while you're out riding. The last thing you want is to end up with a
          damaged bike that you need to walk back home (and risk worsening the damage along the way).
        </div>
        <div>
          <h4 className={classes.titleArticles}>Multi-tool</h4>
        </div>
        <div className={classes.textBody}>
          A critical cycling need is to have the tools necessary to change a flat tire, patch a broken chain, or secure
          a loose bolt in the event that they break while you're out riding. The last thing you want is to end up with a
          damaged bike that you need to walk back home (and risk worsening the damage along the way).
        </div>
        <div>
          <h3 className={classes.titleArticles}>Get Your Next Bike at BicycleBlueBook.com</h3>
        </div>
        <div className={classes.textBody}>
          Once you have all your gear for cycling, make sure you have the most important thing — a high-quality bicycle.
          BicycleBlueBook.com is here to help you get the right bike at the right price.
        </div>
        <div className={classes.textBody}>
          A constant stream of data and in-depth depreciation algorithms keep our database actively updated. So, whether
          you're getting your first bike or trading up, you’ll know you’re getting the most bang for your buck.
        </div>
        <div className={classes.textBody}>
          Check out BicycleBlueBook.com today to explore our available{' '}
          <a className={classes.link} href="https://www.bicyclebluebook.com/marketplace/buy-now/">
            used bicycles for sale
          </a>
          . Find your perfect bike today!
        </div>
      </div>
      <div className={classes.hr} />
      <div className={classes.wrapChangePage}>
        <div
          className={classes.wrapBack}
          onClick={() => {
            router.push('/articles/take-the-right-pictures-for-your-listing');
            window.scrollTo(0, 0);
          }}>
          <div className={classes.back}>
            <img src={images.iconBack} alt="icon tick" className={classes.iconTick} /> Previous post
          </div>
          <div className={classes.titlePost}>Take better photos to help sell your used bike</div>
        </div>
        <div
          className={classes.wrapNext}
          onClick={() => {
            router.push('/articles/bike-parts-and-maintenance');
            window.scrollTo(0, 0);
          }}>
          <div className={classes.next}>
            Next post <img src={images.iconBack} alt="icon tick" className={classes.iconNext} />
          </div>
          <div className={classes.titlePost}>A quick and easy guide to bike parts and maintenance</div>
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
