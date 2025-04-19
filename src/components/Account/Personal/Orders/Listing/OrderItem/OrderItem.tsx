import React, { FC, HtmlHTMLAttributes, useCallback, useMemo } from 'react';
import { OrderModel } from 'model/store/account/personal/orders.model';
import dayjs from 'dayjs';
import Link from 'next/link';
import cx from 'classnames';
import Card from '@ui/Cards';
import icRightArrowBlack from 'assets/img/common/ic_right_arrow_black.svg';
import SafeImage from 'components/Image/SafeImage';
import { formatCurrency, slugifyId } from 'helpers/string.helper';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import isArray from 'lodash/isArray';
import startCase from 'lodash/startCase';
import camelCase from 'lodash/camelCase';
import toLower from 'lodash/toLower';
import { useUserInfo } from 'hooks/useUserInfo';
import { useStoreInfo } from 'hooks/useStoreInfo';
import { UserBasicInfoModel } from 'model/store/info.model';
import classes from './order-item.module.scss';

interface Props extends HtmlHTMLAttributes<HTMLDivElement> {
  order: OrderModel;
}

const OrderItem: FC<Props> = ({ order, ...other }) => {
  const date = useMemo(() => {
    return dayjs(order.date_created).format('MMM Do, YYYY');
  }, [order.date_created]);

  const userInfo = useUserInfo(order.seller);
  const sellerInfo = useStoreInfo(order.storefronts[0] !== 'no_provider' ? order.storefronts[0] : '');
  const getSellerInfo = useCallback(
    (id) => {
      if (!order.storefronts[0] || order.storefronts[0] === 'no_provider') {
        if (isArray(userInfo)) {
          return userInfo.find((i: UserBasicInfoModel) => i.id === id);
        }
        return userInfo;
      }

      return sellerInfo;
    },
    [order.storefronts, sellerInfo, userInfo],
  );
  const isStoreFront = order.storefronts[0] !== 'no_provider';
  const hrefSellerPath = isStoreFront ? '/marketplace/online-store/[storeId]' : '/marketplace/seller/[sellerId]';
  const getSellerPath = useCallback(
    (item) => {
      return isStoreFront
        ? `/marketplace/online-store/${order.storefronts[0]}`
        : `/marketplace/seller/${item.seller_id}`;
    },
    [isStoreFront, order.storefronts],
  );

  const checkStatus = useCallback((status: string) => {
    const s = toLower(status);
    if (s !== 'listed' && s !== 'de_listed') {
      return true;
    }
    return false;
  }, []);

  return (
    <div {...other}>
      <div className={classes.header}>
        <div className={cx('d-flex flex-column flex-md-row ', classes.orderInfo)}>
          <h4>
            Order No. <span className={'text-uppercase'}>{order.order_code}</span>
          </h4>
          <span className={cx(classes.date, 'ml-md-4 mt-2 mt-md-0')}>{date}</span>
          <span className={cx(classes.status, 'ml-md-4 mt-2 mt-md-0')}>{startCase(camelCase(order.status))}</span>
        </div>
        <Link
          href={{
            pathname: `/account/order/[id]`,
          }}
          as={{
            pathname: `/account/order/${order._id}`,
          }}>
          <a className={cx(classes.viewMore, 'd-flex align-items-center ml-auto')}>
            <span>See Detail</span>
            <img src={icRightArrowBlack} alt={'Icon Next'} className={'ml-3'} />
          </a>
        </Link>
      </div>
      <div>
        {order?.line_item?.map((item) => (
          <Card key={item.bicycle_id} className={cx('p-0', classes.product)}>
            <Row className={'w-100 m-0'}>
              <Col xs={12} lg={4} className={cx('text-center', classes.imageContainer)}>
                <Link
                  href={'/marketplace/buy-now/[id]'}
                  as={`/marketplace/buy-now/${slugifyId(item.bicycle_name, item.master_listing_id)}`}>
                  <SafeImage src={item.image_default} className={cx(classes.image, 'img-fluid')} />
                </Link>
              </Col>
              <Col xs={12} lg={8} className={'p-0'}>
                <div className={classes.detail}>
                  <div>
                    <Link
                      href={'/marketplace/buy-now/[id]'}
                      as={`/marketplace/buy-now/${slugifyId(item.bicycle_name, item.master_listing_id)}`}>
                      <a>
                        <h4 className={'mb-1 d-inline-block'}>{item.bicycle_name || item.title || '-'}</h4>
                      </a>
                    </Link>
                  </div>
                  <div>
                    <Link href={hrefSellerPath} as={getSellerPath(item)}>
                      <a>
                        <span className={cx(classes.seller, 'my-1')}>
                          Sold by {getSellerInfo(item.seller_id)?.name}
                        </span>
                      </a>
                    </Link>
                  </div>
                  <div className="d-flex mt-1">
                    <span className={classes.price}>
                      {formatCurrency(Number(item.subtotal) + item.insurance + item.shipping)}
                    </span>
                    {checkStatus(item.status) && (
                      <span className={cx('ml-auto', classes.status)}>{startCase(camelCase(item.status))}</span>
                    )}
                  </div>
                  {order.buyer_request_cancel && order.status !== 'canceled' && (
                    <div className={classes.cancelNote}>Cancellation requested</div>
                  )}
                </div>
              </Col>
            </Row>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderItem;
