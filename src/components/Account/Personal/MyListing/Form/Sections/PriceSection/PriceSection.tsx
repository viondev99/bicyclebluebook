import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FormikTouched, useFormikContext } from 'formik';
import FormikInput from 'components/Formik/Input/FormikInput';
import has from 'lodash/has';
import { useRouter } from 'next/router';
import useConditionByBMY from 'hooks/useConditionsByBMY';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import Button from '@ui/Buttons/Primary/Button';
import { formatCurrency } from 'helpers/string.helper';
import FormikSwitch from 'components/Formik/Switch/FormikSwitch';
import FormikCheckbox from 'components/Formik/CheckBox/FormikCheckbox';
import ProfitCalculateModal from 'components/Account/Personal/MyListing/Form/Sections/PriceSection/ProfitCalculatorModal/ProfitCalculateModal';
import { FormValue } from 'components/Account/Personal/MyListing/Form/form';
import iconDollar from 'assets/img/common/ic_dollar.svg';
import icCalculatorCost from 'assets/img/account/partner/ic_calculator.svg';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import classes from './price-section.module.scss';

interface Props {
  formValue: FormValue;
  isStorefront?: boolean;
  touched?: FormikTouched<FormValue>;
  handleValidateBestOfferPrice?: (err: boolean) => void;
  handleValidateMinPrice?: (err: boolean) => void;
  setValues: (values: {
    salePrice?: number;
    enableBestOfferAccept?: boolean;
    enableMinimumOfferAccept?: boolean;
    enableAutoAcceptOffer?: boolean;
    bestOfferAutoAcceptPrice?: number;
    minimumOfferAutoAcceptPrice?: number;
    msrpPrice?: number;
    privatePartyPrice?: number;
  }) => any;
}

const ExpireOptions = [
  {
    value: '0',
    label: 'No expiration',
  },
  {
    value: '7',
    label: '7 days',
  },
  {
    value: '14',
    label: '14 days',
  },
  {
    value: '21',
    label: '21 days',
  },
  {
    value: '30',
    label: '30 days',
  },
];

