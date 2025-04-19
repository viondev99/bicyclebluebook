import React, { useState, useEffect } from 'react';
import FormikInput from 'components/Formik/Input/FormikInput';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import { Formik, FormikProps, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import FormikTextMask from 'components/Formik/TextMask/FormikTextMask';
import t from 'helpers/language';
import classes from './profile.module.scss';
import { PersonalInfo } from '../../../../model/store/account/personal/profile.model';
import * as profileAction from '../../../../store/account/personal/profile/profile.action';
import StoreState from '../../../../model/store/index';

const accountFormSchema = Yup.object().shape({
  user_name: Yup.string().required(t('common.validate.userNameRequired')),
  first_name: Yup.string().required(t('common.validate.firstNameRequired')),
  last_name: Yup.string().required(t('common.validate.lastNameRequired')),
  email: Yup.string().required(t('common.validate.emailRequired')).email(t('common.validate.emailInvalid')),
  phone: Yup.string().matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, t('common.validate.phoneInvalid')),
  password: Yup.string().required(t('common.validate.nameRequired')).min(8, t('common.validate.passwordLength')),
});

interface AccountForm {
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  description: string;
}
const valueForm: AccountForm = {
  user_name: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '********',
  description: '',
};

interface Props {
  personalAccount: PersonalInfo;
  handleOpenModal: (nameModal: string) => void;
}

function AccountInformation(props: Props) {
  const [editForm, enableEditForm] = useState(false);
  const [initialValues, setInitialValue] = useState(valueForm);
  const dispatch = useDispatch();
  // const isChangePassword = useSelector((store: StoreState) => store.account.personal.profile.isChangePassword);
  const error = useSelector((store: StoreState) => store.account.personal.profile.error);
  const update_from = useSelector((store: StoreState) => store.account.personal.profile.updateFrom);
  const { personalAccount } = props;
  function handleFormSubmit(values: AccountForm): void {
    const formData = { ...values, update_from: 'formInfo' };
    delete formData.password;
    dispatch(profileAction.updatePersonalProfile(formData));
    enableEditForm(false);
  }
  useEffect(() => {
    if (personalAccount) {
      setInitialValue({
        ...valueForm,
        user_name: personalAccount?.user?.user_name || '',
        first_name: personalAccount.first_name,
        last_name: personalAccount.last_name,
        email: personalAccount.user?.email,
        phone: personalAccount.phone,
        description: personalAccount?.user?.description || '',
      });
    }
  }, [personalAccount]);
  // useEffect(() => {
  //   if (isChangePassword) {
  //     enableEditForm(false);
  //   }
  // }, [isChangePassword]);

  useEffect(() => {
    if (error && update_from === 'formInfo') {
      enableEditForm(true);
    }
  }, [error, update_from]);
  const { handleOpenModal } = props;
  return (
    <div className={classes.accountInfo}>
      <div className={classes.headerForm}>
        <div className={classes.subTitle}>Account Information</div>
        <Button
          disabled={editForm}
          buttonType="clear"
          className={cx(classes.editForm, classes.activeEdit)}
          onClick={() => enableEditForm(true)}>
          Edit
        </Button>
      </div>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={accountFormSchema}>
        {({ handleSubmit }: FormikProps<any>) => (
          <Form onSubmit={handleSubmit}>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>First Name*</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikInput name="first_name" disabled={!editForm} />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Last Name*</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikInput name="last_name" disabled={!editForm} />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>User Name*</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikInput name="user_name" disabled={!editForm} />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Email Address*</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikInput name="email" disabled={!editForm} />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Phone Number</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikTextMask name="phone" typeMask="phone" disabled={!editForm} />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Description</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikTextarea name="description" rows={3} disabled={!editForm} />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Password</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikInput name="password" disabled={true} />
                <Button
                  disabled={!editForm}
                  onClick={() => handleOpenModal('changePassword')}
                  className={cx(classes.changePasswordText, editForm || classes.disabledChangePass)}>
                  Change Password
                </Button>
              </Col>
            </Row>
            <Button type="submit" disabled={!editForm} className={classes.btnSave}>
              Save Changes
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AccountInformation;
