import React, { useState } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import TabContent from 'reactstrap/lib/TabContent';
import TabPane from 'reactstrap/lib/TabPane';
import Nav from 'reactstrap/lib/Nav';
import NavItem from 'reactstrap/lib/NavItem';
import NavLink from 'reactstrap/lib/NavLink';
import cx from 'classnames';
import classes from './valueGuide.module.scss';
import PrivatePartyValue from './Helpers/PrivatePartyValue';
import TradeInValue from './Helpers/TradeInValue';

const TabConst = {
  PRIVATE_PARTY: 'private_party',
  TRADE_IN_VALUE: 'trade_in_value',
};
const HelperSection = () => {
  const [activeTab, setActiveTab] = useState<string>(TabConst.PRIVATE_PARTY);

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  return (
    <section className={cx(classes.section, classes.helper)} id={'how-it-work'}>
      <Container>
        <Row>
          <Col>
            <h2>This is how it works</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <Nav tabs className={classes.nav}>
              <NavItem className={cx(classes.navItem)}>
                <NavLink
                  className={cx(classes.navLink, { [classes.active]: activeTab === TabConst.PRIVATE_PARTY })}
                  onClick={() => {
                    toggle(TabConst.PRIVATE_PARTY);
                  }}>
                  <h4>Private Party Value</h4>
                </NavLink>
              </NavItem>
              <NavItem className={cx(classes.navItem)}>
                <NavLink
                  className={cx(classes.navLink, { [classes.active]: activeTab === TabConst.TRADE_IN_VALUE })}
                  onClick={() => {
                    toggle(TabConst.TRADE_IN_VALUE);
                  }}>
                  <h4>Trade in Value</h4>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId={TabConst.PRIVATE_PARTY}>
                <PrivatePartyValue />
              </TabPane>
              <TabPane tabId={TabConst.TRADE_IN_VALUE}>
                <TradeInValue />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HelperSection;
