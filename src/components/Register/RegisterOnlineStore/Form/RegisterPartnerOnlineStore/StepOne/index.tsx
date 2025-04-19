import React, { FC, useState } from 'react';
import FormikInput from 'components/Formik/Input/FormikInput';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import { Formik, FormikProps, Form } from 'formik';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import * as Yup from 'yup';
import t from 'helpers/language';
import { useListCommonState } from 'hooks/useListCommonState';
import images from 'assets/images';
import FormikTextMask from 'components/Formik/TextMask/FormikTextMask';
import { FormType } from '../../FormType';
import { toastError } from 'helpers/utils.helper';
import classes from './stepOne.module.scss';

const RegisterSchema = Yup.object().shape({
  online_store: Yup.object().shape({
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
  }),
});

interface Files {
  lastModified?: number;
  lastModifiedDate?: Date;
  name?: string;
  size?: number;
  type?: number | string;
  webkitRelativePath?: string;
  // src?: string;
}

interface Props {
  form: FormType;
  setForm: (form: FormType) => void;
  handleChangeStep: (step: number) => void;
  isTradeInForm?: boolean;
}

interface FormValue {
  online_store: {
    name: string;
    email: string;
    zip_code: string;
    city: string;
    state: string;
    address: string;
    phone: string;
    contact_name: string;
    website_url: string;
    reseller_number: string;
    description: string;
  };
}

const inputFileRef: React.RefObject<HTMLInputElement> = React.createRef();

const StepOne: FC<Props> = ({ form, setForm, handleChangeStep, isTradeInForm = false }) => {
  const stateOptions = useListCommonState();
  const [pdfUpload, setPdfUpload] = useState<Files>(null);
  const [error, setError] = useState({
    pdf: false,
  });

  const handleFormSubmit = (values: FormValue) => {
    setForm({
      ...form,
      ...values,
      pdf_upload: pdfUpload,
      email: values.online_store.email,
    });
    handleChangeStep(2);
  };

  const handleFileUpload = (event: { target: HTMLInputElement }) => {
    const target = event.target as HTMLInputElement;
    const listFileSelected: Files[] = Array.from(target.files);
    let fileSelected: any = listFileSelected?.length > 0 ? listFileSelected[0] : null;
    if (fileSelected) {
      setPdfUpload(fileSelected);
      setError({
        ...error,
        pdf: false,
      });
    }
  };

  const handleValidateCustom = () => {
    let error = {
      pdf: false,
    };
    if (!pdfUpload) {
      error.pdf = true;
    }
    setError(error);
  };

  return (
    <Formik
      initialValues={form}
      onSubmit={handleFormSubmit}
      validationSchema={RegisterSchema}
      validate={handleValidateCustom}>
      {(props: FormikProps<any>) => (
        <Form onSubmit={props.handleSubmit}>
          <div>
            <h3 className={cx(classes.contentTitle)}>
              {isTradeInForm ? 'Storefront Information' : 'Business Information'}
            </h3>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Online Storefront</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="online_store.name" />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Email Address</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="online_store.email" />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Phone number</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikTextMask className={cx(classes.input)} name="online_store.phone" typeMask="phone" />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col)}>Web Url</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="online_store.website_url" />
              </div>
            </div>
            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Contact Name</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="online_store.contact_name" />
              </div>
            </div>
            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Reseller Number</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="online_store.reseller_number" />
              </div>
            </div>
            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col)}>Description</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikTextarea className={cx(classes.input)} name="online_store.description" rows={3} />
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
                <span className="mt-2">{form?.pdf_upload?.name || pdfUpload?.name || ''}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className={cx(classes.contentTitle)}>Store Address</h3>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Address</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="online_store.address" />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>City</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="online_store.city" />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem, classes.required)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>State</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikSelect
                  inputId={'state-select-online-store-step1'}
                  options={stateOptions}
                  name="online_store.state"
                  isSearchable={true}
                  className={cx(classes.input)}
                />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Zip code</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="online_store.zip_code" />
              </div>
            </div>
          </div>

          <Button type="submit" className={cx(classes.btn)}>
            Continue <img src={images.iconNextWhite} alt="icon_next" className="ml-4" />
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default StepOne;
