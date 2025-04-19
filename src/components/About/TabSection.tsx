import React, { useState } from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Container from 'reactstrap/lib/Container';
import Tabs from '@ui/Tabs/Tabs';
import cx from 'classnames';
import Link from 'next/link';
import Button from '../ui/Buttons/Primary/Button';
import classes from './about.module.scss';

const TabsContent = [
  { label: 'Value Guide', value: 'value_guide' },
  { label: 'Buy', value: 'value_buy' },
  { label: 'Sell', value: 'value_sell' },
  { label: 'Trade', value: 'value_trade' },
];
const TabSection = () => {
  const [currentTab, setCurrentTab] = useState(TabsContent[0].value);

  const renderTabContent = () => {
    switch (currentTab) {
      case TabsContent[0].value: {
        return (
          <>
            <p>
              The Bicycle Blue Book Value Guide is built on a high-performance predictive analytics platform that uses
              automated machine learning which analyzes and reports on millions of transactions.
            </p>
            <Link href={'/value-guide'}>
              <Button size="s">Learn More</Button>
            </Link>
          </>
        );
      }
      case TabsContent[1].value: {
        return (
          <>
            <ul>
              <li>
                <p>Our search options let you hone in on the exact bike you're looking for</p>
              </li>
              <li>
                <p>Instant access to Value Guide pricing helps you validate the asking price</p>
              </li>
              <li>
                <p>Contact the seller to ask questions or request more details</p>
              </li>
              <li>
                <p>Safe and secure payment options including Paypal and major credit cards</p>
              </li>
              <li>
                <p> Bikes listed by BicycleBlueBook.com are professionally inspected and serviced</p>
              </li>
            </ul>
            <Link href={'/marketplace/buy-now'}>
              <Button size="s">Visit Marketplace</Button>
            </Link>
          </>
        );
      }
      case TabsContent[2].value: {
        return (
          <>
            <ul>
              <li>
                <p> Your listing can attract attention from hundreds of thousands of marketplace shoppers</p>
              </li>
              <li>
                <p>
                  Our easy-to-use drop down menus will guide you through the listing process to make sure you create an
                  effective and attractive listing
                </p>
              </li>
              <li>
                <p> Utilize a safe and secure marketplace to avoid potential scams</p>
              </li>
              <li>
                <p> Our Marketplace makes selling your bike convenient, inexpensive, and hassle-free</p>
              </li>
            </ul>

            <Link href="/marketplace/sell">
              <Button size="s">Sell Your Bike</Button>
            </Link>
          </>
        );
      }
      case TabsContent[3].value: {
        return (
          <>
            <ul>
              <li>
                <p>
                  Instantly unlock the value of one of your current bicycles by trading it in towards the purchase of a
                  new one at one of our Authorized Trade-in Partners
                </p>
              </li>
              <li>
                <p>Skip the hassle and expense of repairing, cleaning, and shipping your current bicycle</p>
              </li>
              <li>
                <p>
                  Avoid seller's fees and other issues while trying to sell online, not to mention dealing with
                  potential scams.
                </p>
              </li>
              <li>
                <p>
                  Use our partner locator to find an authorized Trade-in Partner in the nation's largest Trade-in
                  Program.
                </p>
              </li>
              <li>
                <p>
                  The only trade-in program to offer immediate trade-in values based on millions of used bicycle
                  transactions
                </p>
              </li>
            </ul>
            <Link href="/trade-in">
              <Button size="s">Partner Locator</Button>
            </Link>
          </>
        );
      }
    }
  };

  return (
    <section className={cx('container', classes.helper)}>
      <Container>
        <Row>
          <Col>
            <Tabs tabs={TabsContent} value={currentTab} onChange={setCurrentTab} />
            <div className={classes.sectionTab}>
              <div className={cx(classes.tabPane, 'mt-3 ')}>{renderTabContent()}</div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TabSection;
