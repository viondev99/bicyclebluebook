import React, { FC, useMemo, useState } from 'react';
import Link from 'next/link';
import { ReturnDetailModel, OrderDetailModel } from 'model/store/account/personal/orders.model';
import { isNotDateExpired } from 'helpers/date.helper';
import { useSelector } from 'react-redux';
import { ListingReturnStatus } from 'constants/listing';
import Button from '@ui/Buttons/Primary/Button';
import { useRouter } from 'next/router';
import StoreState from 'model/store/index';
import ModelMarkDeliver from './ModalConfirmDeliver';
import classes from './return-detail.module.scss';

interface Props {
  returnDetail: ReturnDetailModel;
  orderDetail: OrderDetailModel;
}

const ReturnActions: FC<Props> = ({ returnDetail, orderDetail }) => {
  const { query, pathname } = useRouter();
  const [modalDeliver, openModalDeliver] = useState<boolean>(null);
  const selectedItem = useMemo(() => {
    return orderDetail?.line_item?.find((item) => item.master_listing_id === Number(query.itemId));
  }, [orderDetail, query.itemId]);
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);

  const isSeller = useMemo(() => {
    return (
      !selectedItem?.seller_id ||
      userInfo._id === selectedItem?.seller_id ||
      userInfo.storefront === selectedItem?.storefront_id
    );
  }, [selectedItem, userInfo._id, userInfo.storefront]);

  const checkExpired = useMemo(() => {
    const isReturnNotExpire = isNotDateExpired(orderDetail?.date_finish, selectedItem?.return_within_days);
    return orderDetail?.is_bbb || isReturnNotExpire;
  }, [selectedItem, orderDetail]);

  const renderAction = useMemo(() => {
    const { inventory, marketListing } = query;
    const isOrder = pathname.includes('order');
    const masterListingId = query?.itemId;
    const orderId = query?.id;
    const refundBuyerLink = userInfo?.storefront
      ? `/store-front/refund/${
          isOrder ? 'order-history' : 'mylistings'
        }/${masterListingId}/${orderId}?inventory=${inventory}&marketListing=${marketListing}`
      : `/account/refund/${
          isOrder ? 'order' : 'mylistings'
        }/${masterListingId}/${orderId}?inventory=${inventory}&marketListing=${marketListing}`;
    const refundNowLink = `${
      userInfo?.storefront ? `/store-front/refund/mylistings` : '/account/refund/mylistings'
    }/${masterListingId}/${orderId}?inventory=${inventory}&marketListing=${marketListing}`;
    switch (returnDetail?.return_status) {
      case ListingReturnStatus.SellerRefund:
        return null;
      case ListingReturnStatus.ItemDeliver:
        return (
          isSeller && (
            <div className={classes.wrapRefundBuyer}>
              <Button disabled={!checkExpired} buttonType="primary" className={classes.customBtn}>
                {checkExpired ? (
                  <Link href={refundBuyerLink}>
                    <a>Refund the Buyer</a>
                  </Link>
                ) : (
                  <a>Refund the Buyer</a>
                )}
              </Button>
            </div>
          )
        );
      case ListingReturnStatus.ItemShipping:
        return (
          isSeller && (
            <div className={classes.deliverWrap}>
              <ModelMarkDeliver onClose={() => openModalDeliver(false)} open={modalDeliver} />
              <Button disabled={!checkExpired} buttonType="primary" onClick={() => openModalDeliver(true)}>
                Delivered
              </Button>
              <div className={classes.customLinkDeliver}>
                If you prefer, you can{' '}
                <Link href={refundNowLink}>
                  <a>refund the buyer now</a>
                </Link>
              </div>
            </div>
          )
        );
      default:
        return null;
    }
  }, [isSeller, modalDeliver, pathname, query, returnDetail, userInfo, checkExpired]);
  return <div>{renderAction}</div>;
};

export default ReturnActions;
