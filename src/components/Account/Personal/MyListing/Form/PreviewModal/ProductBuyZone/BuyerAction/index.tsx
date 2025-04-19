import React, { FC } from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { useSelector } from 'react-redux';
import Button from '@ui/Buttons/Primary/Button';
import cx from 'classnames';
import StoreState from 'model/store';
import classes from './product-summary.module.scss';

interface Props {}

const BuyerAction: FC<Props> = ({}) => {
  const isStorefront = useSelector((store: StoreState) => !!store.authenticate.user?.storefront);
  return (
    <>
      {isStorefront ? (
        <Row className={classes.buyerActionRows}>
          <Col xs={'auto'} className={classes.formatCol}>
            <Button buttonType={'primary'} buttonSize={'l'} className={classes.buyButton}>
              Add to Cart
            </Button>
          </Col>
          <Col xs={'auto'} className={classes.formatCol}>
            <Button buttonType={'outline'} buttonSize={'l'} className={classes.buyButton}>
              Make&nbsp;<span className={'d-none d-xl-inline'}>an&nbsp;</span>Offer
            </Button>
          </Col>
        </Row>
      ) : (
        <Row className={classes.buyerActionRows}>
          <Col xs={12} className={classes.formatCol}>
            <Button buttonType={'primary'} buttonSize={'l'} className={cx(classes.buyButton, classes.btnWidth100)}>
              Send Message
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
};

export default BuyerAction;
