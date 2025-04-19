import React, { FC, useCallback, useEffect, useState } from 'react';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import Button from '@ui/Buttons/Primary/Button';
import MobileFullScreenModal from '@ui/Modal/MobileFullScreenModal';
import iconProfile from 'assets/img/header/ic_profile.svg';
import classes from './contact-modal.module.scss';
import { getStoreInfo, getUserInfo } from '../../../../../api/common.api';
import { toastError, toastSuccess } from '../../../../../helpers/utils.helper';
import { ContactParam, contactToUser, ContactType } from '../../../../../api/marketplace.api';
import StoreState from '../../../../../model/store';
import t from '../../../../../helpers/language';
import FormikTextarea from '../../../../Formik/Textarea/FormikTextarea';
import { CANCEL_KEY } from '../../../../../helpers/request/request';

interface Props {
  open: boolean;
  onClose: () => void;
  userId?: string;
  storefrontId?: string;
  masterListingId?: number;
  orderId?: string;
  isSeller?: boolean;
  bikeName?: string;
  invNames?: string[];
}

interface Form {
  message: string;
}

const validationSchema = yup.object().shape({
  message: yup.string().required(t('marketplace.validate.messageRequired')),
});

const ContactModal: FC<Props> = ({
  onClose,
  bikeName,
  invNames,
  open,
  userId,
  storefrontId,
  orderId,
  masterListingId,
  isSeller,
}) => {
  const [userInfo, setInfo] = useState<{ avatar?: string; name?: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [initValue] = useState<Form>({ message: '' });
  useEffect(() => {
    if (userId && !storefrontId && open) {
      const request = getUserInfo(userId);
      request.then((res) => setInfo({ avatar: res.account.avatar, name: res.display_name })).catch(toastError);
      return () => request[CANCEL_KEY]();
    }
  }, [userId, storefrontId, open]);
  useEffect(() => {
    if (storefrontId && open) {
      const request = getStoreInfo(storefrontId);
      request.then((res) => setInfo({ avatar: res.logo, name: res.name })).catch(toastError);
      return () => request[CANCEL_KEY]();
    }
  }, [storefrontId, open]);
  const currentStoreFrontId = useSelector((state: StoreState) => state.authenticate.user?.storefront);
  const currentUserId = useSelector((state: StoreState) => state.authenticate.user?._id);
  const handleSendMessage = useCallback(
    ({ message }: Form) => {
      const storefront = [currentStoreFrontId, storefrontId].filter((a) => a);
      const hasStoreFront = storefront.length > 0;
      const partnerId = storefrontId || userId;
      const types = ((orderId ? 'order' : 'master_listing') + (hasStoreFront ? '_storefront' : '')) as ContactType;
      const body: ContactParam = storefrontId
        ? {
            members: [currentStoreFrontId || currentUserId, partnerId],
            order: orderId,
            storefront: hasStoreFront ? storefront : undefined,
            type: types,
            master_listing: masterListingId,
            message,
            bike_name: bikeName,
            inv_names: invNames,
            receiver_store_id: storefrontId,
          }
        : {
            members: [currentStoreFrontId || currentUserId, partnerId],
            order: orderId,
            storefront: hasStoreFront ? storefront : undefined,
            type: types,
            master_listing: masterListingId,
            message,
            bike_name: bikeName,
            inv_names: invNames,
            receiver_user_id: userId,
          };
      setLoading(true);
      contactToUser(body)
        .then(() => {
          toastSuccess(
            t('myAccount.message.newMessage', { params: isSeller ? 'seller' : 'buyer' }),
            t('seoTitle.success'),
          );
          setLoading(false);
          onClose();
        })
        .catch((error) => {
          toastError(error);
          setLoading(false);
        });
    },
    [
      currentStoreFrontId,
      storefrontId,
      userId,
      orderId,
      currentUserId,
      masterListingId,
      bikeName,
      invNames,
      isSeller,
      onClose,
    ],
  );
  return (
    <MobileFullScreenModal
      onClose={onClose}
      isOpen={open}
      title="Contact Seller"
      contentClassName={classes.modalContent}
      headerClassName={classes.headerModal}
      bodyClassName={classes.bodyModal}
      className={classes.containerModal}>
      {open && (
        <Formik initialValues={initValue} onSubmit={handleSendMessage} validationSchema={validationSchema}>
          {({ handleSubmit }) => (
            <>
              <div className={classes.inputContentWrapper}>
                <div className="d-flex align-items-center">
                  <img className={classes.avatar} src={userInfo.avatar || iconProfile} alt={'error'} />
                  <div className={classes.name}>{userInfo.name}</div>
                </div>
                <FormikTextarea name={'message'} rows={7} className={classes.input} />
              </div>
              <Button isLoading={loading} disabled={loading} style={{ marginTop: 30 }} onClick={handleSubmit}>
                Send Message
              </Button>
            </>
          )}
        </Formik>
      )}
    </MobileFullScreenModal>
  );
};

export default ContactModal;
