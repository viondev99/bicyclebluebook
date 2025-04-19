import React from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import classes from './helper.module.scss';

const TradeInValue = () => {
  return (
    <div className={classes.helper}>
      <p>
        Similar to the automotive and technology industries, the delta between Private Party and Trade-in values stems
        from customer benefits and re-seller hurdles.
      </p>
      <Row>
        <Col md={6}>
          <h3 className={classes.title}>Customer Benefits</h3>
          <p>
            Certified third party valuation, immediate application of your bike's value to a new bike purchase, safe and
            convenient transaction with a reputable dealer.
          </p>
        </Col>
        <Col md={6}>
          <h3 className={classes.title}>Reseller Hurdles</h3>
          <p>
            Online selling fees, listing creation, disassembly, packing, shipping time and cost, insurance, price
            negotiation, time investment, return management, tire kickers, low-ball offers.
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default TradeInValue;
