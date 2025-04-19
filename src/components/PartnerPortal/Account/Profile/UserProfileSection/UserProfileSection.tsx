import React, { useState, useMemo, useCallback, useEffect } from 'react';
import trim from 'lodash/trim';
import { useDispatch, useSelector } from 'react-redux';
import FormikInput from 'components/Formik/Input/FormikInput';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import FormikRadio from 'components/Formik/Radio/FormikRadio';
import { Formik, FormikProps, Form } from 'formik';
import * as Yup from 'yup';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Button from '@ui/Buttons/Primary/Button';
import t from 'helpers/language';
import cx from 'classnames';
import StoreState from 'model/store';
import { PartnerRole } from 'constants/roles';
import { useListCommonPartner } from 'hooks/useListCommonPartner';
import { updatePartnerUserProfile } from 'api/partner/account.api';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import { getDetailUserOnlineStore, getStorefrontUserProfileSucceeded } from 'store/store-front/account/account.action';
import UploadAvatar from './UploadPhoto';
import classes from './user-profile-section.module.scss';

const UserProfileSchema = Yup.object().shape({
  name: Yup.string(),
  firstName: Yup.string().required(t('common.validateRequired')),
  lastName: Yup.string().required(t('common.validateRequired')),
  email: Yup.string().required(t('common.validateRequired')).email(t('common.validate.emailInvalid')),
});

interface FormUserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: PartnerRole;
  location: string;
}

const UserProfilesSection: React.FC = () => {
  const dispatch = useDispatch();
  const { userProfile, storefrontUserDetail } = useSelector((store: StoreState) => {
    return {
      storefrontUserDetail: store.storeFront?.account?.storefrontUserDetail,
      userProfile: store.partner.account.userProfile,
    };
  });
  const [editable, setEditable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [photo, setPhoto] = useState(null);
  const userInfo = useSelector((state: StoreState) => state.authenticate.user);
  const partners = useListCommonPartner();
  useEffect(() => {
    getDefaultData();
  }, []);

  const getDefaultData = useCallback(() => {
    dispatch(getDetailUserOnlineStore(userInfo?.account));
  }, [dispatch]);

  const initialValues = useMemo(() => {
    return {
      firstName: userProfile?.firstName || (storefrontUserDetail?.first_name ? storefrontUserDetail?.first_name : ''),
      lastName: userProfile?.lastName || (storefrontUserDetail?.last_name ? storefrontUserDetail?.last_name : ''),
      email: userProfile?.email || (storefrontUserDetail?.email ? storefrontUserDetail?.email : ''),
      role: userProfile?.role || '',
      location: userProfile?.location || '',
    };
  }, [userProfile]);

  const handleFormSubmit = useCallback(
    (form: FormUserProfile) => {
      if (userProfile?.id) {
        setLoading(true);
        const payload = new FormData();
        payload.append('first_name', trim(form.firstName));
        payload.append('last_name', trim(form.lastName));
        if (trim(form.email) !== userProfile.email) {
          payload.append('email', trim(form.email));
        }
        payload.append('role', form.role);
        payload.append('partner', form.location);
        updatePartnerUserProfile(userProfile.id, payload)
          .then(() => {
            toastSuccess(t('partnerPortal.account.updateAccount'));
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
        updatePartnerUserProfile(userProfile.id, form)
          .then((response) => {
            dispatch(getStorefrontUserProfileSucceeded({ avatar: response.avatar }));
            toastSuccess(t('partnerPortal.account.updateAccount'));
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
                <div className={classes.label}>Role*</div>
              </Col>
              <Col xs={12} sm={9}>
                {userProfile?.role === PartnerRole.PartnerAdmin && (
                  <div className={classes.radio}>
                    <FormikRadio name="role" value={PartnerRole.PartnerAdmin} disabled={!editable} />
                    <span>Administrator</span>
                  </div>
                )}
                {(userProfile?.role === PartnerRole.PartnerAdmin ||
                  userProfile?.role === PartnerRole.PartnerManager) && (
                  <div className={classes.radio}>
                    <FormikRadio name="role" value={PartnerRole.PartnerManager} disabled={!editable} />
                    <span>Manager</span>
                  </div>
                )}
                <div className={classes.radio}>
                  <FormikRadio name="role" value={PartnerRole.PartnerEmployee} disabled={!editable} />
                  <span>Employee</span>
                </div>
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Location*</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikSelect
                  inputId={'location-select-user-profile-section'}
                  name="location"
                  options={partners}
                  disabled={!editable || userProfile?.role !== PartnerRole.PartnerAdmin}
                />
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
            <Button
              isLoading={loading}
              type="submit"
              className={classes.btnSave}
              disabled={!editable || !isValid || loading}>
              Save Changes
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserProfilesSection;
