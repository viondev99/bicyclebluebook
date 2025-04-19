import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import FormikCheckbox from 'components/Formik/CheckBox/FormikCheckbox';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import Button from '@ui/Buttons/Primary/Button';
import has from 'lodash/has';
import { FormValue } from 'components/Account/Personal/MyListing/Form/form';
import BBBShippingOption from 'components/Account/Personal/MyListing/Form/Sections/ShippingSection/ShippingOptions/BBBShippingOption';
import { FormikErrors, FormikTouched } from 'formik';
import FormikRadio from 'components/Formik/Radio/FormikRadio';
import FlatRateOption from './ShippingOptions/FlatRateOption';
import classes from './shipping-section.module.scss';
import ShippingCalculatorModal from './ShippingCalculatorModal/ShippingCalculatorModal';

interface Props {
  formValue: FormValue;
  validateField: (field: string) => void;
  errors: FormikErrors<FormValue>;
  touched?: FormikTouched<FormValue>;
  setValues: (values: {
    enableShipping?: boolean;
    shippingMethod?: string;
    length?: string;
    width?: string;
    weight?: string;
    height?: string;
    shipCost?: string;
    isFreeShip?: boolean;
    isBuyerPaysSignatureFee?: string | boolean;
  }) => void;
}

const ShippingOptions = [
  {
    label: 'Flat Rate (same cost to all buyers)',
    value: 'flatRate',
  },
  {
    label: 'Calculated (cost varies by buyer location)',
    value: 'bbbShipping',
  },
];

const ShippingSection: FC<Props> = ({ formValue, validateField, errors, touched, setValues }) => {
  const [shippingCalculatorVisible, setShippingCalculatorVisible] = useState<boolean>(false);
  const [disabledSignature, setDisabledSignature] = useState<boolean>(false);

  const renderOption = useCallback(() => {
    switch (formValue.shippingMethod) {
      case 'flatRate':
        return <FlatRateOption setValues={setValues} isFreeShip={formValue.isFreeShip} />;
      case 'bbbShipping':
        return <BBBShippingOption />;
    }
  }, [formValue.isFreeShip, formValue.shippingMethod, setValues]);
  const handleOpenShippingCalculator = useCallback(() => {
    const validateFields = ['addressLine', 'city', 'state', 'zipCode'];
    validateFields.forEach((i) => validateField(i));

    if (Object.keys(errors).filter((e) => validateFields.includes(e)).length === 0) {
      setShippingCalculatorVisible(true);
    }
  }, [errors, validateField]);

  useEffect(() => {
    if (formValue?.isFreeShip) {
      setDisabledSignature(true);
      setValues({ isBuyerPaysSignatureFee: 'false' });
    } else {
      setDisabledSignature(false);
      setValues({ isBuyerPaysSignatureFee: 'true' });
    }
  }, [formValue?.isFreeShip]);

  const onChangeEnableShipping = useCallback(
    (e) => {
      setValues({
        enableShipping: !formValue.enableShipping,
        shippingMethod: 'flatRate',
      });
    },
    [formValue.enableShipping, setValues],
  );
  const errorShipping = useMemo(() => {
    if (
      (has(touched, 'localPickupShipping') && has(errors, 'localPickupShipping')) ||
      (has(touched, 'enableShipping') && has(errors, 'enableShipping'))
    ) {
      return 'Shipping is required.';
    }
    return null;
  }, [errors, touched]);
  return (
    <div>
      <div>
        <h4 className={classes.title}>Shipping</h4>
        <FormikCheckbox
          name={'localPickupShipping'}
          label={'Allow local pickup'}
          className={cx('mt-4', classes.checkboxCustom)}
        />
        <FormikCheckbox
          name={'enableShipping'}
          onChange={onChangeEnableShipping}
          label={'Domestic Shipping'}
          className={cx('mt-3', classes.checkboxCustom)}
        />
      </div>
      {formValue.enableShipping && (
        <div className={'mt-4'}>
          <FormikSelect
            inputId={'select-shipping-method'}
            name={'shippingMethod'}
            options={ShippingOptions}
            className={classes.method}
          />

          <Button buttonType="clear" className={classes.calculateShipping} onClick={handleOpenShippingCalculator}>
            Calculate Shipping
          </Button>
        </div>
      )}
      {formValue.enableShipping && <div>{renderOption()}</div>}

      {formValue.enableShipping && (
        <div>
          <p className={classes.descriptionRadio}>
            Sellers are required to add signature confirmation for $10. This protection helps if a buyer reports an item
            not received or opens a payment dispute. This fee can be added to the cost of shipping or it can be deducted
            from the total once the item sells.
          </p>
          <div className={classes.wrapRadioShipping}>
            <FormikRadio
              name="isBuyerPaysSignatureFee"
              value={'true'}
              label={
                <span>Buyer pays signature confirmation fee. The $10 fee will be added to the total shipping cost</span>
              }
              className={classes.radio}
              disabled={disabledSignature}
            />
            <FormikRadio
              name="isBuyerPaysSignatureFee"
              value={'false'}
              label={
                <span>
                  Seller pays signature confirmation fee. The $10 fee will be added when printing your shipping label
                </span>
              }
              className={classes.radio}
            />
          </div>
        </div>
      )}
      <ShippingCalculatorModal
        formValue={formValue}
        isOpen={shippingCalculatorVisible}
        onClose={() => {
          setShippingCalculatorVisible(false);
        }}
        setValues={setValues}
      />
      <div className={classes.lineError}>{errorShipping}</div>
    </div>
  );
};

export default ShippingSection;
