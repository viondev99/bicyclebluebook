import React from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Collapse from 'reactstrap/lib/Collapse';
import Container from 'reactstrap/lib/Container';
import classes from './marketplace.module.scss';
import cx from 'classnames';
import Router from 'next/router';
import images from '@images';
interface IData {
  id: string;
  title: string;
  content: React.ReactElement;
  active: boolean;
}
const data: IData[] = [
  {
    active: false,
    id: 'type',
    title: 'Types of sellers',
    content: (
      <>
        <div className={classes.listSale}>
          <Row>
            <Col lg={3}>
              <h4>Private Sellers</h4>
            </Col>
            <Col lg={9}>
              <p>These are individuals who are selling items using their Bicycle Blue Book account.</p>
            </Col>
          </Row>
        </div>
        <Row>
          <Col lg={3}>
            <h4>Dealers</h4>
          </Col>
          <Col lg={9}>
            <p>
              {' '}
              These are business owners, who are using the Bicycle Blue Book marketplace to sell their new and used
              inventory.
            </p>
          </Col>
        </Row>
        <Row>
          <Col lg={3}>
            <h4>BBB Direct</h4>
          </Col>
          <Col lg={9}>
            <p>
              These are the items that are fulfilled directly by Bicycle Blue Book. These items ship from our warehouse.
              These items all come with a 30-day money-back guarantee.
            </p>
          </Col>
        </Row>
      </>
    ),
  },
  {
    active: false,
    id: 'searching',
    content: (
      <p>
        If you already know the name of the item that you’re searching for, use the search bar at the top of the page.
      </p>
    ),
    title: 'Searching',
  },
  {
    active: false,
    id: 'filter',
    content: (
      <p>
        Use the filters on the left-hand side of the page to narrow your results. You can search for a specific type of
        bike (road, mountain, hybrid, etc.), size, price range, or several other options.
      </p>
    ),
    title: 'Filters',
  },
  {
    active: false,
    id: 'wishlist',
    content: (
      <p>
        If you don’t find what you’re looking for, you can create a wishlist using the filters. Once an item that meets
        your wishlist criteria is added to the marketplace, you’ll receive a notification.
      </p>
    ),
    title: 'Wishlist',
  },

  {
    active: false,
    id: 'save',
    content: (
      <p>
        If you've got your eye on something but you're not quite ready to commit, you can add it to your saved list
        while you make up your mind. Remember that this will not hold the bike for you and someone else can buy it while
        you’re deciding!
      </p>
    ),
    title: 'Save',
  },
  {
    active: false,
    id: 'compare',
    content: (
      <p>
        Have your eye on a few items? Use the compare button to easily see the difference and help make your decision.
      </p>
    ),
    title: 'Compare',
  },
  {
    active: false,
    id: 'offer',
    content: (
      <p>
        On some listings, sellers accept offers. You’re allowed 3 chances to make an offer. Do not make an offer unless
        you are prepared to purchase the item. Making an offer is a commitment to purchasing the item. If your offer is
        accepted, the item will be added to your shopping cart, and you will be obligated to complete the purchase. You
        will be notified of offers, and counteroffers in your account notifications.
      </p>
    ),
    title: 'Making an offer',
  },
  {
    active: false,
    id: 'buy',
    content: (
      <p>
        To ensure you are protected when purchasing an item, please use the Bicycle Blue Book system. Transactions
        completed outside of the Marketplace are not covered by PayPal purchase protection. Click here to read more from
        PayPal.
      </p>
    ),
    title: 'Buyer protection',
  },
  {
    active: false,
    id: 'paying',
    content: (
      <p>
        Items purchased from private sellers and dealers must be made using PayPal. You can purchase items from “BBB
        Direct” using a credit card or your PayPal account.
      </p>
    ),
    title: 'Paying for an item',
  },
  {
    active: false,
    id: 'return',
    content: (
      <p>
        If the seller accepts returns, then you can request a return in “Purchase history” in the items order details.
        In the case, the item hasn't arrived, is damaged, or doesn't match the description, you should first try to
        contact the seller for resolution. In the event you are not able to resolve the issue directly with the seller,
        you can escalate to PayPal. To contact PayPal regarding a dispute, click here.
      </p>
    ),
    title: 'Returns/Missing Items',
  },
  {
    active: false,
    id: 'contact',
    content: (
      <p>
        Get in touch with your seller if you've had an issue with an order or you have a question about an item you'd
        like to buy. To contact the seller after a purchase, you can click their name in “Purchase history” in the order
        details section.
      </p>
    ),
    title: 'Contact the seller',
  },
];
function TradeInProgram() {
  const [active, setActive] = React.useState('introduce');
  // @ts-ignore
  const [accordion, setDataAccordion] = React.useState(data);
  return (
    <div className={classes.cover}>
      <Container className={cx(classes.sectionContainer)}>
        <Row>
          <Col lg={3}>
            <ul className={classes.wrapperListChoose}>
              {[
                { value: 'introduce', label: 'Introduction' },
                { value: 'type', label: 'Types of Sellers' },
                { value: 'searching', label: 'Searching' },
                { value: 'filter', label: 'Filters' },
                { value: 'wishlist', label: 'Wishlist' },
                { value: 'save', label: 'Save' },
                { value: 'compare', label: 'Compare' },
                { value: 'offer', label: 'Making an Offer' },
                { value: 'paying', label: 'Paying' },
                { value: 'return', label: '  Returns/Missing Items' },
                { value: 'contact', label: 'Contacting Sellers' },
              ].map((item) => (
                <li>
                  <a
                    href={`#${item.value}`}
                    className={active === item.value ? classes.active : ''}
                    onClick={() => {
                      setActive(item.value);
                      setTimeout(() => {
                        window.scrollTo(0, window.scrollY - 88);
                      }, 0);
                    }}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </Col>
          <Col lg={9}>
            <div id="introduce">
              <h2>Buying on Bicycle Blue Book</h2>
              <p>
                Whether you've bought an item from BBB Direct, a Private Seller, or a Dealer—you can keep track of all
                your buying activity in your Purchase History. Here are some shopping tips for the marketplace:
              </p>
              <ul>
                <li>
                  <p> Our search options let you hone in on the exact bike you're looking for</p>
                </li>
                <li>
                  <p> Instant access to our Value Guide pricing helps you validate the asking price</p>
                </li>
                <li>
                  <p>Contact the seller to ask questions or request more details </p>
                </li>
                <li>
                  <p>Bikes fulfilled by BBB Direct are professionally inspected and serviced</p>
                </li>
              </ul>
            </div>
            <div className={classes.desktopView}>
              {accordion.map((item) => {
                return (
                  <div id={item.id}>
                    <h3>{item.title}</h3>
                    {item.content}
                  </div>
                );
              })}
            </div>
            <div className={classes.mobiView}>
              {accordion.map((item) => {
                return (
                  <div>
                    <div
                      className={classes.headDrop}
                      onClick={() => {
                        const newData = accordion.map((i) => {
                          if (i.id === item.id) {
                            return { ...i, ...{ active: !item.active } };
                          }
                          return i;
                        });
                        setDataAccordion(newData);
                      }}>
                      <h3>{item.title}</h3>
                      <div>
                        <img src={images.help.ic_drop} />
                      </div>
                    </div>
                    <Collapse isOpen={item.active}>{item.content}</Collapse>
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>
        <div className={classes.divider} />
        <div className={classes.footerAction}>
          <div className={classes.buttonLeft} onClick={() => Router.push('/help')}>
            <img src={images.value_guide.ic_left_row} />
            Back to Help Centre
          </div>
          <div className={classes.buttonRight} onClick={() => window.scrollTo(0, 0)}>
            <img src={images.value_guide.ic_up_row} />
            <div> Back to Top</div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default TradeInProgram;
