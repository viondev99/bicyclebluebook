import React, { FC, memo, useMemo, useEffect, useCallback } from 'react';
import get from 'lodash/get';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import t from 'helpers/language';
import StoreState from 'model/store';
import { addTag } from 'helpers/common.helper';
import { TradeInForm } from 'pages/trade-in/request';
import classes from './form-request.module.scss';
import FormikInput from '../../Formik/Input/FormikInput';
import FormikTextMask from '../../Formik/TextMask/FormikTextMask';
import { requestTradeIn, RequestTradeInPayload } from '../../../store/trade-in/trade-in.action';
import FormRequestButton from './FormRequestButton';

const Step3Schema = Yup.object().shape({
  name: Yup.string()
    .required(t('common.validate.nameRequired'))
    .typeError(t('common.validate.nameRequired'))
    .max(250, t('common.validate.nameLength')),
  email: Yup.string()
    .required(t('common.validate.emailRequired'))
    .typeError(t('common.validate.emailRequired'))
    .email(t('common.validate.emailInvalid')),
  zip: Yup.string()
    .required(t('common.validate.zipCodeRequired'))
    .typeError(t('common.validate.zipCodeRequired'))
    .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, t('common.validate.zipCodeInvalid')),
  phone: Yup.string()
    .required(t('common.validate.phoneNumberRequired'))
    .typeError(t('common.validate.phoneNumberRequired'))
    .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, t('common.validate.phoneInvalid')),
});

interface Props {
  form: TradeInForm;
  onChangeStep: (value: number) => void;
  onChangeForm: (values: Partial<TradeInForm>) => void;
}

interface Step3Form {
  name: string;
  email: string;
  zip: string;
  phone: string;
}

const Step6: FC<Props> = (props) => {
  const { form, onChangeStep, onChangeForm } = props;
  const dispatch = useDispatch();
  const loading = useSelector((store: StoreState) => store.tradeIn.loadingRequest);
  const isSuccess = useSelector((store: StoreState) => store.tradeIn.completeRequest);

  useEffect(() => {
    if (isSuccess) {
      onChangeStep(5);
    }
  }, [isSuccess, onChangeStep]);

  useEffect(() => {
    addTag({
      event: 'VirtualPageView',
      virtualBBBTradeInPageTitle: 'TradeInStep3',
      virtualBBBTradeInPageUrl: '/trade-in/request/step3',
    });
  }, []);

  const initialForm: Step3Form = useMemo(() => {
    return {
      name: form.name,
      email: form.email,
      zip: form.zip,
      phone: form.phone,
    };
  }, [form]);

  const onSubmit = useCallback(
    (values: Step3Form) => {
      const payload: Partial<TradeInForm> = {
        name: values.name,
        email: values.email,
        zip: values.zip,
        phone: values.phone,
      };
      onChangeForm(payload);
      const body: RequestTradeInPayload = {
        bike: {
          brand: get(form.make, 'label', null) || get(form.make, 'value', null),
          model: get(form.model, 'label', null) || get(form.model, 'value', null),
          year: get(form.year, 'label', null) || get(form.year, 'value', null),
          id: form.id,
        },
        tradeInValues: form.tradeInValues,
        bikeWantPurchase: {
          type: get(form.type, 'label', null),
          brand: get(form.brand, 'label', null) || get(form.brand, 'value', null),
        },
        name: payload.name,
        email: payload.email,
        zipCode: payload.zip,
        phone: payload.phone,
        condition: form?.condition,
        tradeInValue: form?.tradeInValue,
      };
      dispatch(requestTradeIn(body));
    },
    [onChangeForm, form, dispatch],
  );

  return (
    <Formik initialValues={initialForm} validationSchema={Step3Schema} onSubmit={onSubmit} enableReinitialize={true}>
      {({ handleSubmit }) => {
        return (
          <form className={classes.container} onSubmit={handleSubmit}>
            <div className={classes.formContainer}>
              <h1 className={classes.title}>How can we reach you?</h1>
              <p className={classes.description}>
                We'll get in touch to arrange a suitable time to bring your bike in to one of our trade in partners.
              </p>
              <div className={classes.inputRow}>
                <div className={classes.input}>
                  <FormikInput inputType="normal" name={'name'} placeholder={'Name'} />
                </div>
                <div className={classes.input}>
                  <FormikTextMask inputType="normal" name={'phone'} typeMask={'phone'} placeholder={'Phone Number'} />
                </div>
              </div>
              <div className={classes.inputRow}>
                <div className={classes.input}>
                  <FormikInput inputType="normal" name={'email'} placeholder={'Email Address'} />
                </div>
                <div className={classes.input}>
                  <FormikInput inputType="normal" name={'zip'} placeholder={'Zip Code'} />
                </div>
              </div>
            </div>
            <FormRequestButton disabledBack={false} disabledContinue={loading} onClickBack={() => onChangeStep(3)} />
          </form>
        );
      }}
    </Formik>
  );
};

export default memo(Step6);
