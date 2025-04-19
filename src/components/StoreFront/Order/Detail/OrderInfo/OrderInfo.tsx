import React, { FC, useCallback, useState, useMemo } from 'react';
import { DetailOrderModel } from 'model/store/store-front/order.model';
import { LineItemModel } from 'model/store/account/personal/orders.model';
import Card from '@ui/Cards';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { isNotDateExpired, isNewDataPrintLabel, formatDateNoTime } from 'helpers/date.helper';
import startCase from 'lodash/startCase';
import camelCase from 'lodash/camelCase';
import toLower from 'lodash/toLower';
import dayjs from 'dayjs';
import cx from 'classnames';
import SafeImage from 'components/Image/SafeImage';
import { formatCurrency, slugifyId } from 'helpers/string.helper';
import Link from 'next/link';
import MenuCustom from '@ui/CustomMenu';
import Button from '@ui/Buttons/Primary/Button';
import DetailModal from 'components/StoreFront/Order/Detail/OrderInfo/DetailModal/DetailModal';
import ModelTrackingEmail from 'components/StoreFront/Listings/Modal/ModalTrackingEmail';
import { StageInventory } from 'model/store/common.model';
import { GetShipmentResponse } from 'model/api/store-front/listings-online-store.model';
import { ShippingType } from 'model/common';
import { CartType } from 'constants/order';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import { useRouter } from 'next/router';
import { getShipping } from 'api/marketplace.api';
import { printLabel } from 'helpers/common.helper';
import { useUserInfo } from 'hooks/useUserInfo';
import { markListingAsShipped } from 'api/account/personal/listings.api';
import { getInventoryShipment, sendMailListingShipping } from 'api/store-front/listings.api';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import t from 'helpers/language';
import PrintLabelModal, { Item } from '../PrintLabelModal/PrintLabelModal';
import classes from './order-info.module.scss';
import RefundModal from '../RefundModal/RefundModal';
import MarkAsShippedModal from '../MarkAsShippedModal/MarkAsShippedModal';
import MarkAsPickedUpModal from '../MarkAsPickedUpModal/MarkAsPickedUpModal';
import SendTrackingEmailModal from '../SendTrackingEmailModal/SendTrackingEmailModal';

interface Props {
  order: DetailOrderModel;
}

