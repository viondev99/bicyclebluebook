import React, { FC, useMemo } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { formatCurrency, slugifyId } from 'helpers/string.helper';
import Link from 'next/link';
import { OrderDetailModel } from 'model/store/account/personal/orders.model';
import cx from 'classnames';
import Card from '@ui/Cards';
import { DetailOrderModel } from 'model/store/store-front/order.model';
import SafeImage from 'components/Image/SafeImage';
import images from '@images';
import classes from './order-info.module.scss';

interface Props {
  order: DetailOrderModel | OrderDetailModel;
}

const OrderInfo: FC<Props> = ({ order }) => {
  const infoCost = useMemo(() => {
    return (
      <>
        <div className={classes.chip}>
          <div className={classes.chipTitle}>Sub total</div>
          <div className={classes.chipContent}>{formatCurrency(order?.amount?.details?.subtotal || 0)}</div>
        </div>
        <div className={classes.chip}>
          <div className={classes.chipTitle}>Shipping</div>
          <div className={classes.chipContent}>{formatCurrency(order?.amount?.details?.shipping || 0)}</div>
        </div>
        <div className={classes.chip}>
          <div className={classes.chipTitle}>Insurance</div>
          <div className={classes.chipContent}>{formatCurrency(order?.amount?.details?.insurance || 0)}</div>
        </div>
        <div className={classes.chip}>
          <div className={classes.chipTitle}>Order total</div>
          <div className={cx(classes.chipContent, classes.price)}>{formatCurrency(order?.amount?.total || 0)}</div>
        </div>
      </>
    );
  }, [order]);
  return (
    <div>
      <Card className={classes.headerOrderInfo}>
        <div className={classes.subTitle}>Cancel Order</div>
        <Row>
          <Col xs={12} className={classes.buyerName}>
            <span className={classes.buyer}>
              Bought by{' '}
              <Link href={`/marketplace/seller/${order?.line_item[0]?.buyer_id}`}>
                <a>{order?.customer_name}</a>
              </Link>
            </span>
          </Col>
          <Col xs={12} className={cx(classes.wrapInfo)}>
            {infoCost}
          </Col>
        </Row>
      </Card>
      <Card className={classes.containOrderInfo}>
        {order?.line_item?.map((item) => (
          <Row key={item._id} className={classes.lineItem}>
            <Col xs={12} sm={5}>
              <Link
                href={'/marketplace/buy-now/[id]'}
                as={`/marketplace/buy-now/${slugifyId(item?.title, item?.master_listing_id)}/`}>
                <SafeImage
                  src={item?.image_default || images.tradeIn.bgBike}
                  className={cx('img-fluid', classes.image)}
                />
              </Link>
            </Col>
            <Col xs={12} sm={7} className={classes.wrapLineItemInfo}>
              <Link
                href={'/marketplace/buy-now/[id]'}
                as={`/marketplace/buy-now/${slugifyId(item?.title, item?.master_listing_id)}/`}>
                <a className={classes.title}>{item.bicycle_name}</a>
              </Link>
              <div className={classes.wrapChips}>
                <div className={classes.chip}>
                  <span className={classes.chipTitle}>Qty</span>
                  <span className={classes.chipContent}>{item.quantity}</span>
                </div>
                <div className={classes.chip}>
                  <span className={classes.chipTitle}>Frame Size</span>
                  <span className={classes.chipContent}> {item.frame_size}</span>
                </div>
              </div>
              <div className={classes.price}>{formatCurrency(item?.fix_subtotal)}</div>
              <div className={classes.idInfo}>
                <span>ID {item.master_listing_id}</span>
                <span>{item?.name}</span>
              </div>
            </Col>
          </Row>
        ))}
      </Card>
    </div>
  );
};
export default OrderInfo;
