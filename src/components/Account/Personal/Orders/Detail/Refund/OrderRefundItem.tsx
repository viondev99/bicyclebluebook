import React, { FC, useCallback } from 'react';
import { AmountCustom } from 'model/store/store-front/order.model';
import { OrderDetailModel, LineItemModel } from 'model/store/account/personal/orders.model';
import startCase from 'lodash/startCase';
import camelCase from 'lodash/camelCase';
import toLower from 'lodash/toLower';
import Card from '@ui/Cards';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { isNotDateExpired } from 'helpers/date.helper';
import iconDollar from 'assets/img/common/ic_dollar.svg';
import dayjs from 'dayjs';
import cx from 'classnames';
import SafeImage from 'components/Image/SafeImage';
import { formatCurrency, slugifyId } from 'helpers/string.helper';
import Link from 'next/link';
import Input from '@ui/Inputs/Input';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import classes from './refund-order.module.scss';

interface Props {
  order: OrderDetailModel;
  amounts: AmountCustom[];
  onChangePriceRefund: (params: AmountCustom) => void;
  errors?: Array<{ id: string; message: string }>;
}

const OrderRefundItem: FC<Props> = ({ order, errors, amounts, onChangePriceRefund }) => {
  const totalListingRefundedInlineItem = useCallback((item: LineItemModel) => {
    const totalItemRefunded = item.market_listings.filter((mkItem: any) => mkItem.is_seller_refund);
    return totalItemRefunded ? totalItemRefunded.length : 0;
  }, []);
  const isStorefront = useSelector((store: StoreState) => !!store.authenticate.user?.storefront);

  const findAmountValue = useCallback(
    (idItem: string) => {
      if (amounts) {
        const amountFounded = amounts.find((item) => {
          return item.id === idItem;
        });
        return amountFounded && amountFounded.amount ? amountFounded.amount : '';
      }
      return '';
    },
    [amounts],
  );

  const onChangeValueAmounts = useCallback(
    (e: any, item: LineItemModel) => {
      const { value } = e.target;
      if (Number(value) >= 0 && value.length <= 10) {
        const inventoryId = item.inventory_ids[0] ? item.inventory_ids[0] : item.inventory_id;
        const quantityAllowRefund = totalListingRefundedInlineItem(item)
          ? item.quantity - totalListingRefundedInlineItem(item)
          : item.quantity;
        onChangePriceRefund({
          inventory_id: inventoryId,
          amount: Number(e.target.value),
          quantityAllowRefund,
          id: item._id,
        });
      }
    },
    [onChangePriceRefund, totalListingRefundedInlineItem],
  );

  const checkValidateError = useCallback(
    (idItem: string) => {
      if (errors) {
        const result = errors.find((item: { id: string; message: string }) => item.id === idItem);
        if (result) {
          return result.message;
        }
      }
      return false;
    },
    [errors],
  );

  const renderInputRefund = useCallback(
    (item: LineItemModel) => {
      const HaveAtLeastOneListingNotRefund = item.quantity > totalListingRefundedInlineItem(item);
      const ItemNotHaveConFig = !item.seller_is_bbb && !item.is_allow_return;
      const IsItemExpired = !item.seller_is_bbb && !isNotDateExpired(order?.date_finish, item?.return_within_days);
      const AllowRefund = toLower(item.status) !== 'refund' && HaveAtLeastOneListingNotRefund;

      if (ItemNotHaveConFig) {
        return (
          <div>
            <b className={classes.statusItem}>No config refund</b>
          </div>
        );
      }

      if (IsItemExpired) {
        return (
          <div>
            <b className={classes.statusItem}>Expired return/refund</b>
          </div>
        );
      }
      return AllowRefund ? (
        <div>
          <Input
            value={findAmountValue(item?._id)}
            renderPrefix={<img src={iconDollar} alt={'Dollar Icon'} className="icon-button22" />}
            onChange={(e) => onChangeValueAmounts(e, item)}
          />

          {checkValidateError(item._id) && <div className={classes.lineError}>{checkValidateError(item._id)}</div>}
        </div>
      ) : (
        <div>
          <div className={classes.statusItem}>Refunded</div>
          {item.master_listing_id && item.market_listings[0] && (
            <Link
              href={{
                pathname: `/${isStorefront ? 'store-front' : 'account'}/return-detail/mylistings/[itemId]/[id]`,
                query: {
                  inventory: item.market_listings[0].inventory_id,
                  marketListing: item.market_listings[0].market_listing_id,
                },
              }}
              as={{
                pathname: `/${isStorefront ? 'store-front' : 'account'}/return-detail/mylistings/${
                  item.master_listing_id
                }/${order._id}`,
                query: {
                  inventory: item.market_listings[0].inventory_id,
                  marketListing: item.market_listings[0].market_listing_id,
                },
              }}>
              <a className={classes.customLink}>View Return Detail</a>
            </Link>
          )}
        </div>
      );
    },
    [checkValidateError, findAmountValue, onChangeValueAmounts, order, totalListingRefundedInlineItem, isStorefront],
  );

  return (
    <div>
      <Card className={cx('mt-4', classes.card)}>
        <Row>
          <Col xs={12} md={6}>
            <h3 className="mb-0">Order #{order.order_code}</h3>
            <p className={cx(classes.text, 'mt-2')}>{dayjs(order.date_created).format('DD MMMM YYYY')}</p>
          </Col>
          <Col xs={12} md={6} className="d-flex flex-row flex-md-column text-left text-md-right">
            <span className={classes.text}>Status</span>
            <span className={cx('text-capitalize ml-2 ml-md-0 mt-md-2 mt-0', classes.status)}>
              {startCase(camelCase(order.status))}
            </span>
          </Col>
        </Row>
      </Card>

      {order.line_item.map((item) => (
        <Card key={item.bicycle_id} className={cx(classes.productCard, 'mt-4')}>
          <Row className={'w-100 m-0'}>
            <Col xs={12} md={5} lg={4} className={cx('text-center p-0', classes.imageContainer)}>
              <SafeImage src={item.image_default} className={cx('img-fluid', classes.image)} />
            </Col>
            <Col xs={12} md={7} lg={8}>
              <Row className={classes.detail}>
                <Col xs={9} className={'p-0 pl-1'}>
                  <Link
                    href={'/marketplace/buy-now/[id]'}
                    as={`/marketplace/buy-now/${slugifyId(item.bicycle_name, item.master_listing_id)}`}>
                    <a>
                      <h4 className={classes.bicycleName}>{item.bicycle_name}</h4>
                    </a>
                  </Link>

                  <div className={'d-flex mt-3'}>
                    <p>
                      <span className={classes.fontWeight500}>Qty</span>
                      <span className={cx('ml-2', classes.quanity)}>{item.quantity}</span>
                    </p>
                    <p className="ml-4">
                      <span className={classes.fontWeight500}>Frame Size </span>
                      <span className={cx('ml-2', classes.frameSize)}>
                        {item.frame_size !== 'no_provider' ? `${item.frame_size}` : ''}
                      </span>
                    </p>
                  </div>
                  <div className="d-flex mt-3 flex-wrap">
                    <p className={classes.price}>
                      {formatCurrency(Number(item.subtotal) + item.insurance + item.shipping)}
                    </p>
                    {item.is_buyer_return && item?.status !== 'REFUNDED' && (
                      <p className={cx(classes.returnText, 'text-danger ml-4')}>Return Requested</p>
                    )}
                  </div>

                  <div className={'mt-3'}>
                    <span className={classes.serial}>ID {item.master_listing_id}</span>
                    <span className={cx('ml-2', classes.serial)}>{item.name}</span>
                  </div>
                </Col>

                <Col xs={3} className={'p-0 position-relative'}>
                  <div className={classes.groupInput}>{renderInputRefund(item)}</div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
};

export default OrderRefundItem;
