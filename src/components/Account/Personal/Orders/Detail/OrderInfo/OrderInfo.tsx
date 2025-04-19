import React, { FC, HtmlHTMLAttributes, useCallback, useMemo, useState } from 'react';
import { OrderDetailModel, LineItemModel } from 'model/store/account/personal/orders.model';
import cx from 'classnames';
import startCase from 'lodash/startCase';
import camelCase from 'lodash/camelCase';
import isArray from 'lodash/isArray';
import toLower from 'lodash/toLower';
import { isNotDateExpired, formatDateNoTime } from 'helpers/date.helper';
import Card from '@ui/Cards';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import SafeImage from 'components/Image/SafeImage';
import MenuCustom from '@ui/CustomMenu';
import { formatCurrency, slugifyId } from 'helpers/string.helper';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Button from '@ui/Buttons/Primary/Button';
import Link from 'next/link';
import { useUserInfo } from 'hooks/useUserInfo';
import { UserBasicInfoModel } from 'model/store/info.model';
import dayjs from 'dayjs';
import { useStoreInfo } from 'hooks/useStoreInfo';
import { markAsReceivedForBuyer, markAsReceivedItemForBuyer } from 'api/account/personal/order.api';
import { getDetailOrder } from 'store/account/personal/orders/orders.action';
import classes from './order-item.module.scss';
import StoreState from '../../../../../../model/store';
import ReturnModal, { Item } from '../ReturnModal/ReturnModal';
import SendComplaintModal from '../SendComplaintModal/SendComplaintModal';
import OpenCaseModal from '../OpenCaseModal/OpenCaseModal';
import PopupOpenCase from '../OpenCaseModal/PopupOpenCase';

interface Props extends HtmlHTMLAttributes<HTMLDivElement> {
  order: OrderDetailModel;
  isSeller: boolean;
}

