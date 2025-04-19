import React, { FC, useState, useCallback, useEffect } from 'react';
import ModalComponent from '@ui/Modal';
import Button from '@ui/Buttons/Primary/Button';
import t from 'helpers/language';
import StoreState from 'model/store';
import { useSelector } from 'react-redux';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import { addToWishlist, AddWishlistQuery } from 'api/marketplace.api';
import Input from '@ui/Inputs/Input';
import classes from './wishlist-modal.module.scss';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
const AddWishListModal: FC<Props> = ({ open = false, onClose, onSuccess }) => {
  const detailBike = useSelector((state: StoreState) => state.marketplace.detail);
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const [loading, setLoading] = useState(false);
  const handleAddWishlist = useCallback(() => {
    setLoading(true);
    const bodyParams: AddWishlistQuery = {
      mail: userInfo?.email,
      type_bicycle_name: detailBike?.bicycleTypeName,
      type: detailBike?.isAuction ? 'auction' : 'master_listing',
      brand_id: detailBike?.brandId,
      model_id: detailBike?.modelId,
      year_id: detailBike?.yearId,
      size_name: detailBike?.bicycleSizeName,
      bicycle_size_name: detailBike?.bicycleSizeName,
      title: detailBike?.title,
      data_id: detailBike?.masterListingId,
      image: detailBike?.imageDefault
        ? detailBike?.imageDefault
        : 'https://d1eye5spyas0l1.cloudfront.net/_assets/no_image.jpg',
    };
    addToWishlist(bodyParams)
      .then(() => {
        setLoading(false);
        toastSuccess(t('myAccount.wishlist.added'), t('seoTitle.success'));
        onClose();
        onSuccess();
      })
      .catch((err) => {
        setLoading(false);
        toastError(err);
      });
  }, [detailBike, onClose, onSuccess, userInfo]);

  return (
    <ModalComponent isOpen={open} onClose={onClose} contentClassName={classes.resizeModal}>
      <div className={classes.contentModal}>
        <h4>Thank you for your interest in this</h4>
        <h4 className={classes.titleBike}>{detailBike?.title}</h4>
        <h4>We'll notify you as soon as this product is back in stock!</h4>
        <Input type="text" value={userInfo?.email} className={classes.mailInfo} readOnly />
        <Button
          isLoading={loading}
          className={classes.btnSubmit}
          buttonSize="s"
          buttonType="primary"
          onClick={handleAddWishlist}>
          Submit
        </Button>
      </div>
    </ModalComponent>
  );
};

export default AddWishListModal;
