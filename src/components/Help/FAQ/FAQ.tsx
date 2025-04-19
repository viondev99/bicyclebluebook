import React, { useEffect } from 'react';
import Container from 'reactstrap/lib/Container';
import Nav from 'reactstrap/lib/Nav';
import NavItem from 'reactstrap/lib/NavItem';
import NavLink from 'reactstrap/lib/NavLink';
import TabContent from 'reactstrap/lib/TabContent';
import TabPane from 'reactstrap/lib/TabPane';
import Link from 'next/link';
import cx from 'classnames';
import classes from '../browseHelp.module.scss';

import PopupQA from './PopupQA';
import { useRouter } from 'next/router';

interface Props {}

const TabConst = {
  VALUE_GUIDE: 'value_guide',
  VALUE_MARKETPLACE: 'value_marketplace',
  VALUE_TRADE_IN: 'value_trade_in',
  VALUE_PARTNER: 'value_partner',
};
const dataAccordion = {
  arrayQA: [
    {
      id: 'VG1',
      question: 'Where do you get your values?',
      answer: (
        <>
          The BicycleBlueBook.com{' '}
          <Link href="/value-guide">
            <a className="link-to">Value Guide</a>
          </Link>{' '}
          is built on a high-performance predictive analytics platform that uses automated machine learning which
          analyzes and reports on millions of transactions. Click{' '}
          <Link href="/value-guide">
            <a>here</a>
          </Link>{' '}
          to learn more.
        </>
      ),
      active: false,
    },
    {
      id: 'VG2',
      question: 'What’s the difference between Trade-in Value and Private Party Value?',
      answer: (
        <>
          Private Party Value is what your bike is worth if you sell it on your own. Trade-in Value is the amount you
          can expect to receive in store credit when trading in your bike with a dealer. Much like the auto or
          technology industries, when you opt to trade-in your vehicle or cell phone you will often receive a lower
          value than if you were to try to sell it privately, essentially paying for the convenience. For more details,
          please click{' '}
          <Link href="/value-guide">
            <a>here.</a>
          </Link>
        </>
      ),
      active: false,
    },
    {
      id: 'VG3',
      question: 'I saw my exact bike listed for more on Craigslist or Ebay',
      answer:
        'Listing price is not reflective of the final sale price, and many bikes listed on these sites do not sell at all.  Further, it’s important to remember all of the fees associated with marketplaces like eBay.  In addition to the fees there is the work of boxing, shipping, and answering technical questions about the bike in order to make the sale.  Occasionally a bike will sell for more money than that listed in our value guide, but this is the exception.  There are lots of low ball offers, then there is meeting the potential buyer and the hassles or dangers presented by meeting a stranger.  BicycleBlueBook.com offers you a fast, safe, and convenient way to sell your bike.',
      active: false,
    },
    {
      id: 'VG4',
      question: 'Why are older technologies valued so low?',
      answer:
        'Any time there is a technological advance in the industry, the previous technologies depreciate quickly. Some examples of this include mountain bikes with 26” wheels, rim brakes, or front derailleur.',
      active: false,
    },
  ],
  arrayMP: [
    {
      id: 'MP1',
      question: 'How do I know what size bike to buy?',
      answer: (
        <>
          Since we sell a variety of brands and types, please refer to the manufacturer’s sizing guidelines. For a
          general sizing chart, please click {/* <ProductInfoTooltip */}
          {/*  renderTooltip={({ isShow, onClose }) => <SizeModal show={isShow} handleClose={onClose} />}> */}
          {/*  <a className="link-to" href="#"> */}
          {/*    here. */}
          {/*  </a> */}
          {/* </ProductInfoTooltip> */}
        </>
      ),
      active: false,
    },
    {
      id: 'MP2',
      question: 'What is your return policy?',
      answer: (
        <>
          <p>
            The marketplace has inventory available from private parties, online stores and bicycles sold directly by
            BicycleBlueBook.com.
          </p>
          <p>For any bike sold by BicycleBlueBook.com we offer a 30 day money back guarantee as follows:</p>
          <ul>
            <li>
              Bikes in original purchase condition are eligible for a full refund within 30 days of receiving your bike.{' '}
            </li>
            <li>Bikes damaged during assembly are not eligible for return.</li>
          </ul>
          <p>
            Bikes sold on our marketplace by private sellers or other online stores are subject to return policies
            established by the seller.{' '}
          </p>
        </>
      ),
      active: false,
    },
    {
      id: 'MP3',
      question: 'Do you buy used bikes?',
      answer: (
        <>
          BicycleBlueBook.com does not buy bikes directly. You can Trade-in your bike towards the purchase of a new one
          at one of our Authorized Trade-in Partners across the US, or you can list your bike on our online marketplace
          (paying only a selling fee when an item sells). Click{' '}
          <Link href="/sell-tradein/">
            <a>here</a>
          </Link>{' '}
          to find the Trade-in Partner near you, or{' '}
          <Link href="/marketplace/buy-now">
            <a>here</a>
          </Link>{' '}
          to browse our marketplace.
        </>
      ),
      active: false,
    },
    {
      id: 'MP4',
      question: 'What’s the actual condition of the bike?',
      answer: (
        <>
          All our bikes are second hand and some have more use than others. Please view the photos for the best gauge of
          use and wear. All bikes sold are guaranteed to be fully functional and in working condition.
        </>
      ),
      active: false,
    },
    {
      id: 'MP5',
      question: 'How much is it to ship a bike?',
      answer: (
        <>
          BicycleBlueBook.com shipping is $85 anywhere in the lower 48 states for bikes shipped in standard bike boxes.
          For oversized items there is a maximum charge of $150.
        </>
      ),
      active: false,
    },
    {
      id: 'MP6',
      question: 'If I am selling a bike, who pays for shipping?',
      answer: (
        <>
          You can set up your account to have the buyer pay or you can pay and build the costs into your listing. If you
          use BicycleBlueBook.com shipping (recommended) you will get the bulk shipping rate discount that we pass on to
          our marketplace sellers. You will also be able to print a shipping label directly from your listing on the
          website.
        </>
      ),
      active: false,
    },
    {
      id: 'MP7',
      question: 'How much is shipping insurance?',
      answer: (
        <>
          Insurance is calculated by: First $100 of item value no insurance charge, after that $0.75 per $100 of item
          value.
        </>
      ),
      active: false,
    },
    {
      id: 'MP8',
      question: 'Do you tune-up the bikes before selling them?',
      answer: (
        <>
          <p>
            The marketplace has inventory available from private parties, online stores and bicycles sold directly by
            BicycleBlueBook.com.
          </p>
          <ul>
            <li>
              All bikes sold by BicycleBlueBook.com are inspected by our professional mechanics to ensure that they are
              in good working order. All bikes sold by BicycleBlueBook.com are guaranteed to be 100% functional. These
              are denoted with an icon in the listing. (show icon)
            </li>
            <li>
              BicycleBlueBook.com cannot comment on the condition of bikes sold by private parties or online stores on
              our marketplace.
            </li>
          </ul>
        </>
      ),
      active: false,
    },
    {
      id: 'MP9',
      question: 'How much assembly of the bike is required?',
      answer: (
        <>
          <p>
            To ensure rider safety, we strongly recommend that all bicycles purchased through BicycleBlueBook.com be
            assembled by a certified mechanic at your local bike shop. Most of the bikes have the bars, seat post, front
            wheel, pedals, and rear derailleur removed. Bikes with disc brakes will require aligning. Mountain bikes
            will need to have the suspension tuned.
          </p>
        </>
      ),
      active: false,
    },
    {
      id: 'MP10',
      question: 'What currency are the bikes listed in?',
      answer: (
        <>
          <p>All bikes on the Bicycle Blue Book Marketplace are listed in US Dollars ($).</p>
        </>
      ),
      active: false,
    },
  ],
  arrayTI: [
    {
      id: 'TI17',
      question: 'How does Trade-in work?',
      answer: (
        <>
          <p>
            Bring your bike into your local BicycleBlueBook.com Trade-in Partner for appraisal. In a matter of minutes
            you will be presented with an offer of the Trade-in Value which you will receive in the form of store
            credit. This value can be immediately applied to your new bike purchase.
          </p>
        </>
      ),
      active: false,
    },
    {
      id: 'TI18',
      question: 'How long does a bike appraisal take?',
      answer: (
        <>
          <p>
            Most of the time only five to ten minutes, however if your bike has a lot of modifications it may take
            longer. If your bike happens to fall outside BicycleBlueBook.com’s database or require further valuation a
            custom quote will be submitted and appraised value returned within 24hrs.
          </p>
        </>
      ),
      active: false,
    },
    {
      id: 'TI19',
      question: ' What is required to Trade-in my bicycle?',
      answer: (
        <>
          <p>
            A state issued ID or passport (domestic or foreign passports accepted) and a finger print from your right
            index finger (where applicable).
          </p>
        </>
      ),
      active: false,
    },
    {
      id: 'TI20',
      question: 'Where do I take my Trade-in?',
      answer: (
        <>
          <p>
            You can Trade-in your bike to any of our Authorized Trade-in Partners. For a full directory please see{' '}
            <Link href="/sell-tradein/">
              <a>here</a>
            </Link>
            .
          </p>
        </>
      ),
      active: false,
    },
    {
      id: 'TI21',
      question: 'Can you account for modifications (i.e. upgraded components)?',
      answer: (
        <>
          <p>
            Yes, we can account for upgrades and downgrades through our appraisal process, however it is important to
            note that not all modifications will result in an increase of overall value. Many modifications do not
            affect the overall resale value of a bicycle.
          </p>
        </>
      ),
      active: false,
    },
    {
      id: 'TI22',
      question: 'What are you doing with the bikes that are Traded-in?',
      answer: (
        <>
          <p>
            BicycleBlueBook.com takes possession of all the bikes and after a thorough inspection we list them for
            resale through our own online marketplace.
          </p>
        </>
      ),
      active: false,
    },
    {
      id: 'TI23',
      question: 'Do I have to use the store credit today?',
      answer: (
        <>
          <p>This is a “per store” policy.</p>
        </>
      ),
      active: false,
    },
    {
      id: 'TI24',
      question: 'Do I have to use the store credit at this location?',
      answer: (
        <>
          <p>This is a per-store policy.</p>
        </>
      ),
      active: false,
    },
    {
      id: 'TI25',
      question: 'Can I receive cash instead of store credit?',
      answer: (
        <>
          <p>We only offer store credit for this program.</p>
        </>
      ),
      active: false,
    },
  ],
  arrayAG: [
    {
      id: 'AG1',
      question: 'Why should I become a BicycleBlueBook.com Trade-in Partner?',
      answer: (
        <>
          <p>
            The program gives you the ability to sell more new bikes more quickly. It speeds up the purchasing cycle by
            25%, from four years to three. It increases the transaction size from the industry average of $753 to $1856.
            The free Lead Gen we offer our partners is proven to drive more consumers into your store.
          </p>
        </>
      ),
      active: false,
    },
    {
      id: 'AG2',
      question: 'How do I become a Trade-in partner?',
      answer: (
        <>
          <p>
            Sign up is easy, go to the{' '}
            <Link href="/become-a-partner/">
              <a>partner registration page</a>
            </Link>{' '}
            to create a “Trade-in” partner account. Be sure to read all the program{' '}
            <Link href="/program-terms/">
              <a>terms and conditions</a>
            </Link>
            .
          </p>
        </>
      ),
      active: false,
    },
    {
      id: 'AG3',
      question: 'How much does it cost to become an Authorized Trade-in Partner?',
      answer: (
        <>
          <p>
            There is no cost to participate in our{' '}
            <Link href="/become-a-partner/">
              <a>Trade-in program</a>
            </Link>
            . We find that the best way to maximize the benefit to your store is to fully support the program through
            educating your staff, marketing Trade-ins to your customers and utilizing the collateral we provide. Please
            note that all trade-ins processed through our system must be sent to BicycleBlueBook.com.
          </p>
        </>
      ),
      active: false,
    },
    {
      id: 'AG4',
      question: 'Once I am signed up what’s next?',
      answer: (
        <>
          <p>
            Once you are signed up we will send you a welcome email and your regional Business Development Manager will
            contact you to answer any questions you may have about the program. We also recommend that you visit the{' '}
            {/* { */}
            {/*  !isUseBbbV1() ? this.renderLinkPartnerV2('partner portal') : this.renderLinkPartnerV1('partner portal') */}
            {/*  //   <StyledLink */}
            {/*  //     className="link-to" */}
            {/*  //     href={'/RetailPartner/Training.aspx'} */}
            {/*  //     onClick={() => (location.href = '/RetailPartner/Training.aspx')} */}
            {/*  //   > */}
            {/*  //     Partner Portal */}
            {/*  // </StyledLink> */}
            {/* }{' '} */}
            to view training videos and access marketing materials. You will also receive a POP in-store merchandising
            kit for you to start promoting trade-ins immediately.
          </p>
        </>
      ),
      active: false,
    },
    {
      id: 'AG5',
      question: 'How do I get a Trade-in webpage on my website?',
      answer: (
        <>
          <p>
            If you use a SmartEtailing (SE)-hosted website, we have a standard “trade-in” page template in the “content
            manager.” Simply select this page to populate your site
          </p>
          <p>
            For non-SE partners we have built several digital assets that you can provide to your web designer to build
            this page. Simply log into{' '}
            {/* {!isUseBbbV1() ? this.renderLinkPartnerV2('Partner Portal') : this.renderLinkPartnerV1('Partner Portal')} on */}
            {/* BicycleBlueBook.com, click the marketing tab and click the{' '} */}
            {/* { */}
            {/*  !isUseBbbV1() */}
            {/*    ? this.renderLinkPartnerV2('website widget and content') */}
            {/*    : this.renderLinkPartnerV1('website widget and content') */}
            {/*  //   <a */}
            {/*  //   className="link-to" */}
            {/*  //   href="/RetailPartner/IntegrateScorecard.aspx" */}
            {/*  // > */}
            {/*  //   website widget and content */}
            {/*  // </a> */}
            {/* }{' '} */}.
          </p>
        </>
      ),
      active: false,
    },
    {
      id: 'AG6',
      question: 'How should I promote the program?',
      answer: (
        <>
          <ol start={1}>
            <li>
              <p className="main-order">Sales Conversations/Process:</p>
              <ol style={{ listStyleType: 'lower-alpha' }}>
                <li>
                  <p className="sub-order">LEAD WITH TRADE in every conversation.</p>
                </li>
              </ol>
            </li>
            <li>
              <p className="main-order">Staff Training:</p>
              <ol style={{ listStyleType: 'lower-alpha' }}>
                <li>
                  <p className="sub-order">
                    Engage with your BicycleBlueBook.com Regional Manager to work with your staff and explain all of the
                    ways in which Trade-in can grow your business and support your cycling community.
                  </p>
                </li>
                <li>
                  <p className="sub-order">
                    LEAD WITH TRADE in every conversation.Make sure staff knows how to lead with Trade-ins via role
                    play, overcoming objections, etc.
                  </p>
                </li>
              </ol>
            </li>
            <li>
              <p className="main-order">In-Store:</p>
              <ol style={{ listStyleType: 'lower-alpha' }}>
                <li>
                  <p className="sub-order">Clearly display Trade-in signage inside and outside your store. </p>
                </li>
                <li>
                  <p className="sub-order">We provide this signage in the "partner portal.""</p>
                </li>
              </ol>
            </li>
            <li>
              <p className="main-order">Website:</p>
              <ol style={{ listStyleType: 'lower-alpha' }}>
                <li>
                  <p className="sub-order">Promote Trade-in program on your homepage.</p>
                </li>
                <li>
                  <p className="sub-order">
                    Build a Trade-in page in your services section, with links from services and homepage.
                  </p>
                </li>
              </ol>
            </li>
            <li>
              <p className="main-order">Social Media</p>
              <ol style={{ listStyleType: 'lower-alpha' }}>
                <li>
                  <p className="sub-order">
                    Engage frequently with your cycling community by letting them know they can Trade-in their bike with
                    your store. Repetition works!
                  </p>
                </li>
                <li>
                  <p className="sub-order">
                    Access a variety of social media campaigns by using our free content on{' '}
                    <a href="https://cp.promoboxx.com/bicycle-blue-book">promoboxx</a>.
                  </p>
                </li>
                <li>
                  <p className="sub-order">Targeted Email blasts.</p>
                </li>
                <li>
                  <p className="sub-order">Special event promotions.</p>
                </li>
              </ol>
            </li>
            <li>
              <p className="main-order">Trade-in Events:</p>
              <ol style={{ listStyleType: 'lower-alpha' }}>
                <li>
                  <p className="sub-order">Proven to drive record sales weekends.</p>
                </li>
                <li>
                  <p className="sub-order">Drives new customers to your store.</p>
                </li>
                <li>
                  <p className="sub-order">Generate double the standard return on trade.</p>
                </li>
                <li>
                  <p className="sub-order">
                    Motivate consumers to take action, while raising awareness about Trade-in at your store.
                  </p>
                </li>
              </ol>
            </li>
            <li>
              <p className="main-order">Local Cycling Community:</p>
              <ol style={{ listStyleType: 'lower-alpha' }}>
                <li>
                  <p className="sub-order">
                    Make Trade-in part of the conversation by engaging with your community at local events, demo days,
                    racing teams, clubs, NICA, etc.
                  </p>
                </li>
              </ol>
            </li>
          </ol>
        </>
      ),
      active: false,
    },
    {
      id: 'AG7',
      question: 'How do I access the online scorecard process?',
      answer: (
        <>
          <ol>
            <li>
              <p>Log into your account on BicycleBlueBook.com.</p>
            </li>
            <li>
              <p>insert pic/screen grab of drop down with an arrow to create scorecard.</p>
            </li>
          </ol>
        </>
      ),
      active: false,
    },
    {
      id: 'AG8',
      question: 'What are the limitations / parameters for bikes we can accept through the program?',
      answer: (
        <>
          <ol>
            <li>
              <p> 2000 model year or newer</p>
            </li>
            <li>
              <p>Bike shop caliber bike (no department store, three wheel, recumbent or tandem bikes).</p>
            </li>
            <li>
              <p>Serial number must be intact and not tampered with.</p>
            </li>
            <li>
              <p>Repainted bikes not accepted unless re-painted by original manufacturer.</p>
            </li>
            <li>
              <p>
                Bike must be fully functional and safe to ride. No broken/repaired/re-painted frames, forks, wheels,
                shocks, etc.
              </p>
            </li>
          </ol>
        </>
      ),
      active: false,
    },
    {
      id: 'AG9',
      question:
        'What if I can’t find the exact bike in the database, or one that falls outside the program parameters?',
      answer: (
        <>
          <p>
            Submit a{' '}
            {/* {!isUseBbbV1() ? this.renderLinkPartnerV2('custom quote') : this.renderLinkPartnerV1('custom quote')}{' '} */}
            through the scorecard system.
          </p>
        </>
      ),
      active: false,
    },
    {
      id: 'AG10',
      question: 'Once the customer accepts the value and I issue a store credit what’s next?',
      answer: (
        <>
          <ol>
            <li>
              <p>
                Finish the scorecard process, including photo’s. Log into the BicycleBlueBook.com scorecard on the
                store’s mobile device to take photos. If you need help with this process, call your regional Business
                Development Manager.
              </p>
            </li>
            <li>
              <p>
                Create a work order to have the Trade-in boxed and shipped at the same time as you finalize the new bike
                sale.
              </p>
            </li>
            <li>
              <p>
                Verify that the bicycle is thoroughly cleaned and carefully packed into a standard (54” x 30” x 8”) bike
                box. Click here for a <a href="https://youtu.be/lr-oUndzmJY">boxing tutorial</a>.
              </p>
            </li>
            <li>
              <p>Print and include a copy of the scorecard in the box.</p>
            </li>
            <li>
              <p>
                In order to ensure full reimbursement, make sure the bike is adequately packaged to arrive at our
                warehouse in the same condition as it was received in your shop. Print the shipping label and hand off
                the boxed bike to your UPS driver.
              </p>
            </li>
          </ol>
        </>
      ),
      active: false,
    },
    {
      id: 'AG11',
      question: 'Do I have to use BicycleBlueBook.com shipping or can I ship through another service?',
      answer: (
        <>
          <p>
            BicycleBlueBook.com offers flat inbound national shipping rates of $35 for boxes up to 130”{' '}
            <a href="https://www.ups.com/us/en/help-center/packaging-and-supplies/prepare-overize.page#contentBlock-11">
              Dimensional Weight
            </a>
            . You are also welcome to ship via the carrier of your choice.
          </p>
        </>
      ),
      active: false,
    },
    {
      id: 'AG12',
      question: 'What is the reimbursement process?',
      answer: (
        <>
          <p>
            BicycleBlueBook.com reimburses partners for the final Trade-in valuation, less applicable shipping costs to
            our distribution center, via check or{' '}
            <a href="https://www.bicyclebluebook.com/Resources/Doc/BicycleBlueBook.com%20ACH%20Enrollment.pdf">ACH</a>.
            Checks are mailed via USPS fourteen (14) days following receipt and verification at our distribution center.
          </p>
        </>
      ),
      active: false,
    },
    {
      id: 'AG13',
      question: 'Can I keep a Trade-in and try to sell it myself?',
      answer: (
        <>
          <p>
            No. As outlined in our program{' '}
            <Link href="/program-terms/">
              <a>terms and conditions</a>
            </Link>
            , all bicycles processed using our scorecard system must be sent to BicycleBlueBook.com.
          </p>
          <p>
            If you are interested in using BicycleBlueBook.com to enable your own used bike program, licensing costs are
            as follows:
          </p>
          <p>Single location license fee: $199 per month.</p>
          <p>Additional per-location license fee: $99 per month.</p>
          <p>
            Please contact us at{' '}
            <a href="mailto:dealersupport@bicyclebluebook.com" target="_top">
              dealersupport@bicyclebluebook.com
            </a>{' '}
            for application.
          </p>
        </>
      ),
      active: false,
    },
    {
      id: 'AG14',
      question: 'How quickly do I need to get the bike in transit to the BicycleBlueBook.com distribution center?',
      answer: (
        <>
          <p>
            Bicycles need to be packaged and shipped to BicycleBlueBook.com within seven (7) days of scorecard
            acceptance in your store.
          </p>
        </>
      ),
      active: false,
    },
    {
      id: 'AG15',
      question: 'Can I offer more than the BicycleBlueBook.com Trade-in value?',
      answer: (
        <>
          <p>
            Yes, you may at your discretion offer more than the BicycleBlueBook.com Trade-in Value in order to close a
            deal. However BicycleBlueBook.com will only reimburse our published scorecard value. Any additions to the
            Trade-in value are the sole responsibility of the retailer.
          </p>
        </>
      ),
      active: false,
    },
    {
      id: 'AG16',
      question:
        'How are scorecard discrepancies handled once bikes are inspected at the BicycleBlueBook.com distribution center?',
      answer: (
        <>
          <ol start={1}>
            <li>
              <p>
                We rely on our Trade-in partners to accurately evaluate and report the bicycle’s condition. Please be
                sure to read and understand all the program{' '}
                <Link href="/program-terms/">
                  <a>terms and conditions</a>
                </Link>{' '}
                and the bicycle {/* <ProductInfoTooltip */}
                {/*  renderTooltip={({ isShow, onClose }) => <ConditionModal show={isShow} handleClose={onClose} />}> */}
                {/*  <a className="link-to" href="#"> */}
                {/*    condition guide */}
                {/*  </a> */}
                {/* </ProductInfoTooltip> */}.
              </p>
            </li>
            <li>
              <p>In the event a discrepancy is found, we will notify the shop owner or manager.</p>
              <ol style={{ listStyleType: 'lower-alpha' }}>
                <li>
                  <p className="sub-order">Discrepancy may include:</p>
                  <ul>
                    <li>condition.</li>
                    <li>model.</li>
                    <li>model year.</li>
                    <li>modifications.</li>
                  </ul>
                </li>
              </ol>
            </li>
            <li>
              <p>
                For information on how discrepancies are resolved, please refer to the BicycleBlueBook.com{' '}
                <Link href={'/program-terms/'}>
                  <a>program terms and conditions</a>
                </Link>
                .
              </p>
            </li>
          </ol>
        </>
      ),
      active: false,
    },
  ],
} as any;

