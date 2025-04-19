import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';

import images from 'assets/images';

import StoreState from 'model/store';
import t from 'helpers/language';
import { useListCommonState } from 'hooks/useListCommonState';
import { formatCurrency } from 'helpers/string.helper';
import { toastError } from 'helpers/utils.helper';
import { getMessageFromError, printLabel } from 'helpers/common.helper';
import { getShippingCost, calculateShipmentFee, printShippingLabel } from 'api/shipment.api';
import Card from '@ui/Cards';
import Button from '@ui/Buttons/Primary/Button';
import { getShippingLabel } from 'api/marketplace.api';
import FormikInput from '../../Formik/Input/FormikInput';
import FormikSelect from '../../Formik/Select/FormikSelect';
import classes from './shipping-form-section.module.scss';

const CalculateSchema = Yup.object().shape({
  length: Yup.number().required(t('common.validateRequired')).moreThan(0, t('common.moreThanZero')),
  width: Yup.number().required(t('common.validateRequired')).moreThan(0, t('common.moreThanZero')),
  height: Yup.number().required(t('common.validateRequired')).moreThan(0, t('common.moreThanZero')),
  weight: Yup.number().required(t('common.validateRequired')).moreThan(0, t('common.moreThanZero')),
  address: Yup.string().required(t('common.validateRequired')),
  city: Yup.string().required(t('common.validateRequired')),
  state: Yup.string().required(t('common.validateRequired')),
  zipCode: Yup.string().required(t('common.validateRequired')),
});

interface FormShipping {
  length: number;
  width: number;
  height: number;
  weight: number;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  address: string;
}

