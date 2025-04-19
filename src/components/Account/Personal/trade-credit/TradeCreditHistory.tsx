/* eslint-disable react/no-array-index-key */
import React, { useCallback, useState } from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { DataList } from 'model/common';
import { GiftDetailCustomerModal, TradeCreditItemModal } from 'model/store/account/personal/trade-credit.model';
import { formatDateNoTime } from 'helpers/date.helper';
import Pagination from '@ui/Pagination/Pagination';
import { formatMoney, formatNegativeNumber, formatNumberNotNegative } from 'helpers/string.helper';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import classes from './trade-credit.module.scss';
import images from '@images';
import TradeCreditSkeleton from './TradeCreditSkeleton';

interface Props {
  listTradeCredit: DataList<TradeCreditItemModal>;
  giftDetailCustomer: GiftDetailCustomerModal;
}
function TradeCreditHistory(props: Props) {
  const [isDetail, setIsDetail] = useState<number>();
  const [isTransaction, setIsTransaction] = useState<number>();
  const { query, replace, pathname } = useRouter();
  const { loading, checkData } = useSelector((store: StoreState) => store.account.personal.tradeCredit);

  const handleDetailHistory = (index: number) => {
    setIsDetail(index);
  };
  const handleDisableDetail = () => {
    setIsDetail(null);
  };

  const handleDetailTransaction = (index: number) => {
    setIsTransaction(index);
  };
  const handleDisableTransaction = () => {
    setIsTransaction(null);
  };

  const renderLoading = useCallback(() => {
    return (
      <div>
        {new Array(3).fill(0).map((_, index) => (
          <TradeCreditSkeleton key={String(index)} className={classes.item} />
        ))}
      </div>
    );
  }, []);

  const handleChangePage = useCallback(
    (page) => {
      replace({
        pathname,
        query: {
          ...query,
          page,
        },
      });
    },
    [replace, query, pathname],
  );

  const renderTransactionItemLine = useCallback((item: TradeCreditItemModal) => {
    if (item?.order_line?.length) {
      return item?.order_line?.map((e) => {
        return (
          <div className={classes.valueText} key={item?._id}>
            {e || '-'}
          </div>
        );
      });
    }
    return item?.transaction_line?.map((e) => {
      return (
        <div className={classes.valueText} key={item?._id}>
          {e || '-'}
        </div>
      );
    });
  }, []);

  const renderListGiftHistory = useCallback(() => {
    const dataTransaction = props?.listTradeCredit?.data?.filter(
      (item: TradeCreditItemModal) => item.action === 'transaction',
    );
    const dataTradeInHistory = props?.listTradeCredit?.data?.filter(
      (item: TradeCreditItemModal) => item.action !== 'create_gift_card' && item.value_change !== 0,
    );
    return (
      <>
        {checkData ? (
          <div className={classes.notfound}>You haven't trade-in credit</div>
        ) : (
          <div className={classes.tradeInForm}>
            <div className={classes.headerForm}>
              <div className={classes.subTitle}>Trade in history</div>
            </div>
            {loading
              ? renderLoading()
              : dataTradeInHistory?.map((item, index) => (
                  <React.Fragment key={index}>
                    <Row className={classes.tradeInItem}>
                      <Col xs={12} sm={3} className={classes.item}>
                        <Row>
                          <Col xs={3} sm={12} className={classes.title}>
                            Date
                          </Col>
                          <Col xs={9} sm={12} className={classes.valueText}>
                            {formatDateNoTime(item.date_created)}
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12} sm={6} className={classes.item}>
                        <Row>
                          <Col xs={3} sm={12} className={classes.title}>
                            Item
                          </Col>
                          <Col xs={9} sm={12} className={classes.valueText}>
                            {item?.scorecard_info || '-'}
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12} sm={3} className={classes.item}>
                        <Row>
                          <Col xs={3} sm={12} className={classes.title}>
                            Value
                          </Col>
                          <Col xs={9} sm={12} className={classes.valueText}>
                            {formatNegativeNumber(item.value_change)}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    {isDetail !== index ? (
                      <div>
                        <span className={classes.detail} onClick={() => handleDetailHistory(index)}>
                          Full Details
                          <img
                            src={images.account.personal.icDownBlue}
                            alt={`icon down`}
                            className={classes.iconMenu}
                          />
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className={classes.detail} onClick={() => handleDisableDetail()}>
                          Full Details
                          <img src={images.account.personal.icUp} alt={`icon up`} className={classes.iconMenu} />
                        </span>
                      </div>
                    )}
                    {isDetail === index && (
                      <Row>
                        <Col xs={12} sm={12}>
                          <Row>
                            <Col xs={5} sm={3}>
                              <div className={classes.title}>Item</div>
                            </Col>
                            <Col xs={7} sm={9}>
                              <div className={classes.valueText}> {item?.scorecard_info || '-'}</div>
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12} sm={12}>
                          <Row>
                            <Col xs={5} sm={3}>
                              <div className={classes.title}>Value</div>
                            </Col>
                            <Col xs={7} sm={9}>
                              <div className={classes.valueText}>{formatNegativeNumber(item.value_change)}</div>
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12} sm={12}>
                          <Row>
                            <Col xs={5} sm={3}>
                              <div className={classes.title}>Scorecard ID</div>
                            </Col>
                            <Col xs={7} sm={9}>
                              <div className={classes.valueText}>{item?.scorecard || '-'}</div>
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12} sm={12}>
                          <Row>
                            <Col xs={5} sm={3}>
                              <div className={classes.title}>Gift card Code</div>
                            </Col>
                            <Col xs={7} sm={9}>
                              <div className={classes.valueText}>{props.giftDetailCustomer?.giftcard_code}</div>
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12} sm={12}>
                          <Row>
                            <Col xs={5} sm={3}>
                              <div className={classes.title}>Amount Issued</div>
                            </Col>
                            <Col xs={7} sm={9}>
                              <div className={classes.valueText}>{formatMoney(item?.value_origin)}</div>
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12} sm={12}>
                          <Row>
                            <Col xs={5} sm={3}>
                              <div className={classes.title}>Amount Remaining</div>
                            </Col>
                            <Col xs={7} sm={9}>
                              <div className={classes.valueText}>{formatMoney(item.balance)}</div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    )}
                    <hr className={classes.lineSeparate} />
                  </React.Fragment>
                ))}
            <div className={classes.headerForm}>
              <div className={classes.subTitle}>Transaction History</div>
            </div>
            {loading
              ? renderLoading()
              : dataTransaction?.map((item, index) => (
                  <React.Fragment key={index}>
                    <Row className={classes.tradeInItem}>
                      <Col xs={12} sm={3} className={classes.item}>
                        <Row>
                          <Col xs={3} sm={12} className={classes.title}>
                            Date
                          </Col>
                          <Col xs={9} sm={12} className={classes.valueText}>
                            {item?.order_line?.length
                              ? formatDateNoTime(item?.order_date)
                              : formatDateNoTime(item?.transaction_date)}
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12} sm={6} className={classes.item}>
                        <Row>
                          <Col xs={3} sm={12} className={classes.title}>
                            Total Item
                          </Col>
                          <Col xs={9} sm={12} className={classes.valueText}>
                            {item?.order_line?.length ? item?.order_item : item?.transaction_item}
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12} sm={3} className={classes.item}>
                        <Row>
                          <Col xs={3} sm={12} className={classes.title}>
                            Credit
                          </Col>
                          <Col xs={9} sm={12} className={classes.valueText}>
                            {formatNumberNotNegative(item?.value_change)}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    {isTransaction !== index ? (
                      <div>
                        <span className={classes.detail} onClick={() => handleDetailTransaction(index)}>
                          Full Details
                          <img
                            src={images.account.personal.icDownBlue}
                            alt={`icon down`}
                            className={classes.iconMenu}
                          />
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className={classes.detail} onClick={() => handleDisableTransaction()}>
                          Full Details
                          <img src={images.account.personal.icUp} alt={`icon up`} className={classes.iconMenu} />
                        </span>
                      </div>
                    )}
                    {isTransaction === index && (
                      <Row>
                        <Col xs={12} sm={12}>
                          <Row>
                            <Col xs={5} sm={3}>
                              <div className={classes.title}>Order#</div>
                            </Col>
                            <Col xs={7} sm={9}>
                              <div className={classes.valueText}>{item?.order_line && item?.order_code}</div>
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12} sm={12}>
                          <Row>
                            <Col xs={5} sm={3}>
                              <div className={classes.title}>Item</div>
                            </Col>
                            <Col xs={7} sm={9}>
                              {renderTransactionItemLine(item)}
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12} sm={12}>
                          <Row>
                            <Col xs={5} sm={3}>
                              <div className={classes.title}>Total</div>
                            </Col>
                            <Col xs={7} sm={9}>
                              <div className={classes.valueText}>
                                {item?.order_code ? item?.order_total : item?.transaction_total}
                              </div>
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12} sm={12}>
                          <Row>
                            <Col xs={5} sm={3}>
                              <div className={classes.title}>Credit</div>
                            </Col>
                            <Col xs={7} sm={9}>
                              <div className={classes.valueText}>{formatNumberNotNegative(item?.value_change)}</div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    )}
                    <hr className={classes.lineSeparate} />
                  </React.Fragment>
                ))}
            <div>
              <Pagination
                totalPage={props?.listTradeCredit?.total_page || 0}
                page={+String(props?.listTradeCredit?.page || '') || props?.listTradeCredit?.page}
                onChangePage={handleChangePage}
              />
            </div>
          </div>
        )}
      </>
    );
  }, [props, checkData, loading, renderLoading, handleChangePage, isDetail, isTransaction, renderTransactionItemLine]);

  return <div>{renderListGiftHistory()}</div>;
}

export default TradeCreditHistory;
