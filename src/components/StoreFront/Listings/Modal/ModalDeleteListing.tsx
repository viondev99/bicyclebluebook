import React, { FC, useCallback } from 'react';

import { pxToRem } from 'helpers/common.helper';
import Modal from '@ui/Modal/Modal';
import { useDispatch } from 'react-redux';
import { StageInventory } from 'model/store/common.model';
import { deleteListing } from 'store/store-front/listings/listings.action';
import { ListingItemModel } from 'model/api/store-front/listings-online-store.model';
import Button from '@ui/Buttons/Primary/Button';
import classes from './modal-listing.module.scss';

interface Props {
  onClose: () => void;
  open: boolean;
  listingChecked: ListingItemModel;
}

const ModalDeleteListing: FC<Props> = ({ onClose, open, listingChecked }) => {
  const dispatch = useDispatch();

  const handleDeleteListing = useCallback(() => {
    if (listingChecked?.statusMarketListing === StageInventory.Draft) {
      dispatch(deleteListing({ id: listingChecked.draft.draftId, isDraft: true }));
    } else {
      dispatch(deleteListing({ id: listingChecked.finished.masterListingId }));
    }

    onClose();
  }, [dispatch, listingChecked, onClose]);
  return (
    <Modal
      centered={true}
      onClose={onClose}
      isOpen={open}
      className={classes.deleteModal}
      title={<h4 style={{ fontSize: pxToRem(28), lineHeight: 1.4 }}>Are you sure you want to remove this Listing?</h4>}>
      <div className="d-flex">
        <Button buttonType={'danger'} onClick={handleDeleteListing}>
          Remove
        </Button>
        <Button buttonType={'outline'} className="ml-3" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default ModalDeleteListing;
