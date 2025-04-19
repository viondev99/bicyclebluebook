import React, { FC } from 'react';
import FormikInput from 'components/Formik/Input/FormikInput';
import { Formik, FormikProps, Form } from 'formik';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import * as Yup from 'yup';
import t from 'helpers/language';
import images from 'assets/images';
import classes from './stepThree.module.scss';
import { FormType } from '../../FormType';

interface Props {
  handleNextStep: () => void;
  form: FormType;
  setForm: (form: FormType) => void;
  disableEmail?: boolean;
}

interface FormValue {
  first_name: string;
  last_name: string;
  email: string;
}
const RegisterSchema = Yup.object().shape({
  first_name: Yup.string()
    .required(t('common.validate.firstNameRequired'))
    .max(250, t('common.validate.firstNameLength')),
  last_name: Yup.string().required(t('common.validate.lastNameRequired')).max(250, t('common.validate.lastNameLength')),
  email: Yup.string()
    .required(t('authenticate.validate.emailRequiredRegister'))
    .matches(
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
      t('authenticate.validate.emailInvalid'),
    ),
});

const StepThree: FC<Props> = ({ handleNextStep, form, setForm, disableEmail = false }) => {
  const handleFormSubmit = (values: FormValue) => {
    setForm({
      ...form,
      ...values,
    });
    handleNextStep();
  };

  return (
    <Formik initialValues={form} onSubmit={handleFormSubmit} validationSchema={RegisterSchema}>
      {(props: FormikProps<any>) => (
        <Form onSubmit={props.handleSubmit}>
          <h3 className="d-md-none">Account Admin</h3>
          <h3 className="d-none d-md-block">Account Admin Information</h3>

          <div className={cx('form-group row', classes.formItem)}>
            <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>First Name</h4>
            <div className={cx('col-sm-8', classes.input_col)}>
              <FormikInput className={cx(classes.input)} name="first_name" />
            </div>
          </div>

          <div className={cx('form-group row', classes.formItem)}>
            <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Last Name</h4>
            <div className={cx('col-sm-8', classes.input_col)}>
              <FormikInput className={cx(classes.input)} name="last_name" />
            </div>
          </div>

          <div className={cx('form-group row', classes.formItem)}>
            <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Email Address</h4>
            <div className={cx('col-sm-8', classes.input_col)}>
              <FormikInput
                className={cx(classes.input)}
                name="email"
                disabled={disableEmail}
                onChange={(e) => props.setFieldValue('email', e.target.value.trim())}
              />
              <span className={cx(classes.loginNote)}>This will be your username when logging in.</span>
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

export default StepThree;
