import React, { FC, useMemo, useEffect, useCallback } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@ui/Modal/Modal';

import t from 'helpers/language';
import { StorefrontRole } from 'constants/roles';
import StoreState from 'model/store';
import { StorefrontUserModel } from 'model/store/store-front/account.model';
import classes from '../users.module.scss';
import FormikInput from 'components/Formik/Input/FormikInput';
import FormikRadio from 'components/Formik/Radio/FormikRadio';
import Button from 'components/ui/Buttons/Primary/Button';
import { updateStorefrontUser } from 'store/store-front/account/account.action';

const UserSchema = Yup.object().shape({
  firstName: Yup.string().required(t('common.validateRequired')).max(250, t('common.validate.firstNameLength')),
  lastName: Yup.string().required(t('common.validateRequired')).max(250, t('common.validate.lastNameLength')),
  email: Yup.string().required(t('common.validateRequired')).email(t('common.validate.emailInvalid')),
  role: Yup.string(),
});

interface Props {
  user?: StorefrontUserModel & { firstName: string; lastName: string };
  isOpen: boolean;
  onClose: () => void;
}

interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  role: StorefrontRole;
}

const roleOptions: { label: string; value: StorefrontRole }[] = [
  { label: 'Administrator', value: StorefrontRole.Administrator },
  { label: 'Manager', value: StorefrontRole.Manager },
  { label: 'Team member', value: StorefrontRole.Employee },
];

const EditUser: FC<Props> = ({ user, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { role, loading, success } = useSelector((store: StoreState) => {
    return {
      role: store.authenticate.user?.role,
      success: store.storeFront.account.successAction,
      loading: store.storeFront.account.loadingAction,
    };
  });

  const initialForm: UserForm = useMemo(() => {
    return {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      role: user?.role
        ? user?.role
        : role === StorefrontRole.Administrator
        ? StorefrontRole.Administrator
        : role === StorefrontRole.Manager
        ? StorefrontRole.Manager
        : StorefrontRole.Employee,
    };
  }, [user, role]);

  useEffect(() => {
    if (success) {
      onClose();
    }
  }, [success, onClose]);

  const onSubmit = useCallback(
    (form: UserForm) => {
      dispatch(
        updateStorefrontUser({
          id: user?.account,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email === user.email ? undefined : form.email,
          role: form.role,
        }),
      );
    },
    [user],
  );

  return (
    <Modal className={classes.updateUserModal} centered={true} isOpen={isOpen} onClose={onClose} title={'Edit User'}>
      <Formik initialValues={initialForm} validationSchema={UserSchema} enableReinitialize={true} onSubmit={onSubmit}>
        {({ handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit}>
              <div className={classes.inputContainer}>
                <div className={classes.inputLabel}>First Name*</div>
                <div style={{ flex: 1 }}>
                  <FormikInput name={'firstName'} />
                </div>
              </div>
              <div className={classes.inputContainer}>
                <div className={classes.inputLabel}>Last Name*</div>
                <div style={{ flex: 1 }}>
                  <FormikInput name={'lastName'} />
                </div>
              </div>
              <div className={classes.inputContainer}>
                <div className={classes.inputLabel}>Email Address*</div>
                <div style={{ flex: 1 }}>
                  <FormikInput name={'email'} />
                </div>
              </div>
              <div className={classes.inputContainer}>
                <div className={classes.inputLabel} style={{ paddingTop: 0 }}>
                  Role*
                </div>
                <div style={{ flex: 1 }}>
                  {roleOptions
                    .filter((item) => {
                      if (role === StorefrontRole.Employee) {
                        return item.value === StorefrontRole.Employee;
                      } else if (role === StorefrontRole.Manager) {
                        return item.value === StorefrontRole.Manager || item.value === StorefrontRole.Employee;
                      } else {
                        return true;
                      }
                    })
                    .map((item) => (
                      <FormikRadio key={item.value} name={'role'} label={item.label} value={item.value} />
                    ))}
                </div>
              </div>
              <div>
                <Button type={'submit'} buttonSize={'l'} disabled={loading} style={{ marginRight: 15 }}>
                  Save Changes
                </Button>
                <Button
                  className={classes.buttonCancel}
                  type={'button'}
                  buttonType={'outline'}
                  buttonSize={'l'}
                  onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default EditUser;
