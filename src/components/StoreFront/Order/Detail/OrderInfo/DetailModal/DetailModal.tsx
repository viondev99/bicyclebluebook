import React, { FC, useEffect } from 'react';
import MobileFullScreenModal, { Props as ModalProps } from '@ui/Modal/MobileFullScreenModal';
import { DetailOrderModel } from 'model/store/store-front/order.model';
import { LineItemModel } from 'model/store/account/personal/orders.model';
import cx from 'classnames';
import { formatCurrency, slugifyId } from 'helpers/string.helper';
import { useUserInfo } from 'hooks/useUserInfo';
import useOfferInfo from 'hooks/useOfferInfo';
import Skeleton from 'react-loading-skeleton/lib';
import dayjs from 'dayjs';
import Link from 'next/link';
import get from 'lodash/get';
import lowerCase from 'lodash/lowerCase';
import { toastError } from 'helpers/utils.helper';
import classes from './detail-modal.module.scss';

interface Props {
  order: DetailOrderModel;
  item: LineItemModel;
}

const DetailModal: FC<Pick<ModalProps, 'onClose' | 'isOpen'> & Props> = ({ order, isOpen, onClose, item }) => {
  const buyer = useUserInfo(item.buyer_id);
  const offer = useOfferInfo(String(item.offer_id));

  useEffect(() => {
    if (!offer.loading && offer.error) {
      toastError(offer.error);
      onClose();
    }
  }, [offer, onClose]);

  return (
    <MobileFullScreenModal
      onClose={onClose}
      isOpen={isOpen}
      title="Offer Details"
      className={classes.modal}
      contentClassName={classes.contentModal}>
      {offer.loading || !offer.data ? (
        <div>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      ) : (
        <table className={cx('table table-borderless p-0', classes.table)}>
          <tbody>
            <tr>
              <td className={classes.label}>Bike</td>
              <td className={classes.value}>
                <Link
                  href={`/marketplace/buy-now/[id]`}
                  as={`/marketplace/buy-now/${slugifyId(
                    get(offer, 'data.inventory.title'),
                    get(offer, 'data.masterListingId'),
                  )}`}>
                  <a className={classes.value}>{offer.data.inventory.title}</a>
                </Link>
              </td>
            </tr>
            <tr>
              <td className={classes.label}>Sale Price</td>
              <td className={classes.value}>{formatCurrency(offer.data.inventory.currentListedPrice)}</td>
            </tr>
            <tr>
              <td className={classes.label}>Buyer</td>
              <td className={cx(classes.value, classes.name)}>
                <Link href={'/marketplace/seller/[sellerId]'} as={`/marketplace/seller/${offer.data.buyerId}`}>
                  <a className={cx(classes.value)}>{buyer.name}</a>
                </Link>
              </td>
            </tr>
            <tr>
              <td className={classes.label}>Quantity</td>
              <td className={classes.value}>{offer.data.quantity}</td>
            </tr>
            <tr>
              <td className={classes.label}>Offer</td>
              <td className={classes.value}>{formatCurrency(offer.data.offerPrice)}</td>
            </tr>
            <tr>
              <td className={classes.label}>Date Offered</td>
              <td className={classes.value}>{dayjs(offer.data.createdTime).format('DD MMMM YYYY')}</td>
            </tr>
            <tr>
              <td className={classes.label}>Status</td>
              <td className={cx(classes.value, 'text-capitalize')}>{lowerCase(offer.data.status)}</td>
            </tr>
          </tbody>
        </table>
      )}
    </MobileFullScreenModal>
  );
};

export default DetailModal;