function FAQ() {
  const [tabKey, setTab] = React.useState(TabConst.VALUE_GUIDE);
  const [accordion, setData] = React.useState(dataAccordion);
  const router = useRouter();
  const onChangeTab = (key: any) => {
    setTab(key);
  };
  useEffect(() => {
    if (router?.query && router.query?.tab) {
      setTab(String(router?.query?.tab));
    }
  }, [router.query]);

  useEffect(() => {}, [accordion.arrayMP]);
  const handleShowPopup = (item: any) => {
    let newData = {};
    if (item.id.slice(0, 2) === 'VG') {
      const index = accordion.arrayQA.indexOf(item);
      newData = {
        arrayQA: [
          ...accordion.arrayQA.slice(0, index),
          {
            ...item,
            active: !item.active,
          },
          ...accordion.arrayQA.slice(index + 1),
        ],
      };
    } else if (item.id.slice(0, 2) === 'MP') {
      const index = accordion.arrayMP.indexOf(item);
      newData = {
        arrayMP: [
          ...accordion.arrayMP.slice(0, index),
          {
            ...item,
            active: !item.active,
          },
          ...accordion.arrayMP.slice(index + 1),
        ],
      };
    } else if (item.id.slice(0, 2) === 'AG') {
      const index = accordion.arrayAG.indexOf(item);
      newData = {
        arrayAG: [
          ...accordion.arrayAG.slice(0, index),
          {
            ...item,
            active: !item.active,
          },
          ...accordion.arrayAG.slice(index + 1),
        ],
      };
    } else {
      const index = accordion.arrayTI.indexOf(item);
      newData = {
        arrayTI: [
          ...accordion.arrayTI.slice(0, index),
          {
            ...item,
            active: !item.active,
          },
          ...accordion.arrayTI.slice(index + 1),
        ],
      };
    }
    setData({ ...accordion, ...newData });
  };

  return (
    <div className={classes.wrapperFAQ} id={'faqs'}>
      <Container id={'FAQ'}>
        <h2>Frequently Asked Questions</h2>
        <div className={classes.tabs}>
          <Nav tabs className={classes.nav}>
            <NavItem className={cx(classes.navItem)}>
              <NavLink
                className={cx(classes.navLink, classes.firstItem, {
                  [classes.active]: tabKey === TabConst.VALUE_GUIDE,
                })}
                onClick={() => {
                  onChangeTab(TabConst.VALUE_GUIDE);
                }}>
                <h4>Value Guide</h4>
              </NavLink>
            </NavItem>

            <NavItem className={cx(classes.navItem)}>
              <NavLink
                className={cx(classes.navLink, { [classes.active]: tabKey === TabConst.VALUE_MARKETPLACE })}
                onClick={() => {
                  onChangeTab(TabConst.VALUE_MARKETPLACE);
                }}>
                <h4>Marketplace</h4>
              </NavLink>
            </NavItem>

            <NavItem className={cx(classes.navItem)}>
              <NavLink
                className={cx(classes.navLink, { [classes.active]: tabKey === TabConst.VALUE_TRADE_IN })}
                onClick={() => {
                  onChangeTab(TabConst.VALUE_TRADE_IN);
                }}>
                <h4>Trade in</h4>
              </NavLink>
            </NavItem>

            <NavItem className={cx(classes.navItem)}>
              <NavLink
                className={cx(classes.navLink, { [classes.active]: tabKey === TabConst.VALUE_PARTNER })}
                onClick={() => {
                  onChangeTab(TabConst.VALUE_PARTNER);
                }}>
                <h4>Partner</h4>
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={tabKey} className={classes.sectionTab}>
            <TabPane tabId={TabConst.VALUE_GUIDE} className={classes.tabPane}>
              {accordion.arrayQA.map((item: any, i: number) => (
                <PopupQA
                  key={String(i)}
                  isMobile={false}
                  handleShowPopup={handleShowPopup}
                  qaItem={item}
                  activeKey={item.active}
                />
              ))}
            </TabPane>
          </TabContent>
          <TabContent activeTab={tabKey} className={classes.sectionTab}>
            <TabPane tabId={TabConst.VALUE_MARKETPLACE} className={classes.tabPane}>
              {accordion.arrayMP.map((item: any, i: number) => (
                <PopupQA
                  key={String(i)}
                  isMobile={false}
                  handleShowPopup={handleShowPopup}
                  qaItem={item}
                  activeKey={item.active}
                />
              ))}
            </TabPane>
          </TabContent>
          <TabContent activeTab={tabKey} className={classes.sectionTab}>
            <TabPane tabId={TabConst.VALUE_TRADE_IN} className={classes.tabPane}>
              {accordion.arrayTI.map((item: any, i: number) => (
                <PopupQA
                  key={String(i)}
                  isMobile={false}
                  handleShowPopup={handleShowPopup}
                  qaItem={item}
                  activeKey={item.active}
                />
              ))}
            </TabPane>
          </TabContent>
          <TabContent activeTab={tabKey} className={classes.sectionTab}>
            <TabPane tabId={TabConst.VALUE_PARTNER} className={classes.tabPane}>
              {accordion.arrayAG.map((item: any, i: number) => (
                <PopupQA
                  key={String(i)}
                  isMobile={false}
                  handleShowPopup={handleShowPopup}
                  qaItem={item}
                  activeKey={item.active}
                />
              ))}
            </TabPane>
          </TabContent>
        </div>
      </Container>
    </div>
  );
  // }
}

export default FAQ;