const PriceSection: FC<Props> = ({
  formValue,
  setValues,
  isStorefront,
  touched,
  handleValidateBestOfferPrice,
  handleValidateMinPrice,
}) => {
  const { setFieldValue, values } = useFormikContext<FormValue>();
  const baseComponent = useSelector((store: StoreState) => store.valueGuide.baseComponent.baseComponent);
  const tempModels = useSelector((store: StoreState) => store.tradeIn.models);
  // const detailListing = useSelector((store: StoreState) => store.account.personal?.listings?.detailListingListed);
  const [profitCalculatorVisible, setProfitCalculatorVisible] = useState<boolean>(false);
  const router = useRouter();
  const handleAcceptOffer = useCallback(
    (value: boolean) => {
      setValues({
        enableBestOfferAccept: value,
        enableMinimumOfferAccept: value,
        enableAutoAcceptOffer: value,
        bestOfferAutoAcceptPrice: value ? Number(((Number(formValue?.salePrice) * 95) / 100).toFixed(2)) : 0.0,
        minimumOfferAutoAcceptPrice: value ? Number(((Number(formValue?.salePrice) * 60) / 100).toFixed(2)) : 0.0,
      });
    },
    [formValue, setValues],
  );
  // const isCreateOrSellSimilar = useMemo(() => {
  //   return router.pathname?.includes('sell-similar') || router.pathname?.includes('create');
  // }, [router.pathname]);
  const { brand, model, year } = useMemo(() => {
    return {
      brand: baseComponent?.bicycleBrands?.length
        ? baseComponent?.bicycleBrands?.find((item) => item?.name === formValue?.brand)?.id?.toString()
        : '',
      model: tempModels?.length ? tempModels?.find((item) => item?.name === formValue?.model)?.id?.toString() : '',
      year: baseComponent?.bicycleYears?.length
        ? baseComponent?.bicycleYears?.find((item) => item?.name === formValue?.year)?.id?.toString()
        : '',
    };
  }, [baseComponent, tempModels, formValue]);
  const { data } = useConditionByBMY(brand, model, year);

  useEffect(() => {
    if (data?.msrpPrice && formValue.msrpPrice !== data.msrpPrice) {
      setValues({ msrpPrice: data.msrpPrice });
    }
  }, [data, setValues, formValue.msrpPrice]);

  useEffect(() => {
    if (data?.listConditions?.length && formValue.selectedCondition) {
      setFieldValue(
        'privatePartyPrice',
        data.listConditions.find((item) => item.condition === formValue.selectedCondition)?.privatePartyValueAvg || 0,
        false,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setFieldValue]);

  const handleChange = useCallback(
    (e) => {
      if (values?.enableAutoAcceptOffer && values?.enableBestOfferAccept) {
        setFieldValue(
          'bestOfferAutoAcceptPrice',
          Number(((Number(e.target.value) * 95) / 100).toFixed(2)) || 0.0,
          false,
        );
      }
      if (values?.enableAutoAcceptOffer && values?.enableMinimumOfferAccept) {
        setFieldValue(
          'minimumOfferAutoAcceptPrice',
          Number(((Number(e.target.value) * 60) / 100).toFixed(2)) || 0.0,
          false,
        );
      }
    },
    [setFieldValue, values],
  );

  const errorBestOfferPrice = useMemo(() => {
    if (
      has(touched, 'enableAutoAcceptOffer') &&
      formValue?.enableBestOfferAccept &&
      (Number(formValue?.bestOfferAutoAcceptPrice) === 0 || !formValue?.bestOfferAutoAcceptPrice)
    ) {
      handleValidateBestOfferPrice(true);
      return 'Best offer price must be > 0.';
    }
    handleValidateBestOfferPrice(false);
    return null;
  }, [touched, formValue]);

  const errorMinPrice = useMemo(() => {
    if (
      has(touched, 'enableAutoAcceptOffer') &&
      formValue?.enableMinimumOfferAccept &&
      (Number(formValue?.minimumOfferAutoAcceptPrice) === 0 || !formValue?.minimumOfferAutoAcceptPrice)
    ) {
      handleValidateMinPrice(true);
      return 'Min price must be > 0.';
    }
    handleValidateMinPrice(false);
    return null;
  }, [touched, formValue]);

  return (
    <section className={classes.priceSection}>
      <h4 className={classes.title}>Price and Duration</h4>
      <div className={'d-flex flex-column flex-lg-row'}>
        <div>
          <FormikInput
            name={'salePrice'}
            placeholder="0"
            type="number"
            renderPrefix={<img src={iconDollar} alt={'Dollar Icon'} width={22} height={22} />}
          />
        </div>
        {!router?.pathname?.includes('account/mylistings') && (
          <Button onClick={() => setProfitCalculatorVisible(true)} buttonType="outline" className={classes.btn}>
            <img src={icCalculatorCost} alt={'calculate Icon'} /> Profit Calculator
          </Button>
        )}

        <div className={'d-flex mt-4 mt-lg-0'}>
          <div className={classes.calculatedPrice}>
            <h4>MSRP</h4>
            <span className={classes.price}>{formatCurrency(formValue?.msrpPrice)}</span>
          </div>
          <div className={classes.calculatedPrice}>
            <h4>Private Party</h4>
            <span className={classes.price}>{formatCurrency(formValue?.privatePartyPrice)}</span>
          </div>
        </div>
      </div>

      {/* isStoreFront: account online store || Accoount personal */}
      {isStorefront && (
        <div className={classes.switchContainer}>
          <FormikSwitch onColor={'#4cb3e4'} name={'enableAutoAcceptOffer'} handleChange={handleAcceptOffer} />
          <h4 className={classes.label}>Allow buyers to send you their best offers for your consideration</h4>
        </div>
      )}
      {isStorefront && (
        <div className={classes.priceSelectContainer}>
          <div className={'d-flex flex-column flex-lg-row align-items-start align-items-lg-center'}>
            <FormikCheckbox
              name={'enableBestOfferAccept'}
              disabled={!formValue.enableAutoAcceptOffer}
              label={<>Automatically accept offers of at least</>}
              className={classes.checkBox}
            />
            <div>
              <FormikInput
                disabled={!formValue.enableAutoAcceptOffer || !formValue.enableBestOfferAccept}
                name={'bestOfferAutoAcceptPrice'}
                placeholder="0"
                renderPrefix={<img src={iconDollar} alt={'Dollar Icon'} className="icon-button22" />}
                className={classes.input}
              />
              <div className={classes.lineError}>{errorBestOfferPrice}</div>
            </div>
          </div>

          <div className={'d-flex flex-column flex-lg-row align-items-start align-items-lg-center mt-4'}>
            <FormikCheckbox
              name={'enableMinimumOfferAccept'}
              disabled={!formValue.enableAutoAcceptOffer}
              label={<>Automatically decline offers lower than</>}
              className={classes.checkBox}
            />
            <div>
              <FormikInput
                disabled={!formValue.enableAutoAcceptOffer || !formValue.enableMinimumOfferAccept}
                name={'minimumOfferAutoAcceptPrice'}
                placeholder="0"
                renderPrefix={<img src={iconDollar} alt={'Dollar Icon'} className="icon-button22" />}
                className={classes.input}
              />
              <div className={classes.lineError}>{errorMinPrice}</div>
            </div>
          </div>
        </div>
      )}

      {/* <div className={cx(classes.formEmailPaypal)}>
        <h4 className={classes.label}>
          Please enter the email address that you used to register to your PayPal account.
        </h4>
        <FormikInput name={'emailPaypal'} className={classes.email} />
      </div> */}
      <div className={'mt-4'}>
        <h4 className={classes.label}>Duration</h4>
        <FormikSelect
          inputId={'select-duration'}
          name={'expireAfterDays'}
          options={ExpireOptions}
          className={classes.duration}
        />
      </div>

      <ProfitCalculateModal
        formValue={formValue}
        isOpen={profitCalculatorVisible}
        onClose={() => setProfitCalculatorVisible(false)}
        setValues={setValues}
      />
    </section>
  );
};

export default PriceSection;
