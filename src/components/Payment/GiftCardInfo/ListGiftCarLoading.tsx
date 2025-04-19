/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { FC, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import { StorefrontRole } from 'constants/roles';
import classes from './gift-card-info.module.scss';

interface Props {
  key: string;
}

const ListGiftCarLoading: FC<Props> = ({ key }) => {
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);

  const visibleRenderButtonDisconnectStripe = useMemo(() => {
    if (userInfo?.role !== StorefrontRole.Employee) {
      return true;
    }
    return false;
  }, [userInfo]);

  return (
    <div className={classes.wrapListGiftCard} key={key}>
      <div className={classes.balance}>
        <Skeleton />
      </div>
      <div className={classes.giftCardCode}>
        <Skeleton />
      </div>
      <div className={classes.balance}>
        <Skeleton />
      </div>
      <div className={classes.valueBalance}>
        <Skeleton />
      </div>
      <div className={classes.activity}>
        <Skeleton />
      </div>
      <Row className={classes.item}>
        <Col xs={3}>
          <span className={classes.textInfo}>
            <Skeleton />
          </span>
        </Col>
        <Col xs={6}>
          <span className={classes.textInfo}>
            <Skeleton />
          </span>
        </Col>
        <Col xs={3} className={visibleRenderButtonDisconnectStripe ? classes.valueRedeemed : classes.valueAvailed}>
          <Skeleton />
        </Col>
      </Row>
      <Row className={classes.item}>
        <Col xs={3}>
          <span className={classes.textInfo}>
            <Skeleton />
          </span>
        </Col>
        <Col xs={6}>
          <span className={classes.textInfo}>
            <Skeleton />
          </span>
        </Col>
        <Col xs={3} className={!visibleRenderButtonDisconnectStripe ? classes.valueRedeemed : classes.valueAvailed}>
          <Skeleton />
        </Col>
      </Row>
    </div>
  );
};

export default ListGiftCarLoading;
