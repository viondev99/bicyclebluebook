import React, { FC, useCallback, useState } from 'react';
import MobileFullScreenModal from '@ui/Modal/MobileFullScreenModal';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import SafeImage from 'components/Image/SafeImage';
import { Form, Formik, FormikProps } from 'formik';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import Button from '@ui/Buttons/Primary/Button';
import { OrderDetailModel } from 'model/store/account/personal/orders.model';
import * as Yup from 'yup';
import t from 'helpers/language';
import { ContactParam, contactToUser } from 'api/marketplace.api';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import images from 'assets/images';
import { DetailOrderModel } from 'model/store/store-front/order.model';
import { useUserInfo } from 'hooks/useUserInfo';
import Link from 'next/link';
import classes from './contact-modal.module.scss';

interface Props {
  order: DetailOrderModel | OrderDetailModel;
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

const ContactModal: FC<Props> = ({ order, onClose, isOpen }) => {
  const [isSent, setIsSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const buyerInfo = useUserInfo(order?.user);
  const authUser = useSelector((store: StoreState) => store.authenticate.user);
  const handleFormSubmit = useCallback(
    (values: FormValues) => {
      const firstBike = order?.line_item[0];
      const body: ContactParam = {
        master_listing: order?.line_item[0]?.master_listing_id,
        message: values?.value,
        members: [authUser?.storefront, order?.user],
        order: order?._id,
        type: 'order_storefront',
        storefront: [authUser?.storefront],
        bike_name: firstBike?.title,
        inv_names: order?.line_item?.map((i) => i.name),
        receiver_user_id: order?.user,
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
    [authUser, order],
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
            <img src={images.iconTickSuccess} alt="icon-success" />
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
            <SafeImage src={buyerInfo?.avatar} alt={'Avatar'} className={classes.avatar} />

            <Link href={`/marketplace/seller/[sellerId]`} as={`/marketplace/seller/${buyerInfo?.id}`}>
              <a>
                <h4 className={classes.name}> {buyerInfo?.name}</h4>
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

export default ContactModal;
