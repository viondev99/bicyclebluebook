import React, { FC, useCallback } from 'react';
import Modal from '@ui/Modal/Modal';
import { useRouter } from 'next/router';
import { toastSuccess, toastError } from 'helpers/utils.helper';
import Button from '@ui/Buttons/Primary/Button';
import { markDeliveredItem } from 'api/account/personal/listings.api';
import classes from './return-detail.module.scss';

interface Props {
  onClose: () => void;
  open: boolean;
}

const ModelMarkDeliver: FC<Props> = ({ onClose, open }) => {
  const { query } = useRouter();
  const router = useRouter();
  const markDelivered = useCallback(() => {
    const { inventory, marketListing, id, itemId } = query;
    markDeliveredItem({
      order_id: String(id),
      master_listing_id: Number(itemId),
      inventory_id: String(inventory),
      market_listing_id: String(marketListing),
    })
      .then(() => {
        toastSuccess('Your request has been submitted');
        router.reload();
        onClose();
      })
      .catch((err) => {
        toastError(err);
      });
  }, [onClose, query, router]);
  return (
    <Modal
      centered={true}
      onClose={onClose}
      isOpen={open}
      className={classes.deliverModal}
      contentClassName={classes.contentDeliverModal}
      header={<h4 className={classes.contentModel}>Are you sure that you received the bike?</h4>}>
      <div className="d-flex justify-content-center">
        <Button buttonType={'outline'} onClick={onClose}>
          No
        </Button>
        <Button className="ml-3" onClick={markDelivered}>
          Yes
        </Button>
      </div>
    </Modal>
  );
};

export default ModelMarkDeliver;
