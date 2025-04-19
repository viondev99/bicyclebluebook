import React, { useCallback } from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { GiftDetailCustomerModal, TradeCreditItemModal } from 'model/store/account/personal/trade-credit.model';
import { formatNumberNotNegative } from 'helpers/string.helper';
import classes from './trade-credit.module.scss';
import TradeCreditSkeleton from './TradeCreditSkeleton';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';

interface Props {
  giftDetailCustomer: GiftDetailCustomerModal;
}

function HeaderTradeCredit(props: Props) {
  const { giftDetailCustomer } = props;
  const { loading } = useSelector((store: StoreState) => store.account.personal.tradeCredit);

  const renderLoading = useCallback(() => {
    return (
      <div>
        {new Array(2).fill(0).map((_, index) => (
          <TradeCreditSkeleton key={String(index)} className={classes.item} />
        ))}
      </div>
    );
  }, []);

  return (
    <Row className={classes.header}>
      <Col xs={12} sm={12} className={classes.headerItem}>
        <h3 className={classes.titleHeader}>Trade in credit</h3>
        {loading
          ? renderLoading()
          : giftDetailCustomer && (
              <>
                <Row className={classes.wrapperInput}>
                  <Col xs={6} sm={4}>
                    <div className={classes.label}>Amount Issued</div>
                  </Col>
                  <Col xs={6} sm={8} className={classes.value}>
                    {formatNumberNotNegative(giftDetailCustomer?.value_card?.price)}
                  </Col>
                </Row>
                <Row className={classes.wrapperInput}>
                  <Col xs={6} sm={4}>
                    <div className={classes.label}>Amount Remaining</div>
                  </Col>
                  <Col xs={6} sm={8} className={classes.value}>
                    {formatNumberNotNegative(giftDetailCustomer?.value_card?.balance)}
                  </Col>
                </Row>
                <Row className={classes.wrapperInput}>
                  <Col xs={6} sm={4}>
                    <div className={classes.label}>Gift card Code</div>
                  </Col>
                  <Col xs={6} sm={8} className={classes.value}>
                    {giftDetailCustomer?.giftcard_code}
                  </Col>
                </Row>
              </>
            )}
      </Col>
    </Row>
  );
}

export default HeaderTradeCredit;