const OrderInfo: FC<Props> = ({ order, isSeller, ...other }) => {
  const userInfo = useUserInfo(isSeller && order.user ? [order.user] : order?.seller);
  const sellerInfo = useStoreInfo(order.storefronts[0] !== 'no_provider' ? order.storefronts[0] : '');
  const router = useRouter();
  const getInfo = useCallback(
    (id) => {
      if (!order.storefronts[0] || order.storefronts[0] === 'no_provider' || isSeller) {
        if (isArray(userInfo)) {
          return userInfo.find((i: UserBasicInfoModel) => i.id === id);
        }
        return userInfo;
      }
      return sellerInfo;
    },
    [order.storefronts, sellerInfo, userInfo, isSeller],
  );
  const dispatch = useDispatch();
  const { token, userId } = useSelector((state: StoreState) => ({
    token: state.authenticate.token,
    userId: state.authenticate.user?._id,
  }));
  const isStoreFront = order.storefronts[0] !== 'no_provider';
  const hrefSellerPath = isStoreFront ? '/marketplace/online-store/[storeId]' : '/marketplace/seller/[sellerId]';
  const [data, setData] = useState<Item[]>([]);
  const [returnModalVisible, setReturnVisible] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [showOpenCase, setShowOpenCase] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const getSellerPath = useCallback(
    (item) => {
      return isStoreFront
        ? `/marketplace/online-store/${order.storefronts[0]}`
        : `/marketplace/seller/${item.seller_id}`;
    },
    [isStoreFront, order.storefronts],
  );

  const renderRefundLink = useCallback(
    (item: LineItemModel) => {
      const isAllowReturn = item.is_allow_return;
      const isReturnNotExpire = isNotDateExpired(order?.date_finish, item.return_within_days);
      const sellerBBBStaff: boolean = item?.seller_is_bbb;
      const marketListingId = item?.market_listings?.length ? item.market_listings[0]?.market_listing_id : '';

      if ((isAllowReturn && isReturnNotExpire) || sellerBBBStaff) {
        return toLower(item.status) === 'refund' || toLower(item.status) === 'refunded' || item.is_buyer_return ? (
          <>
            {item.quantity < 2 ? (
              <Link
                href={{
                  pathname: `/account/return-detail/order/[itemId]/[id]`,
                  query: {
                    inventory: item.inventory_id,
                    marketListing: item.market_listing_ids[0],
                  },
                }}
                as={{
                  pathname: `/account/return-detail/order/${item.master_listing_id}/${order?._id}`,
                  query: {
                    inventory: item.inventory_id,
                    marketListing: item.market_listing_ids[0],
                  },
                }}>
                <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn} style={{ textAlign: 'left' }}>
                  View Return Detail
                </Button>
              </Link>
            ) : (
              <Button
                buttonSize="s"
                buttonType="clear"
                className={classes.resizeBtn}
                onClick={() => {
                  setData(
                    item.market_listings.map((i, index) => ({
                      ...i,
                      name: item.bicycle_name,
                      frame_size: item.frame_sizes[index]?.frame_size || item.frame_sizes[0].frame_size,
                      master_listing_id: item.master_listing_id,
                      order_id: order._id,
                    })),
                  );
                  setReturnVisible(true);
                }}>
                View Return Detail
              </Button>
            )}
          </>
        ) : (
          order?.status !== 'refunded' && (
            <>
              {item.quantity < 2 ? (
                <Link
                  href={{
                    pathname: `/account/${isSeller ? 'refund' : 'return'}/order/[itemId]/[id]`,
                    query: {
                      inventory: item.inventory_id,
                      marketListing: marketListingId,
                    },
                  }}
                  as={{
                    pathname: `/account/${isSeller ? 'refund' : 'return'}/order/${item.master_listing_id}/${order._id}`,
                    query: {
                      inventory: item.inventory_id,
                      marketListing: marketListingId,
                    },
                  }}>
                  <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn}>
                    {isSeller ? 'Refund Item' : 'Return Item'}
                  </Button>
                </Link>
              ) : (
                <Button
                  buttonSize="s"
                  buttonType="clear"
                  className={classes.resizeBtn}
                  onClick={() => {
                    setData(
                      item.market_listings.map((i, index) => ({
                        ...i,
                        name: item.bicycle_name,
                        frame_size: item.frame_sizes[index]?.frame_size || item.frame_sizes[0].frame_size,
                        master_listing_id: item.master_listing_id,
                        order_id: order._id,
                      })),
                    );
                    setReturnVisible(true);
                  }}>
                  Return Item
                </Button>
              )}
            </>
          )
        );
      }
      return (
        (toLower(item.status) === 'refund' || toLower(item.status) === 'refunded' || item.is_buyer_return) && (
          <>
            {item.quantity < 2 ? (
              <Link
                href={{
                  pathname: `/account/return-detail/order/[itemId]/[id]`,
                  query: {
                    inventory: item.inventory_id,
                    marketListing: item.market_listing_ids[0],
                  },
                }}
                as={{
                  pathname: `/account/return-detail/order/${item.master_listing_id}/${order?._id}`,
                  query: {
                    inventory: item.inventory_id,
                    marketListing: item.market_listing_ids[0],
                  },
                }}>
                <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn} style={{ textAlign: 'left' }}>
                  View Return Detail
                </Button>
              </Link>
            ) : (
              <Button
                buttonSize="s"
                buttonType="clear"
                className={classes.resizeBtn}
                onClick={() => {
                  setData(
                    item.market_listings.map((i, index) => ({
                      ...i,
                      name: item.bicycle_name,
                      frame_size: item.frame_sizes[index]?.frame_size || item.frame_sizes[0].frame_size,
                      master_listing_id: item.master_listing_id,
                      order_id: order._id,
                    })),
                  );
                  setReturnVisible(true);
                }}>
                View Return Detail
              </Button>
            )}
          </>
        )
      );
    },
    [order, isSeller],
  );
  const openCancelPage = useCallback(() => {
    const isNotExpired =
      order?.date_finish &&
      dayjs(order?.date_finish).unix() &&
      dayjs().unix() - 3600 < dayjs(order?.date_finish).unix();
    if (!isNotExpired) {
      toastError('This order is expired to cancel order. If you want to cancel order, please contact seller.');
    } else {
      router.push(`/account/order/${order._id}/cancel`);
    }
  }, [order, router]);
  const onMarkAsReceivedItem = useCallback(
    (item, status: 'RECEIVED' | 'NOT_RECEIVED') => {
      const items = item.market_listing_ids.map((i: number) => ({
        market_listing: i,
        master_listing: item.master_listing_id,
        status,
      }));
      markAsReceivedItemForBuyer({
        order_id: order?._id,
        master_listings: items,
      })
        .then(() => {
          dispatch(getDetailOrder(router.query.id));
          toastSuccess(`Mark as ${status === 'RECEIVED' ? 'received' : 'not received'} successfully`);
        })
        .catch((e) => {
          toastError(e);
        });
    },
    [order, dispatch, router.query],
  );
  const onMarkAsReceived = useCallback(
    (status: 'RECEIVED' | 'NOT_RECEIVED') => {
      markAsReceivedForBuyer({
        order_id: order?._id,
        status,
      })
        .then(() => {
          dispatch(getDetailOrder(router.query.id));
          toastSuccess(`Mark as ${status === 'RECEIVED' ? 'received' : 'not received'} successfully`);
        })
        .catch((e) => {
          toastError(e);
        });
    },
    [order, dispatch, router.query],
  );
  const onSendComplaint = useCallback(() => {
    setShow((prev) => !prev);
  }, []);
  const onOpenCase = useCallback(() => {
    setShowOpenCase((prev) => !prev);
    setShowPopup(false);
  }, []);
  const onOpenPopup = useCallback(() => {
    setShowPopup((prev) => !prev);
  }, []);
  const checkItemActionsRender = useCallback(
    (item) => {
      return (
        (renderRefundLink(item) && token) ||
        (userId === order?.user &&
          order?.status !== 'canceled' &&
          order?.status !== 'refund' &&
          order?.status !== 'refunded' &&
          toLower(item.status) !== 'received' &&
          toLower(item.status) !== 'refunded' &&
          !item.local_pickup) ||
        (userId === order?.user &&
          order?.status !== 'canceled' &&
          order?.status !== 'refund' &&
          order?.status !== 'refunded' &&
          toLower(item.status) !== 'not_received' &&
          toLower(item.status) !== 'received' &&
          toLower(item.status) !== 'refunded' &&
          !item.local_pickup)
      );
    },
    [renderRefundLink, token, userId, order],
  );
  const renderListMenuItem = useCallback(
    (item) => {
      return (
        <>
          {renderRefundLink(item) && token && <li>{renderRefundLink(item)}</li>}
          {userId === order?.user &&
            order?.status !== 'canceled' &&
            order?.status !== 'refund' &&
            order?.status !== 'refunded' &&
            toLower(item.status) !== 'received' &&
            toLower(item.status) !== 'refunded' &&
            !item.local_pickup && (
              <li>
                <Button
                  buttonSize="s"
                  buttonType="clear"
                  className={classes.resizeBtn}
                  onClick={() => onMarkAsReceivedItem(item, 'RECEIVED')}>
                  <span>Mark as Received</span>
                </Button>
              </li>
            )}
          {userId === order?.user &&
            order?.status !== 'canceled' &&
            order?.status !== 'refund' &&
            order?.status !== 'refunded' &&
            toLower(item.status) !== 'not_received' &&
            toLower(item.status) !== 'received' &&
            toLower(item.status) !== 'refunded' &&
            !item.local_pickup && (
              <li>
                <Button
                  buttonSize="s"
                  buttonType="clear"
                  className={classes.resizeBtn}
                  onClick={() => onMarkAsReceivedItem(item, 'NOT_RECEIVED')}>
                  <span>Mark as Not Received</span>
                </Button>
              </li>
            )}
        </>
      );
    },
    [order, renderRefundLink, token, userId, onMarkAsReceivedItem],
  );
  const isAllowRefundOrder = useMemo(() => {
    const sellerIsBBB = order?.line_item[0]?.seller_is_bbb;
    if (order?.status === 'refunded') {
      return false;
    }
    if (order?.status !== 'refund') {
      if (sellerIsBBB) {
        return true;
      }
      if (!sellerIsBBB) {
        const existItemAllowRefund = order.line_item.find((i: LineItemModel) => {
          const itemNotExpired = isNotDateExpired(order?.date_finish, i?.return_within_days);
          return i?.is_allow_return && toLower(i?.status) !== 'refund' && itemNotExpired;
        });
        if (existItemAllowRefund) return true;
      }
    }
    return false;
  }, [order]);
  const localPickUpOnly = useMemo(() => {
    return !!order?.line_item?.every((item) => !!item.local_pickup);
  }, [order]);
  const checkActionsRender = useCallback(() => {
    const allowCancelOrder =
      order?.status !== 'received' &&
      order?.status !== 'canceled' &&
      order?.status !== 'refund' &&
      !order?.buyer_request_cancel;
    return (
      userId === order?.user ||
      (userId === order?.user && order?.status === 'completed' && !localPickUpOnly) ||
      (userId === order?.user &&
        (order?.status === 'completed' || order?.status === 'not_received') &&
        !localPickUpOnly) ||
      allowCancelOrder ||
      (isAllowRefundOrder && isSeller)
    );
  }, [order, userId, localPickUpOnly, isAllowRefundOrder, isSeller]);
  const renderListMenu = useCallback(() => {
    const allowCancelOrder =
      order?.status !== 'received' &&
      order?.status !== 'canceled' &&
      order?.status !== 'refund' &&
      order?.status !== 'refunded' &&
      !order?.buyer_request_cancel;
    return (
      <>
        {isAllowRefundOrder && isSeller && (
          <li>
            <Link href={`/account/order/[id]/refund`} as={`/account/order/${order?._id}/refund`}>
              <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn}>
                <span>Refund this order</span>
              </Button>
            </Link>
          </li>
        )}
        {userId === order?.user &&
          (order?.status === 'completed' || order?.status === 'not_received') &&
          !localPickUpOnly && (
            <li>
              <Button
                buttonSize="s"
                buttonType="clear"
                className={classes.resizeBtn}
                onClick={() => onMarkAsReceived('RECEIVED')}>
                <span>Mark as Received</span>
              </Button>
            </li>
          )}
        {userId === order?.user && order?.status === 'completed' && !localPickUpOnly && (
          <li>
            <Button
              buttonSize="s"
              buttonType="clear"
              className={classes.resizeBtn}
              onClick={() => onMarkAsReceived('NOT_RECEIVED')}>
              <span>Mark as Not Received</span>
            </Button>
          </li>
        )}
        {/* {userId === order?.user && (
          <li>
            <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn} onClick={onSendComplaint}>
              <span>Send Complaint</span>
            </Button>
          </li>
        )} */}
        {userId === order?.user && (
          <li>
            <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn} onClick={onOpenPopup}>
              <span>Open a Case</span>
            </Button>
          </li>
        )}
        {allowCancelOrder && (
          <li>
            <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn} onClick={openCancelPage}>
              <span style={{ color: '#ee5c5e' }}>Cancel order</span>
            </Button>
          </li>
        )}
      </>
    );
  }, [order, userId, isAllowRefundOrder, isSeller, localPickUpOnly, openCancelPage, onOpenPopup, onMarkAsReceived]);
  const renderInfoCancelled = useMemo(() => {
    if (order?.buyer_request_cancel || order?.seller_cancel) {
      const reasonCancel: string = order?.buyer_request_cancel
        ? order?.buyer_reason_cancel
        : order?.seller_reason_cancel;
      return (
        <Row>
          <Col xs={12}>
            <h3 className={classes.title}>
              {order.status === 'canceled' ? 'This order was canceled' : 'Cancellation request notice'}
            </h3>
          </Col>
          <Col xs={6} lg={3} className={classes.label}>
            Requested:
          </Col>
          <Col xs={6} lg={9} className={classes.value}>
            {formatDateNoTime(order?.date_finish)}
          </Col>
          <Col xs={6} lg={3} className={classes.label}>
            Reason:
          </Col>
          <Col xs={6} lg={9} className={classes.value}>
            {reasonCancel || '-'}
          </Col>
          <Col xs={6} lg={3} className={classes.label}>
            Buyer name:
          </Col>
          <Col xs={6} lg={9} className={classes.value}>
            {order?.shipping_address?.recipient_name || order?.customer_name}
          </Col>
        </Row>
      );
    }
    return null;
  }, [order]);

  const checkStatus = useCallback((status: string) => {
    const s = toLower(status);
    if (s !== 'listed' && s !== 'de_listed') {
      return true;
    }
    return false;
  }, []);

  return (
    <div {...other}>
      <Card className={cx('mt-4', classes.card)}>
        <Row>
          <Col xs={12} md={6}>
            <h3 className="mb-0">Order #{order.order_code}</h3>
            <p className={cx(classes.text, 'mt-2')}>{dayjs(order.date_created).format('DD MMMM YYYY')}</p>
          </Col>
          <Col className={classes.statusAction} xs={12} md={6}>
            <div className={classes.statusContainer}>
              <span className={classes.text}>Status</span>
              <span className={cx('text-capitalize', classes.status)}>{startCase(camelCase(order.status))}</span>
            </div>
            {checkActionsRender() && <MenuCustom classMenuContent={classes.customMenu} listMenu={renderListMenu()} />}
          </Col>
        </Row>
        {renderInfoCancelled}
      </Card>
      {order?.line_item?.map((item) => (
        <Card key={item.bicycle_id} className={cx(classes.product, 'mt-4')}>
          <Row className={'w-100 m-0'}>
            <Col xs={12} lg={5} className={cx('text-center p-0', classes.imageContainer)}>
              <SafeImage src={item.image_default} className={cx(classes.image, 'img-fluid')} />
            </Col>
            <Col xs={12} lg={7} className={'p-0'}>
              <div className={classes.detail}>
                <div className={'d-flex align-items-center justify-content-between'}>
                  <Link
                    href={'/marketplace/buy-now/[id]'}
                    as={`/marketplace/buy-now/${slugifyId(item.bicycle_name, item.master_listing_id)}`}>
                    <a>
                      <h4 className={cx('mb-0', classes.bikeName)}>{item.bicycle_name || item.title || '-'}</h4>
                    </a>
                  </Link>
                  {checkItemActionsRender(item) && (
                    <MenuCustom classMenuContent={classes.customMenu} listMenu={renderListMenuItem(item)} />
                  )}
                </div>
                <div className={cx('d-flex align-items-center', classes.address)}>
                  <p className={'mb-0'}>
                    {item.state_name}, {item.city_name}
                  </p>
                  {checkStatus(item.status) && (
                    <span className={classes.status}>{startCase(camelCase(item.status))}</span>
                  )}
                </div>
                <div className={'d-flex'}>
                  <Link href={hrefSellerPath} as={getSellerPath(item)}>
                    <a className={classes.soldBy}>
                      <p className={'mb-0'}>
                        {isSeller
                          ? `Bought by ${getInfo(order.user)?.displayName}`
                          : `Sold by ${getInfo(item.seller_id)?.displayName || getInfo(item.seller_id)?.name}`}
                      </p>
                    </a>
                  </Link>
                </div>
                <div className={cx('d-flex', classes.bikeInfo)}>
                  <p className={'mb-0'}>
                    {item.bicycle_type_name}
                    {item.frame_size !== 'no_provider' ? `, ${item.frame_size}` : ''}
                  </p>
                  <p className={'ml-4 mb-0'}>Qty {item.quantity}</p>
                </div>
                <div className={'d-flex align-items-center justify-content-between'}>
                  <div className={'d-flex'}>
                    <p className={classes.price}>{formatCurrency(Number(item.fix_subtotal))}</p>
                    {item.local_pickup ? (
                      <p className={cx(classes.shipping, 'text-warning ml-4')}>Local pickup</p>
                    ) : (
                      <p className={cx(classes.shipping, 'ml-4')}>{formatCurrency(Number(item.fix_shipping), false)}</p>
                    )}
                  </div>
                </div>
                <div className={'d-flex'}>
                  <p className="mr-3"> Tracking No.</p>
                  <Link
                    href={`https://wwwapps.ups.com/tracking/tracking.cgi?tracknum=${item?.tracking_number}&requester=ST/trackdetails`}>
                    <a className={classes.soldBy}>
                      <p className={classes.link}>{item?.tracking_number}</p>
                    </a>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      ))}
      <ReturnModal
        items={data}
        isOpen={returnModalVisible}
        onClose={() => {
          setData([]);
          setReturnVisible(false);
        }}
      />
      <SendComplaintModal isSeller={isSeller} orderId={order?._id} isOpen={show} onClose={onSendComplaint} />
      <OpenCaseModal isSeller={isSeller} orderId={order?._id} isOpen={showOpenCase} onClose={onOpenCase} />
      <PopupOpenCase isOpen={showPopup} onClose={onOpenPopup} onOpenModal={onOpenCase} />
    </div>
  );
};

export default OrderInfo;
