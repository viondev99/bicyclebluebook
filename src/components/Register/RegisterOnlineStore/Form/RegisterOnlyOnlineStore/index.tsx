import React, { useState, useRef } from 'react';
import FormikInput from 'components/Formik/Input/FormikInput';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import { Formik, FormikProps, Form } from 'formik';
import cx from 'classnames';
import { useDispatch } from 'react-redux';
import Button from '@ui/Buttons/Primary/Button';
import Recaptcha from 'react-recaptcha';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import { registerOnlineStore } from 'store/authenticate/authenticate.action';
import FormikCheckbox from 'components/Formik/CheckBox/FormikCheckbox';
import * as Yup from 'yup';
import t from 'helpers/language';
import { useListCommonState } from 'hooks/useListCommonState';
import FormikTextMask from 'components/Formik/TextMask/FormikTextMask';
import CONFIG from 'config';
import classes from './registerOnlyOnlineStore.module.scss';

interface Files {
  lastModified?: number;
  lastModifiedDate?: Date;
  name?: string;
  size?: number;
  type?: number | string;
  webkitRelativePath?: string;
  // src?: string;
}

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required(t('authenticate.validate.storeNameRequired'))
    .max(250, t('authenticate.validate.storeNameLength')),
  email: Yup.string()
    .required(t('authenticate.validate.emailRequiredRegister'))
    .matches(
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
      t('authenticate.validate.emailInvalid'),
    ),
  phone: Yup.string()
    .required(t('common.validate.phoneNumberRequired'))
    .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, t('common.validate.phoneInvalid')),
  address: Yup.string().required(t('common.validate.addressRequired')),
  city: Yup.string().required(t('common.validate.cityRequired')),
  state: Yup.string().required(t('common.validate.stateRequired')),
  zip_code: Yup.string()
    .required(t('common.validate.zipCodeRequired'))
    .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, t('common.validate.zipCodeInvalid')),
  contact_name: Yup.string()
    .required(t('authenticate.validate.storeContactNameRequired'))
    .max(250, t('authenticate.validate.storeContactNameLength')),
  website_url: Yup.string()
    .max(250, t('authenticate.validate.storeWebsiteUrlLength'))
    .matches(
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
      t('authenticate.validate.storeWebsiteUrlInvalid'),
    ),
  reseller_number: Yup.string()
    .required(t('authenticate.validate.storeResellerNumberRequired'))
    .max(250, t('authenticate.validate.storeResellerNumberLength')),
});
const initFormValue = {
  name: '',
  email: '',
  zip_code: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  is_setting: false,
  contact_name: '',
  website_url: '',
  reseller_number: '',
  description: '',
};

const inputFileRef: React.RefObject<HTMLInputElement> = React.createRef();

const RegisterOnlyOnlineStore = () => {
  const dispatch = useDispatch();
  const recaptchaInstance = useRef(null);
  const [verifyCaptcha, setVerifyCaptcha] = useState(null);
  const [pdfUpload, setPdfUpload] = useState<Files>(null);
  const [error, setError] = useState({
    pdf: false,
    captcha: false,
  });

  const stateOptions = useListCommonState();

  // #region Capcha
  const callback = () => {};

  const verifyCaptchaCallback = (response: any) => {
    setVerifyCaptcha(response);
    setError({
      ...error,
      captcha: false,
    });
  };
  const expiredCaptchaCallback = () => {
    resetCaptcha();
  };
  const resetCaptcha = () => {
    recaptchaInstance.current.reset();
  };
  // #endregion

  const handleFormSubmit = (values: any) => {
    const data = {
      email: values.email,
      online_store: {
        name: values.name,
        phone: values.phone,
        address: values.address,
        city: values.city,
        state: values.state,
        zip_code: values.zip_code,
        website_url: values.website_url,
        contact_name: values.contact_name,
        reseller_number: values.reseller_number,
        description: values.description,
      },
      token_captcha: verifyCaptcha,
      is_setting: values.is_setting,
      pdf_upload: pdfUpload,
    };
    dispatch(registerOnlineStore(data));
    resetCaptcha();
    setVerifyCaptcha(null);
  };

  const handleFileUpload = (event: { target: HTMLInputElement }) => {
    const target = event.target as HTMLInputElement;
    const listFileSelected: Files[] = Array.from(target.files);
    const fileSelected: any = listFileSelected?.length > 0 ? listFileSelected[0] : null;
    if (fileSelected) {
      setPdfUpload(fileSelected);
      setError({
        ...error,
        pdf: false,
      });
    }
  };

  const handleValidateCustom = () => {
    const error = {
      captcha: false,
      pdf: false,
    };
    if (!verifyCaptcha) {
      error.captcha = true;
    }
    if (!pdfUpload) {
      error.pdf = true;
    }
    setError(error);
  };

  return (
    <Formik
      initialValues={initFormValue}
      onSubmit={handleFormSubmit}
      validationSchema={RegisterSchema}
      validate={handleValidateCustom}>
      {(props: FormikProps<any>) => (
        <Form onSubmit={props.handleSubmit}>
          <div>
            <h3 className={cx(classes.contentTitle)}>Storefront Information</h3>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Online Storefront</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="name" />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Email Address</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="email" />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Phone Number</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikTextMask className={cx(classes.input)} name="phone" typeMask="phone" />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col)}>Web Url</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="website_url" />
              </div>
            </div>
            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Contact Name</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="contact_name" />
              </div>
            </div>
            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Reseller Number</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="reseller_number" />
              </div>
            </div>
            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col)}>Description</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikTextarea className={cx(classes.input)} name="description" rows={3} />
              </div>
            </div>
            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>PDF Upload</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <div>
                  <Button
                    onClick={() => {
                      inputFileRef.current.click();
                    }}>
                    Upload
                  </Button>
                  <input
                    ref={inputFileRef}
                    type="file"
                    onChange={handleFileUpload}
                    hidden
                    // accept="application/pdf,application/vnd.ms-excel"
                  />
                  {error.pdf && <div className={classes._errorText}>{t('authenticate.validate.pdfFileRequired')}</div>}
                </div>
                <span className="mt-2">{pdfUpload?.name || ''}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className={cx(classes.contentTitle)}>Store Address</h3>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Address</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="address" />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>City</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="city" />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>State</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikSelect
                  inputId={'state-select-register-online-store'}
                  options={stateOptions}
                  name="state"
                  className={cx(classes.input)}
                  isSearchable={true}
                />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Zip code</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="zip_code" />
              </div>
            </div>
            <div className={cx('form-group d-flex', classes.formItem)}>
              <FormikCheckbox name="is_setting" className={classes.checkBox} />
              <span className={cx(classes.checkboxText)}>
                Check if you would like to receive marketing communications regarding Bicycle Blue Book products,
                services, and events. (You can unsubscribe in your preferences at any time.)
              </span>
            </div>
            <div className={cx('form-group', classes.formItem)}>
              <Recaptcha
                ref={recaptchaInstance}
                render="explicit"
                verifyCallback={verifyCaptchaCallback}
                onloadCallback={callback}
                expiredCallback={expiredCaptchaCallback}
                sitekey={CONFIG.RECAPCHA_SITE_KEY}
                // size="compact"
              />
              {error.captcha && <div className={classes._errorText}>{t('capcha.empty')}</div>}
            </div>
          </div>

          <Button type="submit" className={cx(classes.btn)}>
            Create Account
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterOnlyOnlineStore;
