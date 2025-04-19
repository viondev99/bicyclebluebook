import React, { useState, useMemo, useCallback } from 'react';
import trim from 'lodash/trim';
import { useDispatch, useSelector } from 'react-redux';
import FormikInput from 'components/Formik/Input/FormikInput';
import { Formik, FormikProps, FormikHelpers, Form } from 'formik';
import * as Yup from 'yup';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Button from '@ui/Buttons/Primary/Button';
import t from 'helpers/language';
import cx from 'classnames';
import StoreState from 'model/store';
import { updateStorefrontUserProfile } from 'api/store-front/account.api';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import { getStorefrontUserProfileSucceeded } from 'store/store-front/account/account.action';
import UploadAvatar from './UploadPhoto';
import classes from './user-profile-section.module.scss';

const UserProfileSchema = Yup.object().shape({
  name: Yup.string(),
  firstName: Yup.string().required(t('common.validateRequired')),
  lastName: Yup.string().required(t('common.validateRequired')),
  email: Yup.string().required(t('common.validateRequired')).email(t('common.validate.emailInvalid')),
});

interface FormUserProfile {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
}

const UserProfilesSection: React.FC = () => {
  const dispatch = useDispatch();
  const { userProfile } = useSelector((store: StoreState) => ({ userProfile: store.storeFront.account.userProfile }));
  const [editable, setEditable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [photo, setPhoto] = useState(null);

  const initialValues = useMemo(() => {
    return {
      name: `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`,
      firstName: userProfile?.firstName || '',
      lastName: userProfile?.lastName || '',
      email: userProfile?.email || '',
    };
  }, [userProfile]);

  const handleFormSubmit = useCallback(
    (form: FormUserProfile, formik: FormikHelpers<FormUserProfile>) => {
      if (userProfile?.id) {
        setLoading(true);
        const payload = new FormData();
        payload.append('first_name', trim(form.firstName));
        payload.append('last_name', trim(form.lastName));
        if (trim(form.email) !== userProfile.email) {
          payload.append('email', trim(form.email));
        }
        updateStorefrontUserProfile(userProfile.id, payload)
          .then((response) => {
            toastSuccess(t('storeFront.account.updateAccount'), t('seoTitle.success'));
            formik.setFieldValue('name', `${response?.first_name || ''} ${response?.last_name || ''}`);
            setLoading(false);
            setEditable(false);
          })
          .catch((error) => {
            toastError(error);
            setLoading(false);
          });
      }
    },
    [userProfile],
  );

  const handleChangePhoto = useCallback((file: File): void => {
    setPhoto(file);
  }, []);

  const handleUploadPhoto = useCallback(
    (file: File) => {
      if (userProfile?.id && file) {
        const form = new FormData();
        form.append('avatar', file);
        updateStorefrontUserProfile(userProfile.id, form)
          .then((response) => {
            dispatch(getStorefrontUserProfileSucceeded({ avatar: response.avatar }));
            toastSuccess(t('storeFront.account.updateAccount'), t('seoTitle.success'));
          })
          .catch((error) => {
            toastError(error);
          });
      }
    },
    [userProfile, dispatch],
  );

  return (
    <div className={classes.storefrontInfo}>
      <div className={classes.headerForm}>
        <div className={classes.subTitle}>User Profile</div>
        <Button
          disabled={editable}
          buttonType="clear"
          className={cx(classes.editForm, classes.activeEdit)}
          onClick={() => setEditable(true)}>
          Edit
        </Button>
      </div>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={UserProfileSchema}>
        {({ isValid, handleSubmit }: FormikProps<any>) => (
          <Form onSubmit={handleSubmit}>
            {editable ? (
              <>
                <Row className={classes.wrapperInput}>
                  <Col xs={12} sm={3}>
                    <div className={classes.label}>First Name*</div>
                  </Col>
                  <Col xs={12} sm={9}>
                    <FormikInput name="firstName" disabled={!editable} />
                  </Col>
                </Row>
                <Row className={classes.wrapperInput}>
                  <Col xs={12} sm={3}>
                    <div className={classes.label}>Last Name*</div>
                  </Col>
                  <Col xs={12} sm={9}>
                    <FormikInput name="lastName" disabled={!editable} />
                  </Col>
                </Row>
              </>
            ) : (
              <Row className={classes.wrapperInput}>
                <Col xs={12} sm={3}>
                  <div className={classes.label}>Full Name*</div>
                </Col>
                <Col xs={12} sm={9}>
                  <FormikInput name="name" disabled={!editable} />
                </Col>
              </Row>
            )}
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Email Address*</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikInput name="email" disabled={!editable} />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Profile Photo</div>
              </Col>
              <Col xs={12} sm={9}>
                <UploadAvatar
                  photoUrl={photo || userProfile?.avatar || ''}
                  src={photo}
                  onChange={handleChangePhoto}
                  onChangeData={() => {}}
                  handleUploadPhoto={handleUploadPhoto}
                  isDisabled={!editable}
                />
              </Col>
            </Row>
            <Button type="submit" className={classes.btnSave} disabled={!editable || !isValid || loading}>
              Save Changes
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserProfilesSection;