const OrderInfo: FC<Props> = ({ order }) => {
  const { replace, pathname, query } = useRouter();
  const [offerModalVisible, setOfferModalVisible] = useState<boolean>(true);
  const [data, setData] = useState<Item[]>([]);
  const [printLabelModalVisible, setPrintLabelVisible] = useState<boolean>(false);
  const [refundModalVisible, setRefundVisible] = useState<boolean>(false);
  const [markAsShippedVisible, setMarkAsShippedVisible] = useState<boolean>(false);
  const [markAsPickedUpVisible, setMarkAsPickedUpVisible] = useState<boolean>(false);
  const [sendMailTrackingVisible, setSendMailTrackingVisible] = useState<boolean>(false);
  const [marketListingId, setMarketListingId] = useState<number>();
  const [modalSendMail, showModalSendMail] = useState<boolean>(false);
  const [selectedBicycle, setSelectedBicycle] = useState<LineItemModel>(null);
  const isBBBStaff = useUserIsBBB();
  const handleViewOffer = useCallback((item) => {
    setOfferModalVisible(true);
    setSelectedBicycle(item);
  }, []);
  const buyerInfo = useUserInfo(order.user);

  const handlePrintLabel = useCallback(
    async (item) => {
      const isNewData = isNewDataPrintLabel(order.date_finish);
      if (isNewData && !isBBBStaff) {
        return replace(
          {
            pathname: `/marketplace/buy-now/[id]/print-label`,
          },
          {
            pathname: `/marketplace/buy-now/${item.master_listing_id}/print-label`,
          },
        );
      }
      const newWindow: any = window.open('', '_blank', 'width=1000,height=600');
      try {
        const response = await getShipping(item.market_listings[0].market_listing_id);
        if (Array.isArray(response)) {
          printLabel(
            newWindow,
            response.map((i) => i.fullLinkLabel),
          );
        } else {
          printLabel(newWindow, response.fullLinkLabel);
        }
      } catch (e) {
        setTimeout(() => newWindow && newWindow.close(), 500);
      }
    },
    [isBBBStaff, order.date_finish, replace],
  );

  const handleMarkAsShipped = useCallback(
    (id: number) => {
      markListingAsShipped(String(id))
        .then(() => {
          replace({
            pathname: `/store-front/order-history/${query.id}`,
          });
          toastSuccess(t('myAccount.myListing.markAsShipped'));
        })
        .catch(toastError);
    },
    [pathname, query, replace],
  );

  const handleMarkAsPickedUp = useCallback(
    (id: number) => {
      markListingAsShipped(String(id))
        .then(() => {
          replace({
            pathname: `/store-front/order-history/${query.id}`,
          });
          toastSuccess(t('myAccount.myListing.markAsPickedUp'));
        })
        .catch(toastError);
    },
    [pathname, query, replace],
  );

  const handleSendMail = useCallback((id: number, shipment: GetShipmentResponse) => {
    sendMailListingShipping({
      marketListingId: id,
      carrierType: shipment?.carrierType,
      trackingNumber: shipment?.trackingNumber,
    })
      .then((res) => {
        toastSuccess(t('storeFront.myListing.sendTrackingEmail'), t('seoTitle.success'));
      })
      .catch(toastError);
  }, []);

  const handleCheckShipment = useCallback(
    (item: LineItemModel) => {
      setMarketListingId(item.market_listing_ids[0]);
      getInventoryShipment(String(item.inventory_ids[0]))
        .then((res: GetShipmentResponse) => {
          if (res?.carrierType && res?.trackingNumber) {
            handleSendMail(item.market_listing_ids[0], res);
          } else if (res?.shipmentType === 'OUTBOUND') {
            showModalSendMail(true);
          } else {
            toastError('Tracking Number and Carrier Type must be not empty.');
          }
        })
        .catch((error) => {
          if (error?.response?.status === 404) {
            showModalSendMail(true);
          } else {
            toastError(error);
          }
        });
    },
    [handleSendMail],
  );

  const isAllowRefund = useCallback(
    (item: LineItemModel) => {
      const isAllowReturn = item?.is_allow_return;
      const isReturnNotExpire = isNotDateExpired(order?.date_finish, item?.return_within_days);
      const sellerBBBStaff: boolean = item?.seller_is_bbb;
      return (
        ((isAllowReturn && isReturnNotExpire) || sellerBBBStaff) && item?.market_listings && item?.market_listings[0]
      );
    },
    [order],
  );

  const checkItemActionsRender = useCallback(
    (item: LineItemModel) => {
      const allowPrintLabel =
        !isBBBStaff && item.shipping_type === ShippingType.BICYCLE_BLUE_BOOK_TYPE && toLower(item?.status) !== 'refund';

      const allowMarkAsShipped =
        isBBBStaff &&
        !item.local_pickup &&
        (toLower(item.status) === toLower(StageInventory.Sold) ||
          toLower(item.status) === toLower(StageInventory.Processing));

      const allowMarkAsPickedUp =
        item.allow_local_pickup && item.local_pickup && toLower(item.status) === StageInventory.AwaitingPickup;

      const allowSendMail =
        isBBBStaff &&
        (toLower(item.status) === toLower(StageInventory.AwaitingPickup) ||
          toLower(item.status) === toLower(StageInventory.Sold) ||
          toLower(item.status) === toLower(StageInventory.Processing));

      const allowShipItem =
        toLower(item.shipping_type) === toLower(StageInventory.FlatRateType) &&
        toLower(item.status) !== toLower(StageInventory.ShippedToCustomer) &&
        toLower(item.status) !== toLower(StageInventory.PickedUp) &&
        toLower(item.status) !== 'refunded' &&
        toLower(item.status) !== 'refund' &&
        !isBBBStaff;

      return (
        !!item.master_listing_id ||
        item.cart_type === CartType.OFFER ||
        allowPrintLabel ||
        (isAllowRefund(item) &&
          (item?.is_buyer_return || toLower(item?.status) === 'refund' || toLower(item?.status) === 'refunded')) ||
        (isAllowRefund(item) &&
          order?.status !== 'refunded' &&
          !item?.is_buyer_return &&
          toLower(item?.status) !== 'refund' &&
          toLower(item?.status) !== 'refunded') ||
        allowMarkAsShipped ||
        allowMarkAsPickedUp ||
        allowSendMail ||
        allowShipItem
      );
    },
    [isAllowRefund, isBBBStaff, order],
  );

  const renderListMenuItem = useCallback(
    (item: LineItemModel) => {
      const linkRefund =
        item?.is_buyer_return || toLower(item?.status) === 'refund' || toLower(item?.status) === 'refunded'
          ? `/store-front/return-detail/order-history/${item?.master_listing_id}/${query?.id}?inventory=${item?.market_listings[0]?.inventory_id}&marketListing=${item?.market_listings[0]?.market_listing_id}`
          : `/store-front/refund/order-history/${item?.master_listing_id}/${query?.id}?inventory=${item?.market_listings[0]?.inventory_id}&marketListing=${item?.market_listings[0]?.market_listing_id}`;

      const allowPrintLabel =
        !isBBBStaff && item.shipping_type === ShippingType.BICYCLE_BLUE_BOOK_TYPE && toLower(item?.status) !== 'refund';

      const allowMarkAsShipped =
        isBBBStaff &&
        !item.local_pickup &&
        (toLower(item.status) === toLower(StageInventory.Sold) ||
          toLower(item.status) === toLower(StageInventory.Processing));

      const allowMarkAsPickedUp =
        item.allow_local_pickup &&
        item.local_pickup &&
        (toLower(item.status) === toLower(StageInventory.AwaitingPickup) ||
          toLower(item.status) === toLower(StageInventory.Sold) ||
          toLower(item.status) === toLower(StageInventory.Processing));

      const allowSendMail = isBBBStaff && toLower(item.status) === toLower(StageInventory.AwaitingPickup);

      const allowShipItem =
        toLower(item.shipping_type) === toLower(StageInventory.FlatRateType) &&
        toLower(item.status) !== toLower(StageInventory.ShippedToCustomer) &&
        toLower(item.status) !== toLower(StageInventory.PickedUp) &&
        toLower(item.status) !== 'refunded' &&
        toLower(item.status) !== 'refund' &&
        !isBBBStaff;

      return (
        <>
          {!isBBBStaff && !!item.master_listing_id && (
            <li>
              <Link
                href={`/store-front/mylistings/sell-similar/[id]/create`}
                as={`/store-front/mylistings/sell-similar/${item.master_listing_id}/create`}>
                <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn}>
                  <span>Sell Similar</span>
                </Button>
              </Link>
            </li>
          )}
          {item.cart_type === CartType.OFFER && (
            <li>
              <Button
                buttonSize="s"
                buttonType="clear"
                className={classes.resizeBtn}
                onClick={() => handleViewOffer(item)}>
                <span>View Offer</span>
              </Button>
            </li>
          )}
          {allowPrintLabel && (
            <li>
              <Button
                buttonSize="s"
                buttonType="clear"
                className={classes.resizeBtn}
                onClick={() => {
                  if (item.quantity < 2) {
                    handlePrintLabel(item);
                  } else {
                    setData(
                      item.market_listings.map((i, index) => ({
                        ...i,
                        name: item.bicycle_name,
                        frame_size: item.frame_sizes[index].frame_size || item.frame_sizes[0]?.frame_size,
                        master_listing_id: item.master_listing_id,
                        order_id: order._id,
                      })),
                    );
                    setPrintLabelVisible(true);
                  }
                }}>
                <span> Print Label</span>
              </Button>
            </li>
          )}
          {isAllowRefund(item) &&
            (item?.is_buyer_return || toLower(item?.status) === 'refund' || toLower(item?.status) === 'refunded') && (
              <li>
                {item.quantity < 2 ? (
                  <Link href={linkRefund}>
                    <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn}>
                      <span style={{ textAlign: 'left' }}>View Return / Refund Detail</span>
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
                          frame_size: item.frame_sizes[index]?.frame_size || item.frame_sizes[0]?.frame_size,
                          master_listing_id: item.master_listing_id,
                          order_id: order._id,
                        })),
                      );
                      setRefundVisible(true);
                    }}>
                    <span style={{ textAlign: 'left' }}>View Return / Refund Detail</span>
                  </Button>
                )}
              </li>
            )}
          {isAllowRefund(item) &&
            order?.status !== 'refunded' &&
            !item?.is_buyer_return &&
            toLower(item?.status) !== 'refund' &&
            toLower(item?.status) !== 'refunded' && (
              <li>
                {item.quantity < 2 ? (
                  <Link href={linkRefund}>
                    <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn}>
                      <span style={{ textAlign: 'left' }}>Refund this item</span>
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
                          frame_size: item.frame_sizes[index]?.frame_size || item.frame_sizes[0]?.frame_size,
                          master_listing_id: item.master_listing_id,
                          order_id: order._id,
                        })),
                      );
                      setRefundVisible(true);
                    }}>
                    <span style={{ textAlign: 'left' }}>Refund this item</span>
                  </Button>
                )}
              </li>
            )}
          {allowMarkAsShipped && (
            <li>
              <Button
                buttonSize="s"
                buttonType="clear"
                className={classes.resizeBtn}
                onClick={() => {
                  if (item.quantity < 2) {
                    handleMarkAsShipped(item.market_listing_ids[0]);
                  } else {
                    setData(
                      item.market_listings.map((i, index) => ({
                        ...i,
                        name: item.bicycle_name,
                        frame_size: item.frame_sizes[index]?.frame_size || item.frame_sizes[0]?.frame_size,
                        master_listing_id: item.master_listing_id,
                        order_id: order._id,
                      })),
                    );
                    setMarkAsShippedVisible(true);
                  }
                }}>
                <span style={{ textAlign: 'left' }}>Mark as Shipped</span>
              </Button>
            </li>
          )}
          {allowMarkAsPickedUp && (
            <li>
              <Button
                buttonSize="s"
                buttonType="clear"
                className={classes.resizeBtn}
                onClick={() => {
                  if (item.quantity < 2) {
                    handleMarkAsPickedUp(item.market_listing_ids[0]);
                  } else {
                    setData(
                      item.market_listings.map((i, index) => ({
                        ...i,
                        name: item.bicycle_name,
                        frame_size: item.frame_sizes[index].frame_size || item.frame_sizes[0]?.frame_size,
                        master_listing_id: item.master_listing_id,
                        order_id: order._id,
                      })),
                    );
                    setMarkAsPickedUpVisible(true);
                  }
                }}>
                <span style={{ textAlign: 'left' }}>Mark as Picked up</span>
              </Button>
            </li>
          )}
          {allowSendMail && (
            <li>
              <Button
                buttonSize="s"
                buttonType="clear"
                className={classes.resizeBtn}
                onClick={() => {
                  if (item.quantity < 2) {
                    handleCheckShipment(item);
                  } else {
                    setData(
                      item.market_listings.map((i, index) => ({
                        ...i,
                        name: item.bicycle_name,
                        frame_size: item.frame_sizes[index].frame_size || item.frame_sizes[0]?.frame_size,
                        master_listing_id: item.master_listing_id,
                        order_id: order._id,
                      })),
                    );
                    setSendMailTrackingVisible(true);
                  }
                }}>
                <span style={{ textAlign: 'left' }}>Send tracking email</span>
              </Button>
            </li>
          )}
          {allowShipItem && (
            <li>
              <Link
                href={`/marketplace/buy-now/[id]`}
                as={`/marketplace/buy-now/${slugifyId(item.title, item.master_listing_id)}`}>
                <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn}>
                  <span style={{ textAlign: 'left' }}>Ship Item</span>
                </Button>
              </Link>
            </li>
          )}
        </>
      );
    },
    [
      handlePrintLabel,
      handleViewOffer,
      handleMarkAsShipped,
      handleMarkAsPickedUp,
      handleCheckShipment,
      isAllowRefund,
      isBBBStaff,
      order,
      query,
    ],
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

  const checkActionsRender = useCallback(() => {
    const allowCancelOrder = order?.status === 'completed';
    return isAllowRefundOrder || allowCancelOrder;
  }, [order, isAllowRefundOrder]);

  const renderListMenu = useCallback(() => {
    const linkCancelOrder = `/store-front/order-history/${order._id}/cancel`;
    return (
      <>
        {isAllowRefundOrder && (
          <li>
            <Link href={'/store-front/order-history/[id]/refund'} as={`/store-front/order-history/${order._id}/refund`}>
              <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn}>
                Refund this order
              </Button>
            </Link>
          </li>
        )}
        {order?.status === 'completed' && (
          <li>
            <Link href={linkCancelOrder}>
              <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn}>
                <span style={{ color: '#ee5c5e' }}>Cancel Order</span>
              </Button>
            </Link>
          </li>
        )}
      </>
    );
  }, [order, isAllowRefundOrder]);

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
            {buyerInfo?.displayName || order?.shipping_address?.recipient_name || order?.customer_name}
          </Col>
        </Row>
      );
    }
    return null;
  }, [order, buyerInfo]);

  const checkStatus = useCallback((status: string) => {
    const s = toLower(status);
    if (s !== 'listed' && s !== 'de_listed') {
      return true;
    }
    return false;
  }, []);

  return (
    <div>
      <Card className={cx('mt-4', classes.card)}>
        <Row>
          <Col xs={12} md={6}>
            <h3 className="mb-0">Order #{order.order_code}</h3>
            <p className={cx(classes.text, 'mt-2')}>{dayjs(order.date_created).format('DD MMMM YYYY')}</p>
          </Col>
          <Col xs={12} md={6} className="d-flex flex-row text-left text-md-right">
            <div className="d-flex flex-md-column text-md-right">
              <span className={classes.text}>Status</span>
              <span className={cx('text-capitalize ml-2 ml-md-0 mt-md-2 mt-0', classes.status)}>
                {startCase(camelCase(order.status))}
              </span>
            </div>
            {/* {checkActionsRender() && <MenuCustom classMenuContent={classes.customMenu} listMenu={renderListMenu()} />} */}
          </Col>
        </Row>
        {renderInfoCancelled}
      </Card>

      {order.line_item.map((item) => (
        <Card key={item.bicycle_id} className={cx(classes.productCard, 'mt-4')}>
          <Row className={'w-100 m-0'}>
            <Col xs={12} md={5} lg={4} className={cx('text-center p-0', classes.imageContainer)}>
              <SafeImage src={item.image_default} className={cx('img-fluid', classes.image)} />
            </Col>
            <Col xs={12} md={7} lg={8}>
              <Row className={classes.detail}>
                <Col xs={11} className={'p-0'}>
                  <Link
                    href={'/marketplace/buy-now/[id]'}
                    as={`/marketplace/buy-now/${slugifyId(item.bicycle_name, item.master_listing_id)}`}>
                    <a>
                      <h4 className={classes.bicycleName}>{item.bicycle_name || item.title || '-'}</h4>
                    </a>
                  </Link>
                  <div className={'d-flex mt-3'}>
                    <p>
                      <span className={classes.fontWeight500}>Qty</span>
                      <span className={cx('ml-2', classes.quantity)}>{item.quantity}</span>
                    </p>
                    <p className="ml-4">
                      <span className={classes.fontWeight500}>Frame Size </span>
                      <span className={cx('ml-2', classes.frameSize)}>
                        {item.frame_size !== 'no_provider' ? `${item.frame_size}` : ''}
                      </span>
                    </p>
                    {/* {checkStatus(item.status) && (
                      <p className="ml-4">
                        <span className={cx('ml-2', classes.statusItem)}>{startCase(camelCase(item.status))}</span>
                      </p>
                    )} */}
                  </div>
                  <div className="d-flex mt-3 flex-wrap">
                    <p className={classes.price}>{formatCurrency(Number(item.fix_subtotal))}</p>
                    {/* {item.local_pickup ? (
                      <p className={cx(classes.returnText, 'text-warning ml-4')}>Local pickup</p>
                    ) : (
                      <p className={cx(classes.returnText, 'ml-4')}>
                        {formatCurrency(Number(item.fix_shipping), false)}
                      </p>
                    )} */}
                    {checkStatus(item.status) && (
                      <p className="ml-4">
                        <span className={cx('ml-2', classes.statusItem)}>{startCase(camelCase(item.status))}</span>
                      </p>
                    )}
                  </div>
                  <div className={'d-flex mt-3'} style={{ justifyContent: 'space-between' }}>
                    <div>
                      <span className={classes.serial}>ID {item.master_listing_id}</span>
                      <span className={cx('ml-2', classes.serial)}>{item.name}</span>
                    </div>
                    <div style={{ textAlign: 'right', marginRight: -30 }}>
                      {isAllowRefund(item) && item.is_buyer_return && item?.status !== 'REFUNDED' && (
                        <p className={cx(classes.returnText, 'text-danger ml-4')}>Return Requested</p>
                      )}
                    </div>
                  </div>
                </Col>
                <Col xs={1} className={'p-0'}>
                  {checkItemActionsRender(item) && (
                    <MenuCustom classMenuContent={classes.customMenu} listMenu={renderListMenuItem(item)} />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      ))}
      {selectedBicycle && (
        <DetailModal
          onClose={() => {
            setOfferModalVisible(false);
          }}
          isOpen={offerModalVisible}
          order={order}
          item={selectedBicycle}
          key={selectedBicycle._id}
        />
      )}
      <PrintLabelModal
        items={data}
        isOpen={printLabelModalVisible}
        onClose={() => {
          setData([]);
          setPrintLabelVisible(false);
        }}
      />
      <RefundModal
        items={data}
        isOpen={refundModalVisible}
        onClose={() => {
          setData([]);
          setRefundVisible(false);
        }}
      />
      <MarkAsShippedModal
        items={data}
        isOpen={markAsShippedVisible}
        onClose={() => {
          setData([]);
          setMarkAsShippedVisible(false);
        }}
      />
      <MarkAsPickedUpModal
        items={data}
        isOpen={markAsPickedUpVisible}
        onClose={() => {
          setData([]);
          setMarkAsPickedUpVisible(false);
        }}
      />
      <SendTrackingEmailModal
        items={data}
        isOpen={sendMailTrackingVisible}
        onClose={() => {
          setData([]);
          setSendMailTrackingVisible(false);
        }}
      />
      <ModelTrackingEmail
        onClose={() => showModalSendMail(false)}
        open={modalSendMail}
        marketListingId={marketListingId}
      />
    </div>
  );
};

export default OrderInfo;
