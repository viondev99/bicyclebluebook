import React from 'react';
import cx from 'classnames';
import images from 'assets/images';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import classes from './registerSuccess.module.scss';

const RegisterSuccess = () => {
  return (
    <Container className={classes.registerSuccess}>
      <Row>
        <Col md={9}>
          <div className={cx(classes.title, 'd-flex')}>
            <img src={images.iconTickSuccess} alt="icon-success" />
            <h3 className="ml-3">Your application has been submitted!</h3>
          </div>
          <p>
            Thank you for your interest in the bicyclebluebook.com authorized trade in partner program. One of our trade
            in experts will be reviewing your application before it becomes active and will follow up within 2 business
            days.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterSuccess;
