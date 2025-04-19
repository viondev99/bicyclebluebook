import React from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import classes from './helper.module.scss';

const PrivatePartyValue = () => {
  return (
    <div className={classes.helper}>
      <p>We use a combination of the following three factors to report the most accurate bicycle values avaiable:</p>
      <Row>
        <Col md={6}>
          <h3 className={classes.title}>Transaction Reporting</h3>
          <p>
            Based on milions of used bicycle transactions over twenty year on tens of thousands of diffirent bicycles,
            our scientists report on used bicycle market trend. Since used-bikes typically sell below their asking
            price, our analysis tracks actual sale prices to determine Private Party Value.
          </p>
        </Col>
        <Col md={6}>
          <h3 className={classes.title}>Real-time Algorithm</h3>
          <p>
            Our algorithm considers a bike's age, brand, type, frame material, suspension, condition, components, wheel
            size, modifications, manufacturer and retailer discounting and the depreciation that occurs as soon as a new
            bike is purchased.
          </p>
        </Col>
        <Col md={6}>
          <h3 className={classes.title}>Industry Expertise</h3>
          <p>
            Our industry experts have worked across every aspect of the bicycle industry. They vet and validate our
            algorithmically generated values to ensure they accurately reflect market trends.
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default PrivatePartyValue;
