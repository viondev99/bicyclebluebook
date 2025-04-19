import React, { FC, useCallback, useState } from 'react';
import MobileFullScreenModal from '@ui/Modal/MobileFullScreenModal';
import { OrderDetailModel } from 'model/store/account/personal/orders.model';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import SafeImage from 'components/Image/SafeImage';
import { Form, Formik, FormikProps } from 'formik';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import Button from '@ui/Buttons/Primary/Button';
import * as Yup from 'yup';
import t from 'helpers/language';
import { ContactParam, contactToUser } from 'api/marketplace.api';
import { toastError } from 'helpers/utils.helper';
import iconTickSuccess from 'assets/img/register/ic_tick_success.svg';
import { useUserInfo } from 'hooks/useUserInfo';
import { useStoreInfo } from 'hooks/useStoreInfo';
import isArray from 'lodash/isArray';
import { UserBasicInfoModel } from 'model/store/info.model';
import Link from 'next/link';
import classes from './contact-modal.module.scss';

interface Props {
  isSeller?: boolean;
  order: OrderDetailModel;
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  value: string;
}

const initialValues: FormValues = {
  value: '',
};

const ContactSchema = Yup.object().shape({
  value: Yup.string().required(t('marketplace.validate.messageRequired')),
});

const ContactModal: FC<Props> = ({ order, isSeller, onClose, isOpen }) => {
  const [isSent, setIsSent] = useState<boolean>(false);
  const userInfo = useUserInfo(isSeller && order.user ? [order.user] : order.seller);
  const sellerInfo = useStoreInfo(order.storefronts[0] !== 'no_provider' ? order.storefronts[0] : '');
  const getInfo = useCallback(
    (id) => {
      if (!order.storefronts[0] || order.storefronts[0] === 'no_provider' || isSeller) {
        if (isArray(userInfo)) {
          return userInfo.find((i: UserBasicInfoModel) => i.id === id);
        }
        return userInfo;
      }

      return sellerInfo;
    },
    [order.storefronts, sellerInfo, userInfo, isSeller],
  );
  const isStoreFront = order.storefronts[0] && order.storefronts[0] !== 'no_provider';
  const hrefSellerPath = isStoreFront ? '/marketplace/online-store-manager/[id]' : '/marketplace/seller/[sellerId]';
  const sellerPath = isStoreFront
    ? `/marketplace/online-store/${order.storefronts[0]}`
    : `/marketplace/seller/${order.seller[0]}`;

  const authUser = useSelector((store: StoreState) => store.authenticate.user);
  const handleFormSubmit = useCallback(
    (values: FormValues) => {
      const storeFronts = isStoreFront ? [order.storefronts[0]] : [];
      const firstBike = order.line_item[0];
      const invNames = order.line_item.map((i) => i.name);
      const body: ContactParam = isStoreFront
        ? {
            members: isSeller
              ? [authUser.storefront, getInfo(order.user).id]
              : [authUser._id, getInfo(order.seller[0]).id],
            order: order._id,
            storefront: storeFronts,
            type: 'order_storefront',
            master_listing: order.line_item[0].master_listing_id,
            message: values.value,
            inv_names: invNames,
            bike_name: firstBike?.title,
            receiver_store_id: sellerInfo?.id,
          }
        : {
            members: isSeller ? [authUser._id, getInfo(order.user).id] : [authUser._id, getInfo(order.seller[0]).id],
            order: order._id,
            type: 'order',
            master_listing: order.line_item[0].master_listing_id,
            message: values.value,
            inv_names: invNames,
            bike_name: firstBike?.title,
            receiver_user_id: order?.user,
          };
      contactToUser(body)
        .then(() => {
          setIsSent(true);
        })
        .catch(toastError);
    },
    [
      authUser,
      isSeller,
      getInfo,
      isStoreFront,
      order._id,
      order.line_item,
      order.seller,
      order.user,
      order.storefronts,
    ],
  );
  const handleClose = useCallback(() => {
    onClose();
    setIsSent(false);
  }, [onClose]);

  return (
    <MobileFullScreenModal
      className={classes.modal}
      onClose={handleClose}
      isOpen={isOpen}
      title={
        isSent ? (
          <div className={'d-flex align-items-md-center'}>
            <img src={iconTickSuccess} alt="icon-success" />
            <h3 className="ml-3">Message Sent</h3>
          </div>
        ) : (
          `Contact ${isSeller ? 'Buyer' : 'Seller'}`
        )
      }>
      {isSent ? (
        <div>
          <p className={classes.successMessage}>The seller has received your message and will respond soon.</p>
          <Button onClick={handleClose} className={'d-block d-md-none'} buttonType="outline">
            Close
          </Button>
        </div>
      ) : (
        <>
          <div className={'d-flex align-items-center'}>
            <SafeImage
              src={getInfo(isSeller && order.user ? order.user : order.seller[0])?.avatar}
              alt={'Avatar'}
              className={classes.avatar}
            />
            <Link href={hrefSellerPath} as={sellerPath}>
              <a>
                <h4 className={classes.name}>{getInfo(isSeller && order.user ? order.user : order.seller[0])?.name}</h4>
              </a>
            </Link>
          </div>

          <Formik
            enableReinitialize={true}
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={ContactSchema}>
            {({ handleSubmit }: FormikProps<FormValues>) => (
              <Form onSubmit={handleSubmit} className={'mt-4'}>
                <FormikTextarea name={'value'} rows={8} />
                <Button type={'submit'} className={'mt-4'}>
                  Send Message
                </Button>
              </Form>
            )}
          </Formik>
        </>
      )}
    </MobileFullScreenModal>
  );
};

export default ContactModal;
