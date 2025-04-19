import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormikInput from 'components/Formik/Input/FormikInput';
import { Formik, FormikProps, Form } from 'formik';
import * as Yup from 'yup';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Button from '@ui/Buttons/Primary/Button';
import t from 'helpers/language';
import cx from 'classnames';
import { updatePartnerUserProfile } from 'api/partner/account.api';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import UploadAvatar from '@ui/UploadAvatar/UploadAvatar';
import CookieBrowser from 'js-cookie';
import { useRouter } from 'next/router';
import { parseJwt } from 'helpers/utilities.helper';
import StoreState from 'model/store';
import { getDetailUserOnlineStore, getStorefrontUserProfileSucceeded } from 'store/store-front/account/account.action';
import { getPartnerDetail } from 'store/partner/account/account.action';
import { V3_TOKEN_KEY } from 'constants/common';
import { StatusRegisterStorefront } from 'constants/account';
import PaymentInfo from 'components/Payment/PaymentInfo/PaymentInfo';
import classes from './online-store-section.module.scss';

const OnlineStoreSchema = Yup.object().shape({
  name: Yup.string()
    .required(t('myAccount.profile.validate.shopName'))
    .max(250, t('myAccount.profile.validate.storeNameLength')),
  address: Yup.string().required(t('common.validate.addressRequired')),
  phone: Yup.string()
    .required(t('common.validate.phoneNumberRequired'))
    .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, t('common.validate.phoneInvalid')),
  website_url: Yup.string()
    .max(250, t('myAccount.profile.validate.websiteUrl'))
    .matches(
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
      t('myAccount.profile.validate.websiteUrl'),
    ),
});

const OnlineStoreSection: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const storefrontUserDetail = useSelector((state: StoreState) => {
    return state.storeFront?.account?.storefrontUserDetail?.user;
  });
  const [editable, setEditable] = useState<boolean>(false);
  const [avatar, setAvatar] = useState(null);

  const initialValues = useMemo(() => {
    return {
      name: storefrontUserDetail?.storefront?.name || '',
      address: storefrontUserDetail?.storefront?.binding_address.address || '',
      email: storefrontUserDetail?.storefront?.email || '',
      phone: storefrontUserDetail?.storefront?.phone || '',
      website_url: storefrontUserDetail?.storefront?.website_url || '',
      status: storefrontUserDetail?.storefront?.status_register || '',
      avatar: storefrontUserDetail?.storefront?.logo,
    };
  }, [storefrontUserDetail]);

  const isStatusWaitingAccept = useMemo(() => {
    const info: { status_register_storefront: string } = parseJwt(CookieBrowser.get(V3_TOKEN_KEY));
    return info?.status_register_storefront === StatusRegisterStorefront.ACCEPT;
  }, []);

  const navigateStoreFront = useCallback((): void => {
    router.push('/store-front/account');
  }, [router]);

  const handleChangePhoto = useCallback((file: File): void => {
    setAvatar(file);
  }, []);

  const handleUploadAvatar = useCallback(
    (file: File) => {
      if (storefrontUserDetail._id && file) {
        const form = new FormData();
        form.append('avatar', file);
        updatePartnerUserProfile(storefrontUserDetail._id, form)
          .then((response) => {
            dispatch(getStorefrontUserProfileSucceeded({ avatar: response.avatar }));
            toastSuccess(t('partnerPortal.account.updateAccount'));
          })
          .catch((error) => {
            toastError(error);
          });
      }
    },
    [storefrontUserDetail, dispatch],
  );

  return (
    <div className={classes.storefrontInfo}>
      <div className={classes.headerForm}>
        <div className={classes.subTitle}>Online Store</div>
        <Button
          disabled={!isStatusWaitingAccept}
          buttonType="clear"
          className={cx(classes.editForm, classes.activeEdit)}
          onClick={navigateStoreFront}>
          Edit
        </Button>
      </div>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={null}
        validationSchema={OnlineStoreSchema}>
        {({ isValid, handleSubmit }: FormikProps<any>) => (
          <Form onSubmit={handleSubmit}>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Shop Name*</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikInput name="name" disabled={!editable} />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Shop Adress*</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikInput name="address" disabled={!editable} />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Shop Website*</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikInput name="website_url" disabled={!editable} />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Phone number*</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikInput name="phone" disabled={!editable} />
              </Col>
            </Row>

            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Status*</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikInput name="status" disabled={true} />
              </Col>
            </Row>

            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Profile Photo</div>
              </Col>
              <Col xs={12} sm={9}>
                <UploadAvatar
                  avatarUrl={avatar || storefrontUserDetail?.storefront?.logo}
                  src={avatar}
                  onChange={handleChangePhoto}
                  onChangeData={() => {}}
                  handleUploadAvatar={handleUploadAvatar}
                  isDisabled={!editable}
                />
              </Col>
            </Row>
            <Row className={cx(classes.wrapperInput, classes.wrapRowCardPayment)}>
              <Col xs={12} sm={3}>
                <div className={cx(classes.label, classes.customCardReceivePayment)}>
                  Card/Account to Receive Payment
                </div>
              </Col>
              <Col xs={12} sm={9}>
                <PaymentInfo
                  hideTitle={true}
                  customContainer={classes.customContainer}
                  customCardContainer={classes.customCardContainer}
                />
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OnlineStoreSection;
