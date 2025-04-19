import React from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import Card from '@ui/Cards';
import cx from 'classnames';
import classes from './valueGuide.module.scss';

const ProductSection = () => {
  return (
    <section className={cx(classes.wrapProduct)}>
      <Container className={cx(classes.product, classes.wrapProductSection)}>
        <Card>
          <Row>
            <Col xs={12} md={7} lg={7} className={classes.productImage}>
              <div className={classes.example}>Example</div>
              <div className={classes.image} />
            </Col>
            <Col xs={12} md={5} lg={5} className={classes.content}>
              <div className={classes.title}>
                <h2>BMC Trackmachine 02 One</h2>
              </div>
              <div className="d-flex mt-3">
                <div className={classes.category}>
                  <div className={classes.title}>MSRP</div>
                  <div className={classes.price}>$1,899</div>
                </div>
                <div className={classes.category}>
                  <div className={classes.title}>Private</div>
                  <div className={classes.price}>$1,208</div>
                </div>
                <div className={classes.category}>
                  <div className={classes.title}>Trade</div>
                  <div className={classes.price}>$746</div>
                </div>
              </div>
              <div className={cx(classes.description, classes.productDescription)}>
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
