import React, { FC, useState, useCallback, useRef } from 'react';
import FormikInput from 'components/Formik/Input/FormikInput';
import { Formik, FormikProps, Form } from 'formik';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import { useDropzone } from 'react-dropzone';
import FormikCheckbox from 'components/Formik/CheckBox/FormikCheckbox';
import Link from 'next/link';
import Recaptcha from 'react-recaptcha';
import * as Yup from 'yup';
import t from 'helpers/language';
import { urlRegex } from 'helpers/utils.helper';
import CONFIG from 'config';
import classes from './stepFour.module.scss';
import { FormType } from '../../FormType';

const RegisterSchema = Yup.object().shape({
  shop: Yup.object().shape({
    website: Yup.string().matches(urlRegex, t('partnerPortal.account.validate.webSite')),
  }),
});
interface Props {
  form: FormType;
  setForm: (form: FormType) => void;
  handleSubmitForm: (form: FormType) => void;
}
interface FormValue {
  shop: {
    website: string;
    tell_about: string;
  };
}

const StepFour: FC<Props> = ({ form, setForm, handleSubmitForm }) => {
  const recaptchaInstance = useRef(null);

  const [verifyCaptcha, setVerifyCaptcha] = useState<string | null>(null);
  const handleFormSubmit = (values: FormValue) => {
    const data = {
      ...form,
      shop: {
        ...form.shop,
        ...values.shop,
      },
      avatar,
      token_captcha: verifyCaptcha,
    };
    setForm(data);

    handleSubmitForm(data);
  };

  const handleChangForm = (field: string, values: string) => {
    const data = {
      ...form,
      shop: {
        ...form?.shop,
        [field]: values,
      },
    };
    setForm(data);
  };
  // #region Capcha
  const callback = () => {};

  const verifyCaptchaCallback = (response: string) => {
    setVerifyCaptcha(response);
  };
  const expiredCaptchaCallback = () => {
    resetCaptcha();
  };
  const resetCaptcha = () => {
    recaptchaInstance.current.reset();
  };
  // #endregion
  const [avatar, setAvatar] = useState(form.avatar);
  const handleChange = (event: any) => {
    setAvatar(event.target.files[0]);
    const data = {
      ...form,
      avatar: event.target.files[0],
    };
    setForm(data);
  };
  const onDrop = useCallback((acceptedFiles) => {
    setAvatar(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Formik initialValues={form} onSubmit={handleFormSubmit} validationSchema={RegisterSchema}>
      {(props: FormikProps<any>) => (
        <Form onSubmit={props.handleSubmit}>
          <div>
            <h3 className="d-md-none">Partner Directory</h3>
            <h3 className="d-none d-md-block">Partner Directory Information</h3>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col)}>Website URL</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput
                  className={cx(classes.input)}
                  onChange={(e) => handleChangForm('website', e.target.value)}
                  name="shop.website"
                />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col)}>About Your Shop</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikTextarea
                  className={cx(classes.input)}
                  onMouseLeave={(e) => handleChangForm('tell_about', e?.currentTarget?.value)}
                  name="shop.tell_about"
                  rows={8}
                />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col)}>Company Logo</h4>
              <div className="col-sm-8 d-flex align-items-center">
                <div className={cx(classes.company_img)}>
                  {avatar ? (
                    <img src={URL.createObjectURL(avatar)} className="img-fluid " alt="Company logo" />
                  ) : (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p>Drop File Here</p>
                    </div>
                  )}
                </div>
                <input type="file" onChange={handleChange} className={cx(classes.inputFile)} />
              </div>
            </div>
          </div>

          <div className={cx('form-group', classes.checkBox)}>
            <FormikCheckbox
              name="is_setting"
              label={
                <span className={cx(classes.checkboxText)}>
                  Check if you would like to receive marketing communications regarding Bicycle Blue Book products,
                  services, and events. (You can unsubscribe in your preferences at any time.)
                </span>
              }
            />
          </div>

          <div className={cx('form-group', classes.checkBox)}>
            <FormikCheckbox
              name="agreeTerm"
              label={
                <span className={classes.checkboxText}>
                  By clicking Register, you agree that you are a representative of the business listed and agree to
                  bicyclebluebook.com’s{' '}
                  <Link href="/">
                    <a title="Term">Terms of Use.</a>
                  </Link>
                </span>
              }
            />
          </div>

          <div className={cx('form-group row', classes.formItem)}>
            <Recaptcha
              ref={recaptchaInstance}
              render="explicit"
              verifyCallback={verifyCaptchaCallback}
              onloadCallback={callback}
              expiredCallback={expiredCaptchaCallback}
              sitekey={CONFIG.RECAPCHA_SITE_KEY}
              // size="compact"
            />
          </div>

          <Button type="submit" disabled={!props.values.agreeTerm} className={cx(classes.btn)}>
            Create Account
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default StepFour;
