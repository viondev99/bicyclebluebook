import React from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Container from 'reactstrap/lib/Container';
import Card from '@ui/Cards';
import cx from 'classnames';
import classes from './about.module.scss';

const ProductSection = () => {
  return (
    <section className={classes.section}>
      <Container className={cx(classes.product)}>
        <Card>
          <Row>
            <Col xs={12} md={7} lg={6} className={classes.productImage}>
              <div className={classes.image} />
            </Col>
            <Col xs={12} md={5} lg={6} className={classes.content}>
              <div className={classes.title}>
                <h2>2017 Specialized Tarmac SL4</h2>
              </div>
              <div className="d-flex mt-3">
                <div className={classes.category}>
                  <div className={classes.title}>MSRP</div>
                  <div className={classes.price}>$2,000</div>
                </div>
                <div className={classes.category}>
                  <div className={classes.title}>Private</div>
                  <div className={classes.price}>$1,115</div>
                </div>
                <div className={classes.category}>
                  <div className={classes.title}>Trade</div>
                  <div className={classes.price}>$725</div>
                </div>
              </div>
              <div className={cx(classes.description)}>
                Private Party Value is based on the aggregate of used bicycle sales data. For example, this bike
                privately sold in the last 12 month for a low of $850 and a high of $1,250.
              </div>
            </Col>
          </Row>
        </Card>
      </Container>
    </section>
  );
};

export default ProductSection;
