import React from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import RegisterCard from 'components/Register/Card/RegisterCard/RegisterCard';
import RegisterHeading from 'components/Register/Heading';
import cx from 'classnames';
import classes from './register.module.scss';

const Register = () => {
  return (
    <Container className={cx(classes.register)}>
      <RegisterHeading />
      <Row className={cx(classes.wrapper)}>
        <Col lg={4} className={classes.card}>
          <RegisterCard
            title="Personal"
            paragraph="Register to buy or sell as an individual."
            buttonTitle="Register"
            link="/register/personal"
            className={classes.card}
          />
        </Col>
        <Col lg={4} className={classes.card}>
          <RegisterCard
            title="Online store"
            paragraph="Register to sell as a store within our marketplace."
            buttonTitle="Register"
            link="/register/online-store"
          />
        </Col>
        <Col lg={4} className={classes.card}>
          <RegisterCard
            title="Trade in Partner"
            paragraph="Register to join our trade in partner network."
            buttonTitle="Register"
            link="/register/trade-in-partner"
            className={classes.card}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
