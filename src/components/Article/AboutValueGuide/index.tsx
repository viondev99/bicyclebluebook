import React, { useState } from 'react';
import Router from 'next/router';
import cx from 'classnames';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Container from 'reactstrap/lib/Container';
import Nav from 'reactstrap/lib/Nav';
import NavItem from 'reactstrap/lib/NavItem';
import NavLink from 'reactstrap/lib/NavLink';
import TabContent from 'reactstrap/lib/TabContent';
import TabPane from 'reactstrap/lib/TabPane';

import classes from './about.module.scss';
import images from '@images';
import ProductSection from './ProductSection';

const TabConst = {
  VALUE_GUIDE: 'value_guide',
  VALUE_BUY: 'value_buy',
  VALUE_SELL: 'value_sell',
  VALUE_TRADE: 'value_trad',
};

function About() {
  const [activeTab, setActiveTab] = useState<string>('value_sell');
  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  return (
    <div className={classes.cover}>
      <Container className={classes.sectionContainer}>
        {/* <Col xs={12}> */}
        <div className={classes.wrapperTitle}>
          <h2>Value Guide</h2>
          <p>
            The BicycleBlueBook.com Value Guide is the cycling industry’s definitive valuation authority. It is built on
            a high-performance predictive analytics platform that uses automated machine learning to analyze and report
            on millions of transactions.We report three values: Original MSRP, Private Party and Trade-in.
          </p>
        </div>
        <Row className={classes.blockContent}>
          <Col xs={12} lg={4} className={classes.wrapperBlock}>
            <img src={images.value_guide.ic_buy} alt={'error'} />
            <div>
              <h3>MSRP</h3>
              <p>Original manufacturer's suggested retail price</p>
            </div>
          </Col>

          <Col xs={12} lg={4} className={classes.wrapperBlock}>
            <img className={classes.imageLarge} src={images.value_guide.ic_handle} alt={'error'} />
            <div>
              <h3>Private Party Value</h3>
              <p>What your bike is worth if you sell it on your own.</p>
            </div>
          </Col>
          <Col xs={12} lg={4} className={classes.wrapperBlock}>
            <img src={images.value_guide.ic_pay} alt={'error'} />
            <div>
              <h3>Trade in</h3>
              <p>The amount you can expect to receive in store credit when trading in your bike with a dealer.</p>
            </div>
          </Col>
        </Row>
        {/* </Col> */}
        <div className={classes.helper}>
          <h2>This is how it works</h2>
          <Nav tabs className={classes.nav}>
            <NavItem className={cx(classes.navItem)}>
              <NavLink
                className={cx(classes.navLink, { [classes.active]: activeTab === TabConst.VALUE_SELL })}
                onClick={() => {
                  toggle(TabConst.VALUE_SELL);
                }}>
                <h4>Private Party Value</h4>
              </NavLink>
            </NavItem>

            <NavItem className={cx(classes.navItem)}>
              <NavLink
                className={cx(classes.navLink, { [classes.active]: activeTab === TabConst.VALUE_TRADE })}
                onClick={() => {
                  toggle(TabConst.VALUE_TRADE);
                }}>
                <h4>Trade in Value</h4>
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab} className={classes.sectionTab}>
            <TabPane tabId={TabConst.VALUE_SELL} className={classes.tabPane}>
              <p className={classes.titleTab}>
                We use a combination of the following three factors to report the most accurate bicycle values avaiable:
              </p>
              <Row>
                <Col lg={6}>
                  <h3>Transaction Reporting</h3>
                  <p>
                    Based on milions of used bicycle transactions over twenty year on tens of thousands of diffirent
                    bicycles, our scientists report on used bicycle market trend. Since used-bikes typically sell below
                    their asking price, our analysis tracks actual sale prices to determine Private Party Value.
                  </p>
                </Col>
                <Col lg={6}>
                  <h3>Real-time Algorithm</h3>
                  <p>
                    Our algorithm considers a bike's age, brand, type, frame material, suspension, condition,
                    components, wheel size, modifications, manufacturer and retailer discounting and the depreciation
                    that occurs as soon as a new bike is purchased.
                  </p>
                </Col>{' '}
                <Col lg={6}>
                  <h3>Industry Expertise</h3>
                  <p>
                    Our industry experts have worked across every aspect of the bicycle industry. They vet and validate
                    our algorithmically generated values to ensure they accurately reflect market trends.
                  </p>
                </Col>
              </Row>
            </TabPane>

            <TabPane tabId={TabConst.VALUE_TRADE} className={classes.tabPane}>
              <p className={classes.titleTab}>
                Similar to the automotive and technology industries, the delta between Private Party and Trade-in values
                stems from customer benefits and re-seller hurdles.
              </p>
              <Row>
                <Col lg={6}>
                  <h3>Customer Benefits</h3>
                  <p>
                    Certified third party valuation, immediate application of your bike's value to a new bike purchase,
                    safe and convenient transaction with a reputable dealer.
                  </p>
                </Col>
                <Col lg={6}>
                  <h3>Re-seller Hurdles</h3>
                  <p>
                    Online selling fees, listing creation, dis-assembly, packing, shipping time and cost, insurance,
                    price negotiation, time investment, return management, tire kickers, low-ball offers.
                  </p>
                </Col>{' '}
              </Row>
            </TabPane>
          </TabContent>
        </div>
        <ProductSection />
        <div className={classes.divider} />
        <div className={classes.footerAction}>
          <div className={classes.buttonLeft} onClick={() => Router.push('/help')}>
            <img src={images.value_guide.ic_left_row} alt={'error'} />
            Back to Help Centre
          </div>
          <div className={classes.buttonRight} onClick={() => window.scrollTo(0, 0)}>
            <img src={images.value_guide.ic_up_row} alt={'error'} />
            <div> Back to Top</div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default About;
