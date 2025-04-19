import React, { FC, useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ModalComponent from '@ui/Modal';
import Button from '@ui/Buttons/Primary/Button';
import { toastError } from 'helpers/utils.helper';
import Textarea from '@ui/Textarea';
import { getStoreInfo, getUserInfo } from 'api/common.api';
import images from 'assets/images';
import { contactSeller } from 'store/account/personal/offers/offers.action';
import { CANCEL_KEY } from 'helpers/request/request';

import classes from './modal.module.scss';

interface Props {
  openModal: boolean;
  handleCloseModal: () => void;
  sellerId?: string;
  buyerId?: string;
  storefrontId?: string;
  masterListingId?: number;
  bikeName?: string;
  inventories?: Array<string>;
}
const ModalContactSeller: FC<Props> = ({
  openModal = false,
  handleCloseModal,
  sellerId,
  buyerId,
  storefrontId,
  masterListingId,
  bikeName,
  inventories,
}) => {
  const [message, setReason] = useState<string>(null);
  const [sellerInfo, setInfoSeller] = useState<{ avatar?: string; name?: string }>({});
  const dispatch = useDispatch();
  const sendMessage = useCallback(() => {
    let types = 'personal';
    let members = [buyerId, sellerId];
    if (masterListingId) {
      types = 'master_listing';
      if (storefrontId) {
        types = 'master_listing_storefront';
        members = [buyerId, storefrontId];
      }
    } else if (storefrontId) {
      types = 'storefront';
      members = [buyerId, storefrontId];
    }
    let payload: {
      members: Array<string>;
      message: string;
      type: string;
      typeUpdate: string;
      master_listing?: string;
      bikeName?: string;
      inv_names?: Array<string>;
      storefront?: Array<string>;
      receiver_user_id?: string;
      receiver_store_id?: string;
    } = storefrontId
      ? {
          members,
          message,
          type: types,
          typeUpdate: 'contact',
          receiver_store_id: storefrontId,
        }
      : {
          members,
          message,
          type: types,
          typeUpdate: 'contact',
          receiver_user_id: sellerId,
        };
    if (masterListingId) {
      payload = { ...payload, master_listing: masterListingId, bike_name: bikeName, inv_names: inventories } as any;
    }
    if (storefrontId) {
      payload = { ...payload, storefront: [storefrontId] };
    }
    dispatch(contactSeller(payload));
    handleCloseModal();
  }, [buyerId, dispatch, handleCloseModal, message, sellerId, storefrontId, bikeName, inventories, masterListingId]);
  useEffect(() => {
    if (sellerId && !storefrontId && openModal === true) {
      const request = getUserInfo(sellerId);
      request
        .then((res) => {
          setInfoSeller({ avatar: res?.account?.avatar, name: res?.display_name });
        })
        .catch(toastError);
      return () => request[CANCEL_KEY]();
    }
    if (storefrontId && openModal === true) {
      const request = getStoreInfo(storefrontId);
      request
        .then((res) => {
          setInfoSeller({ avatar: res?.logo, name: res?.name });
        })
        .catch(toastError);
      return () => request[CANCEL_KEY]();
    }
  }, [openModal, sellerId, storefrontId]);
  return (
    <ModalComponent
      isOpen={openModal}
      onClose={() => handleCloseModal()}
      contentClassName={classes.resizeModal}
      title="Contact Seller">
      <div className={classes.contentModal}>
        <div>
          <img src={sellerInfo?.avatar || images.iconProfile} alt="avatar" className={classes.avatar} />{' '}
          {sellerInfo?.name}
        </div>
        <div>
          <Textarea
            className={classes.messageForm}
            rows={4}
            onChange={(e) => {
              setReason(e.target.value);
            }}
          />
        </div>
        <Button buttonSize="s" buttonType="primary" onClick={() => sendMessage()} className={classes.btnYes}>
          Send Message
        </Button>
      </div>
    </ModalComponent>
  );
};

export default ModalContactSeller;
