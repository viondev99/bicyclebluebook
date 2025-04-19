import React, { FC, useCallback } from 'react';
import { useRouter } from 'next/router';
import Modal from '@ui/Modal/Modal';
import t from 'helpers/language';
import { toastSuccess, toastError } from 'helpers/utils.helper';
import { reListProduct } from 'api/marketplace.api';
import { ListingItemModel } from 'model/api/store-front/listings-online-store.model';
import Button from '@ui/Buttons/Primary/Button';
import classes from './modal-listing.module.scss';

interface Props {
  onClose: () => void;
  open: boolean;
  listingChecked: ListingItemModel;
}

const ModalRenewListing: FC<Props> = ({ onClose, open, listingChecked }) => {
  const { replace, pathname, query } = useRouter();
  const handleRelistItem = useCallback(() => {
    reListProduct(listingChecked?.finished?.masterListingId)
      .then(() => {
        replace({ pathname, query });
        toastSuccess(t('storeFront.myListing.re-listing'));
      })
      .catch((e) => {
        toastError(e);
      });
    onClose();
  }, [listingChecked, replace, pathname, query, onClose]);
  return (
    <Modal
      centered={true}
      onClose={onClose}
      isOpen={open}
      className={classes.deleteModal}
      contentClassName={classes.contentDeleteModal}
      title={'Confirm Re-new'}>
      <div className={classes.contentRenewModal}>
        This listing is expired <br />
        Are you sure you want to re-new this listing?
      </div>
      <div className="d-flex justify-content-end">
        <Button buttonType={'outline'} onClick={onClose}>
          No
        </Button>
        <Button className="ml-3" onClick={handleRelistItem}>
          Yes
        </Button>
      </div>
    </Modal>
  );
};

export default ModalRenewListing;
