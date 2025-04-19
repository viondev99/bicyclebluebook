import React, { FC, useMemo, useState, useCallback, ReactElement, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { slugifyId, formatCurrency } from 'helpers/string.helper';
import { ReturnDetailModel, OrderDetailModel } from 'model/store/account/personal/orders.model';
import { formatDateNoTime, isNotDateExpired } from 'helpers/date.helper';
import { useSelector } from 'react-redux';
import { ListingReturnStatus } from 'constants/listing';
// import images from 'assets/images';
// import Button from '@ui/Buttons/Primary/Button';
import SafeImage from 'components/Image/SafeImage';
import { useRouter } from 'next/router';
import StoreState from 'model/store/index';
import Divider from '@ui/Divider/index';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import { getInventoryAge } from 'api/store-front/listings.api';
import ReturnFormProvideLabel from './FormProvideLabel';
import classes from './return-detail.module.scss';
// import { getShipping } from 'api/marketplace.api';
// import { printLabel } from 'helpers/common.helper';

interface Props {
  returnDetail: ReturnDetailModel;
  orderDetail: OrderDetailModel;
}

const ReturnInfo: FC<Props> = ({ returnDetail, orderDetail }) => {
  const { query } = useRouter();
  const [contactModalVisible, setContactModalVisible] = useState<boolean>(false);
  const selectedItem = useMemo(() => {
    return orderDetail?.line_item?.find((item) => item.master_listing_id === Number(query.itemId));
  }, [orderDetail, query.itemId]);
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const [age, setAge] = useState<number>(0);

  useEffect(() => {
    getInventoryAge(String(query?.inventory)).then((res) => setAge(res));
  }, [query]);

  const renderLineInfo = useCallback(
    (title: string, value: string | number, breakWhenMobile: boolean = true): ReactElement => {
      return (
        <div
          className={cx('d-flex', {
            [classes.lineInfo]: breakWhenMobile,
          })}>
          <h4 className={classes.subTitle}>{title}</h4>
          <h4 className={classes.subValue}>{value}</h4>
        </div>
      );
    },
    [],
  );

  const isSellerReturnShipping = useMemo(() => {
    return selectedItem?.return_shipping_payer === 'SELLER' || selectedItem?.seller_is_bbb;
  }, [selectedItem]);

  const isBuyerRequested = useMemo(() => {
    return !selectedItem?.buyer_id || userInfo?._id === selectedItem?.buyer_id;
  }, [selectedItem, userInfo]);

  const isSellerRequested = useMemo(() => {
    return (
      !selectedItem?.seller_id ||
      userInfo?._id === selectedItem?.seller_id ||
      userInfo?.storefront === selectedItem.storefront_id
    );
  }, [selectedItem, userInfo]);

  const renderStatusDefault = useMemo((): string => {
    if (isSellerRequested && isSellerReturnShipping) {
      return 'Provide shipping label to the buyer';
    }
    if (isBuyerRequested && isSellerReturnShipping) {
      return 'Waiting for seller to provide shipping label';
    }
    return 'Return started';
  }, [isBuyerRequested, isSellerRequested, isSellerReturnShipping]);

  const checkExpired = useMemo(() => {
    const isReturnNotExpire = isNotDateExpired(orderDetail?.date_finish, selectedItem?.return_within_days);
    return orderDetail?.is_bbb || isReturnNotExpire;
  }, [selectedItem, orderDetail]);

  const renderReturnInfo = useMemo(() => {
    switch (returnDetail?.return_status) {
      case ListingReturnStatus.SellerRefund:
        return (
          <div className="mt-3">
            {renderLineInfo('Carrier', returnDetail?.carrier, false)}
            {renderLineInfo('Tracking Number', returnDetail?.tracking_id, false)}
            {renderLineInfo('Delivery Date', formatDateNoTime(returnDetail?.date_delivered), false)}
            {renderLineInfo('Refund Date', formatDateNoTime(returnDetail?.date_created), false)}
            {renderLineInfo('Refund Amount', formatCurrency(returnDetail?.amount_refund, false), false)}
            {!isSellerRequested && renderLineInfo('Note From Seller', returnDetail?.note_to_buyer, false)}
          </div>
        );
      case ListingReturnStatus.ItemDeliver:
        return (
          <>
            <div className={'mt-4'}>
              <h4 className={'mb-3'}>Status</h4>
              {checkExpired ? (
                <h4 className={classes.statusShipping}>
                  Item has been delivered.{isBuyerRequested && ' Awaiting refund from seller.'}
                </h4>
              ) : (
                <h4 className={classes.statusExpired}>This item has timed out for return.</h4>
              )}
            </div>
            <div className={'d-flex  mb-3  flex-row flex-wrap'}>
              <div className={classes.wrapItemReturn}>
                <h4 className={classes.title}>Carrier</h4>
                <h4 className={classes.value}>{returnDetail?.carrier}</h4>
              </div>
              <div className={classes.wrapItemReturn}>
                <h4 className={classes.title}>Tracking Number</h4>
                <h4 className={classes.value}>{returnDetail?.tracking_id}</h4>
              </div>
              <div className={cx(classes.breakWhenMobile, classes.wrapItemReturn)}>
                <h4 className={classes.title}>Date Delivered</h4>
                <h4 className={classes.value}>{formatDateNoTime(returnDetail?.date_delivered)}</h4>
              </div>
            </div>
          </>
        );
      case ListingReturnStatus.ItemShipping:
        return (
          <>
            <div className={'mt-4'}>
              <h4 className={'mb-3'}>Status</h4>
              {checkExpired ? (
                <h4 className={classes.statusShipping}>
                  {isBuyerRequested && isSellerReturnShipping
                    ? 'Shipping label provided by seller. Please print and secure to box'
                    : 'Item has been shipped'}
                </h4>
              ) : (
                <h4 className={classes.statusExpired}>This item has timed out for return.</h4>
              )}
            </div>
            <div className={'d-flex  mb-3  flex-md-row'}>
              <div className={classes.wrapItemReturn}>
                <h4 className={classes.title}>Carrier</h4>
                <h4 className={classes.value}>{returnDetail?.carrier}</h4>
              </div>
              <div className={classes.wrapItemReturn}>
                <h4 className={classes.title}>Tracking Number</h4>
                <h4 className={classes.value}>{returnDetail?.tracking_id}</h4>
              </div>
            </div>
            {/* {isBuyerRequested && isSellerReturnShipping && (
              <>
                <div className={'mt-4'}>
                  <h4 className={'mb-3'}>Note From Seller</h4>
                  <h4 className={classes.note}>{returnDetail?.note_to_buyer}</h4>
                </div>
                <a download target={'_blank'} href={returnDetail?.shipping_label}>
                  <Button buttonType="primary" className={classes.btnPrint}>
                    <img src={images.account.order.icPrintWhite} alt={'Print Icon'} />
                    <span className={'ml-2'}>Print Shipping Label</span>
                  </Button>
                </a>
              </>
            )} */}
          </>
        );
      default:
        return (
          <>
            <div className={'mt-4'}>
              <h4 className={'mb-3'}>Status</h4>
              {checkExpired ? (
                <h4 className={classes.statusProgress}>{renderStatusDefault}</h4>
              ) : (
                <h4 className={classes.statusExpired}>This item has timed out for return.</h4>
              )}
            </div>
          </>
        );
    }
  }, [
    isBuyerRequested,
    isSellerRequested,
    isSellerReturnShipping,
    renderLineInfo,
    renderStatusDefault,
    returnDetail,
    checkExpired,
  ]);

  const showReturnProvideLabel = useMemo(() => {
    return (
      isSellerRequested &&
      returnDetail?.return_status !== ListingReturnStatus.SellerRefund &&
      returnDetail?.return_status !== ListingReturnStatus.ItemDeliver &&
      returnDetail?.return_status !== ListingReturnStatus.ItemShipping
    );
  }, [isSellerRequested, returnDetail]);
  return (
    <div>
      {renderReturnInfo}
      {showReturnProvideLabel && <ReturnFormProvideLabel item={selectedItem} />}
      <Divider className={classes.divider} />
      <div className={classes.infoReturnSection}>
        <div className={cx(classes.wrapInfoBike, 'd-flex justify-content-between')}>
          <div>
            <h4 className={classes.titleBicycle}>
              <Link href={`/marketplace/buy-now/${slugifyId(selectedItem?.title, selectedItem?.master_listing_id)}/`}>
                <a>{selectedItem?.title}</a>
              </Link>
            </h4>
            <h4 className={classes.value}>{formatCurrency(selectedItem?.fix_subtotal)}</h4>
          </div>
          <SafeImage src={selectedItem?.image_default} alt={'img-return'} className={classes.imgReturn} />
        </div>
      </div>
      {renderLineInfo('Age of Listing', age)}
      {renderLineInfo('Date Requested', formatDateNoTime(returnDetail?.date_created))}
      {renderLineInfo('Order Number', `#${orderDetail?.order_code}`)}
      {renderLineInfo('Date Sold', formatDateNoTime(orderDetail?.date_finish))}
      {renderLineInfo('Reason for Return', returnDetail?.reason_buyer_return || returnDetail?.reason_seller_return)}
      {renderLineInfo('Note', returnDetail?.note_to_seller)}
    </div>
  );
};

export default ReturnInfo;
