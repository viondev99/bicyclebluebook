/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { FC, useCallback } from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import cx from 'classnames';
import { GetListGiftCardItem, ListGiftCardHistory } from 'model/store/account/personal/gift-card.model';
import { formatNumberLargeDecimal } from 'helpers/utilities.helper';
import { formatDateLocalCustom } from 'helpers/date.helper';
import { useRouter } from 'next/router';
import classes from './gift-card-info.module.scss';

interface Props {
  data: GetListGiftCardItem;
  key: string;
}

const GiftCardInfo: FC<Props> = ({ data, key }) => {
  const router = useRouter();

  const gotoDetailOrder = useCallback(
    (orderId: string) => {
      if (!orderId || orderId === '') {
        return;
      }
      router.push(`/account/order/${orderId}`);
    },
    [router],
  );

  const formatCurrencyDollar = useCallback((currency: string) => {
    const firstChar = currency.charAt(0);
    if (firstChar === '-') {
      return currency.replace('-', '-$');
    }
    return `$${currency}`;
  }, []);

  const renderListHistories = useCallback(
    (listHistories: ListGiftCardHistory[]) => {
      if (!listHistories || listHistories?.length === 0) {
        return null;
      }
      return listHistories.map((it) => {
        return (
          <>
            <Row className={classes.item} key={it?._id}>
              <Col xs={3}>
                <span className={classes.textInfo}>{formatDateLocalCustom(it?.date_created, 'DD MMM YYYY')}</span>
              </Col>
              <Col xs={4}>
                <span className={classes.textInfo}>{it?.buyer_id ? `Gift card availed` : `Gift card redeemed`}</span>
              </Col>
              <Col xs={3} className={classes.textInfo}>
                <span onClick={() => gotoDetailOrder(it?.order)} className={cx(classes.textInfo, classes.textLink)}>
                  {it?.order_code}
                </span>
              </Col>
              <Col xs={2} className={cx(classes.valueRedeemed, it.buyer_id && classes.valueAvailed)}>
                {formatCurrencyDollar(formatNumberLargeDecimal(Number(it?.amount_available) - Number(it?.old_amount)))}
              </Col>
            </Row>
            {/* {!account && !loading && (
            <div className={classes.rowBtn}>
              <Button
                disabled={loading}
                className={classes.button}
                type="button"
                buttonType={'transparent'}
                buttonSize={'l'}
                onClick={onConnectStripe}>
                <>
                  <img src={images.account.partner.icGiftCard} alt={'bank-error'} />
                  Redeem gift card
                </>
              </Button>
            </div>
          )} */}
          </>
        );
      });
    },
    [formatCurrencyDollar, gotoDetailOrder],
  );

  return (
    <div className={classes.wrapListGiftCard} key={key}>
      <div className={classes.balance}>Gift Card Code</div>
      <div className={classes.giftCardCode}>{data?.code || ''}</div>
      <div className={classes.balance}>Balance</div>
      <div className={classes.valueBalance}>
        ${data?.amount_available ? formatNumberLargeDecimal(data?.amount_available) : '0.00'}
      </div>
      <div className={classes.activity}>Activity</div>
      {renderListHistories(data?.histories)}
    </div>
  );
};

export default GiftCardInfo;
