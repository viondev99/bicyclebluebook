import React, { FC, useCallback, useMemo } from 'react';
import { LineItemModel } from 'model/store/account/personal/orders.model';
import { formatCurrency } from 'helpers/string.helper';
import { Form, Formik, FormikProps } from 'formik';
import t from 'helpers/language';
import omit from 'lodash/omit';
import trim from 'lodash/trim';
import FormikRadio from 'components/Formik/Radio/FormikRadio';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import Divider from '@ui/Divider';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { RefundRequest } from 'model/api/account/personal/orders.model';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import FormikInput from 'components/Formik/Input/FormikInput';
import Button from '@ui/Buttons/Primary/Button';
import { CarrierOptions } from 'constants/return-refund';
import { useDispatch, useSelector } from 'react-redux';
import { refundOrder } from 'store/account/personal/orders/orders.action';
import { useRouter } from 'next/router';
import { RefundGA, triggerGA4ECommerceEvent } from 'helpers/ga4.helper';
import StoreState from 'model/store';
import classes from './return-form.module.scss';

interface FormValues {
  reason: string;
  otherReason: string;
  note: string;
  carrier: string;
  otherCarrier: string;
  trackingNumber: string;
}

interface Props {
  item: LineItemModel;
}

const LIST_REASON = [`Doesn't fit`, 'Changed my mind', 'Found a better price', `Just didn't like it`];

const initialValues = {
  reason: "Doesn't fit",
  otherReason: '',
  note: '',
  carrier: '',
  otherCarrier: '',
  trackingNumber: '',
};

const ReturnForm: FC<Props> = ({ item }) => {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const order = useSelector((store: StoreState) => store.account.personal.orders.detail.order);

  const handleFormSubmit = useCallback(
    (values: FormValues) => {
      let bodyParams: RefundRequest = {
        ...values,
        order_id: String(query.id),
        master_listing_id: Number(query.itemId),
        market_listing_id: Number(query.marketListing),
        inventory_id: Number(query.inventory),
        tracking_id: values.trackingNumber,
      };
      if (item?.return_shipping_payer === 'SELLER') {
        bodyParams = omit(bodyParams, ['tracking_id', 'carrier']);
      }
      if (values.carrier === 'OTHER') {
        bodyParams.carrier = values.otherCarrier;
        bodyParams = omit(bodyParams, ['otherCarrier']);
      }
      if (values.reason === 'other') {
        bodyParams.reason = values.otherReason;
        bodyParams = omit(bodyParams, ['otherReason']);
      }
      dispatch(refundOrder(bodyParams));

      order &&
        item &&
        triggerGA4ECommerceEvent('refund', {
          currency: order.amount?.currency,
          value: order.amount?.total,
          transaction_id: String(order.order_code),
          coupon: order.coupon?.code,
          shipping: order?.amount?.details?.shipping,
          tax: order?.amount?.details?.tax,
          items: [
            {
              item_id: String(item.master_listing_id),
              item_name: item.title,
              affiliation: '',
              coupon: order.coupon?.code,
              discount: item.current_listed_price - item.discounted_price,
              index: 0,
              item_brand: item.bicycle_brand_name,
              item_category: item.bicycle_type_name,
              item_category2: '',
              item_category3: '',
              item_category4: '',
              item_category5: '',
              item_list_id: '',
              item_list_name: '',
              item_variant: `${item.bicycle_model_name} ${item.bicycle_size_name}`,
              location_id: String(item.location),
              price: item.current_listed_price,
              quantity: item.quantity,
            },
          ],
        } as RefundGA);
    },
    [dispatch, item, order, query.id, query.inventory, query.itemId, query.marketListing],
  );

  const isSellerReturnShipping = useMemo(() => {
    return item?.return_shipping_payer === 'SELLER' || item?.seller_is_bbb;
  }, [item]);

  const validate = useCallback(
    (form: FormValues) => {
      const errors: {
        [key: string]: string;
      } = {};
      const { reason, note, carrier, trackingNumber, otherReason, otherCarrier } = form;
      if (!reason) errors.reason = t('myAccount.return.validate.reasonRequired');
      if (reason === 'other') {
        if (!trim(otherReason)) errors.otherReason = t('myAccount.return.validate.otherReasonRequired');
        if (String(trim(otherReason)).length > 500)
          errors.otherReason = t('myAccount.return.validate.maxLengthOtherReason');
      }
      if (String(trim(note)).length > 500) errors.note = t('myAccount.return.validate.maxLengthNote');
      if (!isSellerReturnShipping) {
        // if (!carrier) errors.carrier = t('myAccount.return.validate.carrierRequired');
        if (carrier === 'OTHER') {
          // if (!trim(otherCarrier)) errors.otherCarrier = t('myAccount.return.validate.otherCarrierRequired');
          if (String(trim(otherCarrier)).length > 250)
            errors.otherCarrier = t('myAccount.return.validate.maxLengthOtherCarrier');
        }
        // if (!trim(trackingNumber)) errors.trackingNumber = t('myAccount.return.validate.trackingNumberRequired');
        if (String(trim(trackingNumber)).length > 50)
          errors.trackingNumber = t('myAccount.return.validate.maxLengthTrackingNumber');
      }

      return errors;
    },
    [isSellerReturnShipping],
  );

  return (
    <div className={'mt-3'}>
      <div>
        <h4>{item?.bicycle_name || ''}</h4>
        <span className={classes.price}>{formatCurrency(item?.subtotal)}</span>
      </div>
      <div className={'mt-4'}>
        <h3>Reason for Refund</h3>

        <Formik validate={validate} enableReinitialize={true} onSubmit={handleFormSubmit} initialValues={initialValues}>
          {({ handleSubmit, values, setFieldValue }: FormikProps<FormValues>) => (
            <Form onSubmit={handleSubmit}>
              {LIST_REASON.map((reason) => (
                <div key={reason} className={'mt-4'}>
                  <FormikRadio
                    name={'reason'}
                    value={reason}
                    label={<span className={classes.reason}>{reason}</span>}
                  />
                </div>
              ))}
              <div className={'mt-4'}>
                <FormikRadio name={'reason'} value={`other`} label={<span className={classes.reason}>Other</span>} />
              </div>
              {values.reason === 'other' && (
                <div className={'mt-4'}>
                  <FormikTextarea name={'otherReason'} rows={6} />
                </div>
              )}
              <div className={'mt-4'}>
                <h3 className={'mb-3'}>Note to Seller</h3>
                <FormikTextarea name={'note'} rows={6} />
              </div>

              {!isSellerReturnShipping && (
                <>
                  <Divider className={classes.divider} />

                  <div>
                    <h3>Provide Shipping Label</h3>
                    <p className={classes.paragraph}>
                      Seller has set a shipping fee for the buyer if you return this item.
                    </p>
                  </div>

                  <Row className={classes.formCarrier}>
                    <Col>
                      <h4>Carrier</h4>
                      <FormikSelect
                        inputId={'select-carrier-return-form'}
                        name={'carrier'}
                        options={CarrierOptions}
                        className={'mt-4'}
                      />
                      {values.carrier === 'OTHER' && (
                        <div className={'mt-4'}>
                          <FormikInput name={'otherCarrier'} className={'mt-4'} />
                        </div>
                      )}
                    </Col>
                    <Col className={classes.trackingForm}>
                      <h4>Tracking Number</h4>
                      <FormikInput name={'trackingNumber'} className={'mt-4'} />
                    </Col>
                  </Row>
                </>
              )}

              <div className={'d-flex mt-5'}>
                <Button type={'submit'} className={'ml-auto'}>
                  Submit Return
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ReturnForm;
