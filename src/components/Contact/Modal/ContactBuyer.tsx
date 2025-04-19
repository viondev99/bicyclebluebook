import React, { FC, useCallback, useMemo, useState } from 'react';
import MobileFullScreenModal from '@ui/Modal/MobileFullScreenModal';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import SafeImage from 'components/Image/SafeImage';
import { Form, Formik, FormikProps } from 'formik';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import Button from '@ui/Buttons/Primary/Button';
import * as Yup from 'yup';
import t from 'helpers/language';
import { ContactParam, contactToUser } from 'api/marketplace.api';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import iconTickSuccess from 'assets/img/register/ic_tick_success.svg';
import { useUserInfo } from 'hooks/useUserInfo';
import Link from 'next/link';
import classes from './contact.module.scss';

enum TypeContact {
  Offer = 'offer',
  StoreFront = 'storefront',
  OrderStoreFront = 'order_storefront',
  Order = 'order',
  MasterListing = 'master_listing',
  MasterListingStoreFront = 'master_listing_storefront',
}

interface Props {
  buyerId: string;
  buyerDisplayName?: string;
  isOrder?: boolean;
  isOpen: boolean;
  onClose: () => void;
  masterListing?: number;
  listingTitle?: string;
  bikeName?: string;
  invNames?: Array<string>;
  image?: string;
  orderId?: string;
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

const ContactBuyerModal: FC<Props> = ({
  onClose,
  image,
  isOpen,
  orderId,
  buyerId,
  masterListing,
  listingTitle,
  bikeName,
  invNames,
  isOrder,
  buyerDisplayName,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const buyerInfo = useUserInfo(buyerId);
  const authUser = useSelector((store: StoreState) => store.authenticate.user);

  const handleFormSubmit = useCallback(
    (values: FormValues) => {
      const idUser = authUser?.storefront ? authUser?.storefront : authUser?._id;
      const storefront = authUser?.storefront ? [authUser?.storefront, buyerId] : [buyerId];
      let types: TypeContact;
      if (authUser?.storefront) {
        types = isOrder ? TypeContact.OrderStoreFront : TypeContact.MasterListingStoreFront;
      } else {
        types = isOrder ? TypeContact.Order : TypeContact.MasterListing;
      }

      const body: ContactParam = {
        members: [idUser, buyerId],
        type: types,
        title: listingTitle,
        message: values.value,
        image,
        order: orderId,
        master_listing: masterListing,
        bike_name: bikeName || listingTitle,
        inv_names: invNames,
        storefront,
        receiver_user_id: buyerId,
      };
      setLoading(true);
      contactToUser(body)
        .then(() => {
          toastSuccess(t('myAccount.message.newMessage', { params: 'buyer' }), t('seoTitle.success'));
          setIsSent(true);
          setLoading(false);
        })
        .catch((error) => {
          toastError(error);
          setLoading(false);
        });
    },
    [authUser, bikeName, buyerId, image, invNames, isOrder, listingTitle, masterListing, orderId],
  );

  const handleClose = useCallback(() => {
    onClose();
    setIsSent(false);
  }, [onClose]);

  const findDisplayName = useMemo(() => {
    if (buyerInfo?.name) {
      return buyerInfo?.name;
    }
    if (buyerInfo?.displayName) {
      return buyerInfo?.displayName;
    }
    if (buyerInfo?.userName) {
      return buyerInfo?.userName;
    }
    if (buyerDisplayName) {
      return buyerDisplayName;
    }
  }, [buyerDisplayName, buyerInfo]);

  const findAvatar = useMemo(() => {
    if (buyerInfo?.avatar) {
      return buyerInfo?.avatar;
    }
    if (buyerInfo?.gravatar) {
      return buyerInfo?.gravatar;
    }
  }, [buyerInfo]);

  return (
    <MobileFullScreenModal
      className={classes.modalContactBuyer}
      onClose={handleClose}
      isOpen={isOpen}
      title={
        isSent ? (
          <div className={'d-flex align-items-md-center'}>
            <img src={iconTickSuccess} alt="icon-success" />
            <h3 className="ml-3">Message Sent</h3>
          </div>
        ) : (
          'Contact Buyer'
        )
      }>
      {isSent ? (
        <div>
          <p className={classes.successMessage}>The buyer has received your message and will respond soon.</p>
          <Button onClick={handleClose} className={'d-block d-md-none'} buttonType="outline">
            Close
          </Button>
        </div>
      ) : (
        <>
          <div className={'d-flex align-items-center'}>
            <SafeImage src={findAvatar} alt={'Avatar'} className={classes.avatar} />

            <Link href={`/marketplace/seller/[sellerId]`} as={`/marketplace/seller/${buyerInfo?.id}`}>
              <a>
                <h4 className={classes.name}>{findDisplayName}</h4>
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
                <Button disabled={loading} type={'submit'} className={'mt-4'}>
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

export default ContactBuyerModal;
