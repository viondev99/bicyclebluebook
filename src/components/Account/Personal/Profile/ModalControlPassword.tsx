import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import FormikInput from 'components/Formik/Input/FormikInput';
import { Formik, FormikProps, Form } from 'formik';
import * as Yup from 'yup';
import Button from '@ui/Buttons/Primary/Button';
import Textarea from '@ui/Textarea';
import t from 'helpers/language';
import Modal from '@ui/Modal/Modal';
import iconTickSuccess from 'assets/img/register/ic_tick_success.svg';
import {
  ChangePassWordModal,
  DeleteAccountModal,
  DeactivateAccountModal,
} from 'model/api/account/personal/profile.model';
import * as profileAction from '../../../../store/account/personal/profile/profile.action';
import classes from './profile.module.scss';

const passwordFormSchema = Yup.object().shape({
  old_password: Yup.string()
    .required(t('common.validate.currentPasswordRequired'))
    .min(8, t('common.validate.currentPasswordLength')),
  new_password: Yup.string()
    .min(8, t('common.validate.newPasswordLength'))
    .required(t('common.validate.newPasswordRequired'))
    .notOneOf([Yup.ref('old_password')], t('common.validate.newPasswordSameOldPassword')),
  retry_password: Yup.string()
    .required(t('common.validate.confirmPasswordRequired'))
    .oneOf([Yup.ref('new_password')], t('common.validate.confirmPasswordMatch')),
});

const passwordForm: ChangePassWordModal = {
  old_password: '',
  new_password: '',
  retry_password: '',
};

interface Props {
  isOpenModal: string;
  handleCloseModal: () => void;
  handleOpenModal: (modalName: string) => void;
  userId: string;
}

function ModalControlPassword(props: Props) {
  const [popupAlert, openPopupAlert] = useState<boolean>(false);
  const [reasonDelete, setReasonDelete] = useState<string>('');
  const dispatch = useDispatch();
  function handleChangePassword(values: ChangePassWordModal): void {
    const onSuccess = (isSuccess: boolean): void => {
      props.handleCloseModal();
      openPopupAlert(true);
    };
    dispatch(profileAction.changePasswordPersonalProfile({ values, onSuccess }));
  }
  function deletePersonalAccount(): void {
    const data: DeleteAccountModal = {
      id: props.userId,
      reason: reasonDelete,
    };
    dispatch(profileAction.deleteAccountPersonal(data));
    props.handleCloseModal();
    setReasonDelete('');
  }
  function deactivatePersonalAccount(): void {
    const data: DeactivateAccountModal = {
      state: 'inactive',
      user: props.userId,
    };
    props.handleCloseModal();
    dispatch(profileAction.deactivateAccountPersonal(data));
  }
  return (
    <div>
      <div className={classes.subTitle}>Remove Your Account</div>
      <div className={classes.groupBtnFooter}>
        <Button
          buttonType="warning"
          className={classes.btnDeactivate}
          onClick={() => props.handleOpenModal('deactivate')}>
          Deactivate Your Account
        </Button>
        <Button buttonType="danger" className={classes.btnDelete} onClick={() => props.handleOpenModal('delete')}>
          Delete Your Account
        </Button>
      </div>
      <Modal
        className={classes.resizeModal}
        isOpen={props.isOpenModal === 'changePassword'}
        title="Reset Password"
        centered={true}
        onClose={() => {
          props.handleCloseModal();
        }}>
        <div>
          <Formik initialValues={passwordForm} onSubmit={handleChangePassword} validationSchema={passwordFormSchema}>
            {(propsFormik: FormikProps<any>) => (
              <Form onSubmit={propsFormik.handleSubmit}>
                <div className={classes.wrapperInput}>
                  <div>
                    <div className={classes.label}>Current Password*</div>
                  </div>
                  <div>
                    <FormikInput name="old_password" type="password" />
                  </div>
                </div>
                <div className={classes.wrapperInput}>
                  <div>
                    <div className={classes.label}>New Password*</div>
                  </div>
                  <div>
                    <FormikInput name="new_password" type="password" />
                  </div>
                </div>
                <div className={classes.wrapperInput}>
                  <div>
                    <div className={classes.label}>Confirm New Password*</div>
                  </div>
                  <div>
                    <FormikInput name="retry_password" type="password" />
                  </div>
                </div>
                <Button type="submit" disabled={Object.keys(propsFormik.errors).length > 0} className={classes.btnSave}>
                  Change Password
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
      <Modal
        className={classes.resizeModal}
        isOpen={props.isOpenModal === 'deactivate'}
        title="Deactivate Your Account"
        centered={true}
        onClose={() => {
          props.handleCloseModal();
        }}>
        <>
          <div className={classes.contentModalDeactivate}>
            Are you sure you want to temporarily deactivate your account? This can be undone at any time.
          </div>
          <div className={classes.footerModelDeactivate}>
            <Button buttonType="warning" className={classes.btnDeactivate} onClick={deactivatePersonalAccount}>
              Deactivate
            </Button>
            <Button
              buttonType="outline"
              className={classes.btnCancel}
              onClick={() => {
                props.handleCloseModal();
              }}>
              Cancel
            </Button>
          </div>
        </>
      </Modal>
      <Modal
        isOpen={props.isOpenModal === 'delete'}
        className={classes.resizeModal}
        headerProps={{ close: false }}
        centered={true}
        title="Delete Your Account"
        onClose={() => {
          props.handleCloseModal();
        }}>
        <>
          <div className={classes.contentModalDeactivate}>
            Are you sure you want to delete your account? This is permanent and cannot be undone.
          </div>
          <div className={classes.footerModelDeactivate}>
            <Button
              buttonType="danger"
              className={classes.btnDelete}
              onClick={() => props.handleOpenModal('modelReason')}>
              Delete
            </Button>
            <Button
              buttonType="outline"
              className={classes.btnCancel}
              onClick={() => {
                props.handleCloseModal();
              }}>
              Cancel
            </Button>
          </div>
        </>
      </Modal>
      <Modal
        isOpen={props.isOpenModal === 'modelReason'}
        className={classes.resizeModal}
        title="We’re sad to see you go."
        headerProps={{ close: false }}
        centered={true}
        onClose={() => {
          props.handleCloseModal();
        }}>
        <>
          <div className={classes.contentModalDeactivate}>
            We're always looking to improve. Please help us out by telling us your reason for leaving.
            <Textarea
              rows={4}
              className={classes.formReason}
              onChange={(e) => {
                setReasonDelete(e.target.value);
              }}
            />
          </div>
          <div className={classes.footerModelDeactivate}>
            <Button buttonType="primary" className={classes.btnSend} onClick={deletePersonalAccount}>
              Send
            </Button>
            <Button buttonType="outline" className={classes.btnCancel} onClick={deletePersonalAccount}>
              Skip
            </Button>
          </div>
        </>
      </Modal>
      <Modal
        className={classes.resizeModal}
        bodyProps={{
          className: classes.contentModalAlert,
        }}
        isOpen={popupAlert}
        header={null}
        centered={true}
        onClose={() => {
          openPopupAlert(false);
        }}>
        <div>
          <div>
            <img src={iconTickSuccess} alt="icon success" />
          </div>
          <div className={classes.description}>{t('myAccount.profile.changePassword')}.</div>
          <Button
            type="button"
            buttonType="outline"
            onClick={() => {
              openPopupAlert(false);
            }}>
            Return to Account
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalControlPassword;