const ShippingFormSection: React.FC = () => {
  const { masterListingId, marketListingId, shipping, addressLine, cityName, stateCode, zipCode, sale } = useSelector(
    (state: StoreState) => state.marketplace.detail,
  );
  const router = useRouter();
  const [cost, setCost] = useState<number>(0);
  const [linkPrint, setLinkPrint] = useState<string | Array<string>>('');
  const [loading, setLoading] = useState<boolean>(false);

  const stateOptions = useListCommonState();

  const initialValues = useMemo(() => {
    return {
      length: shipping?.length || 0,
      width: shipping?.width || 0,
      height: shipping?.height || 0,
      weight: shipping?.weight || 0,
      address: addressLine || '',
      city: cityName || '',
      state: stateCode || null,
      zipCode: zipCode || '',
    };
  }, [shipping, addressLine, cityName, stateCode, zipCode]);

  useEffect(() => {
    if (marketListingId) {
      getShippingLabel(marketListingId)
        .then((response) => {
          setLinkPrint(Array.isArray(response) ? response.map((item) => item.fullLinkLabel) : response.fullLinkLabel);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [marketListingId]);

  useEffect(() => {
    if (!cost && addressLine && cityName && stateCode && zipCode) {
      setLoading(true);
      getShippingCost(String(masterListingId), {
        toCountryCode: sale?.shippingCountryCode || 'US',
        toZipCode: sale?.shippingPostalCode,
        toStateCode: sale?.shippingState || undefined,
        toCity: sale?.shippingCity,
        toLine: sale?.shippingAddressLine,
      })
        .then((response) => {
          setCost(response.totalCharge);
          setLoading(false);
        })
        .catch((error) => {
          toastError(getMessageFromError(error));
          setLoading(false);
        });
    }
  }, [cost, masterListingId, sale, addressLine, cityName, stateCode, zipCode]);

  const handlePrintLabel = useCallback(() => {
    if (linkPrint.length > 0) {
      const newWindow: any = window.open('', '_blank', 'width=1000,height=600');
      printLabel(newWindow, linkPrint);
    }
  }, [linkPrint]);

  const handleCalculateShipping = useCallback(
    (values) => {
      setLoading(true);
      calculateShipmentFee({
        fromCountryCode: 'US',
        fromZipCode: values.zipCode,
        fromStateCode: values.state,
        fromCity: values.city,
        fromLine: values.address,
        toCountryCode: sale?.shippingCountryCode || 'US',
        toZipCode: sale?.shippingPostalCode,
        toStateCode: sale?.shippingState,
        toCity: sale?.shippingCity,
        toLine: sale?.shippingAddressLine,
        width: String(values.width),
        height: String(values.height),
        length: String(values.length),
        weight: String(values.weight),
      })
        .then((response) => {
          setCost(response[0]?.totalCharge || 0);
          setLoading(false);
        })
        .catch((error) => {
          toastError(getMessageFromError(error));
          setLoading(false);
        });
    },
    [sale],
  );

  const handleFormSubmit = useCallback(
    (values: FormShipping) => {
      setLoading(true);
      printShippingLabel(String(masterListingId), {
        country: 'US',
        zipCode: values.zipCode,
        state: values.state,
        cityName: values.city,
        addressLine: values.address,
        width: values.width,
        height: values.height,
        length: values.length,
        weight: values.weight,
      })
        .then(() => {
          setLoading(false);
          router.push(
            { pathname: `/marketplace/buy-now/[id]/payment`, query: { submitted: true } },
            { pathname: `/marketplace/buy-now/${masterListingId}/payment`, query: { submitted: true } },
          );
        })
        .catch((error) => {
          toastError(getMessageFromError(error));
          setLoading(false);
        });
    },
    [masterListingId, router],
  );

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={handleFormSubmit}
      validationSchema={CalculateSchema}>
      {({ handleSubmit, values, isValid }) => (
        <form onSubmit={handleSubmit}>
          <Card className={classes.shippingFormContainer}>
            <div className={classes.shippingFormRow}>
              <p className={classes.label}>Shipping Service</p>
              <p className={classes.value}>UPS Ground</p>
            </div>
            <h1 className={classes.shippingFormTitle}>Dimensions</h1>
            <Row>
              <Col xs={6} md={3}>
                <h4>Length</h4>
                <FormikInput
                  disabled={!!linkPrint.length}
                  type={'number'}
                  name={'length'}
                  renderSuffix={<span className={classes.suffix}>in</span>}
                />
              </Col>
              <Col xs={6} md={3}>
                <h4>Width</h4>
                <FormikInput
                  disabled={!!linkPrint.length}
                  type={'number'}
                  name={'width'}
                  renderSuffix={<span className={classes.suffix}>in</span>}
                />
              </Col>
              <Col xs={6} md={3}>
                <h4>Height</h4>
                <FormikInput
                  disabled={!!linkPrint.length}
                  type={'number'}
                  name={'height'}
                  renderSuffix={<span className={classes.suffix}>in</span>}
                />
              </Col>
              <Col xs={6} md={3}>
                <h4>Weight</h4>
                <FormikInput
                  disabled={!!linkPrint.length}
                  type={'number'}
                  name={'weight'}
                  renderSuffix={<span className={classes.suffix}>lbs</span>}
                />
              </Col>
            </Row>
            <h1 className={classes.shippingFormTitle}>Shipping to</h1>
            <div className={classes.shippingFormRow}>
              <h4 className={classes.inputLabel}>Address</h4>
              <div className={classes.input}>
                <FormikInput disabled={!!linkPrint.length} name={'address'} />
              </div>
            </div>
            <div className={classes.shippingFormRow}>
              <h4 className={classes.inputLabel}>City</h4>
              <div className={classes.input}>
                <FormikInput disabled={!!linkPrint.length} name={'city'} />
              </div>
            </div>
            <div className={classes.shippingFormRow}>
              <h4 className={classes.inputLabel}>State</h4>
              <div className={classes.input}>
                <FormikSelect
                  inputId={'state-select-section-shipping-form'}
                  disabled={!!linkPrint.length}
                  name={'state'}
                  isSearchable={true}
                  options={stateOptions}
                />
              </div>
            </div>
            <div className={classes.shippingFormRow}>
              <h4 className={classes.inputLabel}>Zip Code</h4>
              <div className={classes.input}>
                <FormikInput disabled={!!linkPrint.length} name={'zipCode'} />
              </div>
            </div>
            <div className={classes.shippingCalculate}>
              <Button
                className={classes.buttonCalculate}
                type="button"
                buttonType="transparent"
                disabled={loading || !isValid}
                onClick={() => handleCalculateShipping(values)}>
                Calculate Shipping
              </Button>
              <div className={classes.resultCalculate}>
                <p className={classes.label}>Cost</p>
                <p className={classes.value}>{formatCurrency(cost, false)}</p>
              </div>
            </div>
          </Card>
          <div className={classes.buttonGroup}>
            {!linkPrint.length ? (
              <Button type="submit" disabled={loading || !isValid} buttonSize={'l'}>
                Payment
                <img style={{ marginLeft: 15 }} src={images.tradeIn.icRightArrowWhite} alt="arrow-right" />
              </Button>
            ) : (
              <Button type="button" buttonSize={'l'} onClick={handlePrintLabel}>
                Print
              </Button>
            )}
          </div>
        </form>
      )}
    </Formik>
  );
};

export default ShippingFormSection;
