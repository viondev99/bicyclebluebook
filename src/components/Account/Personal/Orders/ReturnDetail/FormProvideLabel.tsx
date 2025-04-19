import React, { FC, useCallback, useState, useMemo } from 'react';
import { LineItemModel } from 'model/store/account/personal/orders.model';
import { Form, Formik, FormikProps } from 'formik';
import t from 'helpers/language';
import trim from 'lodash/trim';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import Divider from '@ui/Divider';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { updateShippingInformation } from 'api/account/personal/listings.api';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import FormikInput from 'components/Formik/Input/FormikInput';
import Button from '@ui/Buttons/Primary/Button';
import { CarrierOptions } from 'constants/return-refund';
import { useRouter } from 'next/router';
import classes from './return-detail.module.scss';

interface FormValues {
  note: string;
  carrier: string;
  otherCarrier: string;
  trackingNumber: string;
}

interface Props {
  item: LineItemModel;
}

const initialValues = {
  note: '',
  carrier: '',
  otherCarrier: '',
  trackingNumber: '',
};

const ReturnFormProvideLabel: FC<Props> = ({ item }) => {
  const { query } = useRouter();
  const router = useRouter();
  const [shippingLabelFile, setShippingLabel] = useState<File>(null);
  // const [errorUpload, setErrorUpload] = useState<string>(null);
  const handleFormSubmit = useCallback(
    (values: FormValues) => {
      // if (shippingLabelFile) {
      let carrier = values.carrier !== 'OTHER' ? values.carrier : values.otherCarrier;
      const { inventory, marketListing } = query;
      const orderId = query.id;
      const masterListingId = query.itemId;
      let trackingNumber: string;
      if (!carrier) {
        carrier = undefined;
      }
      if (values.trackingNumber) {
        trackingNumber = values.trackingNumber;
      }
      let file: File;
      if (shippingLabelFile) {
        file = shippingLabelFile;
      }
      updateShippingInformation({
        order_id: String(orderId),
        master_listing_id: Number(masterListingId),
        note: values.note,
        carrier,
        tracking_id: trackingNumber,
        file,
        inventory_id: Number(inventory),
        market_listing_id: Number(marketListing),
      })
        .then(() => {
          toastSuccess('Your request has been submitted');
          router.reload();
        })
        .catch((err: any) => {
          toastError(err);
        });
      // }
    },
    [query, router, shippingLabelFile],
  );

  const isSellerReturnShipping = useMemo(() => {
    return item?.return_shipping_payer === 'SELLER' || item?.seller_is_bbb;
  }, [item]);

  const validate = useCallback((form: FormValues) => {
    const errors: {
      [key: string]: string;
    } = {};
    const { note, carrier, trackingNumber, otherCarrier } = form;
    if (String(trim(note)).length > 500) {
      errors.note = t('myAccount.return.validate.maxLengthNote');
    }
    // if (!carrier) {
    //   errors.carrier = 'Please select your carrier';
    // }
    if (carrier === 'OTHER') {
      // if (!trim(otherCarrier)) {
      //   errors.otherCarrier = 'Please enter your carrier';
      // }
      if (String(trim(otherCarrier)).length > 250) {
        errors.otherCarrier = 'Max length of carrier is 250 characters';
      }
    }
    // if (!trim(trackingNumber)) {
    //   errors.trackingNumber = 'Please input your tracking number';
    // }
    if (String(trackingNumber).length > 50) {
      errors.trackingNumber = 'Max length of tracking number is 50 characters';
    }
    return errors;
  }, []);

  const onChangeFileShippingLabel = useCallback((e) => {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file) {
      if (
        !file.type.includes('image') &&
        !file.type.includes('pdf') &&
        !file.type.includes('doc') &&
        !file.type.includes('docx')
      ) {
        toastError('File only image, pdf, doc, docx');
        setShippingLabel(null);
        // setErrorUpload('Please upload your label');
      } else {
        setShippingLabel(file);
        // setErrorUpload('');
      }
    } else {
      setShippingLabel(null);
      // setErrorUpload('Please upload your label');
    }
  }, []);
  // const checkFileLabel = useCallback(() => {
  //   if (!shippingLabelFile) {
  //     setErrorUpload('Please upload your label');
  //   }
  // }, [shippingLabelFile]);

  return (
    <div className={'mt-3'}>
      <Divider className={classes.divider} />
      <Formik validate={validate} enableReinitialize={true} onSubmit={handleFormSubmit} initialValues={initialValues}>
        {({ handleSubmit, values, setFieldValue }: FormikProps<FormValues>) => (
          <Form onSubmit={handleSubmit}>
            {isSellerReturnShipping && (
              <>
                <Row>
                  <Col>
                    <h4>Carrier</h4>
                    <FormikSelect
                      inputId={'select-carrier-provide-label'}
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
                  <Col>
                    <h4>Tracking Number</h4>
                    <FormikInput name={'trackingNumber'} className={'mt-4'} />
                  </Col>
                </Row>
                <div className={classes.formShippingLabel}>
                  <label htmlFor="fileLabel" className={classes.uploadLabel}>
                    Upload label
                    <input
                      id="fileLabel"
                      accept={'image/jpg, image/png, image/jpeg, .pdf, .doc, .docx'}
                      className={classes.inputFile}
                      onChange={onChangeFileShippingLabel}
                      type="file"
                      placeholder="Upload label"
                    />
                  </label>
                  {shippingLabelFile && <p>{shippingLabelFile?.name}</p>}
                  {/* {errorUpload && <p className={classes.lineError}>{errorUpload}</p>} */}
                </div>
                <div className={'mt-4'}>
                  <h4 className={'mb-3'}>Note to Buyer</h4>
                  <FormikTextarea name={'note'} rows={6} />
                </div>
              </>
            )}
            <div className={'d-flex mt-5'}>
              <Button type={'submit'}>Send Label</Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ReturnFormProvideLabel;
