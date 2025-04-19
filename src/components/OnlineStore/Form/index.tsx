/* eslint-disable no-unused-expressions */
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import FormikInput from 'components/Formik/Input/FormikInput';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import { Formik, FormikProps, Form } from 'formik';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@ui/Buttons/Primary/Button';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import * as Yup from 'yup';
import t from 'helpers/language';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { useRouter } from 'next/router';
import StoreState from 'model/store';
import { FormCreateOnlineStoreModel } from 'model/store/store-front/account.model';
import { storefrontAddOnlineStore } from 'api/store-front/account.api';
import { toastError } from 'helpers/utils.helper';
import { getStates } from 'store/common/common.action';
import classes from './formCreateOnlineStore.module.scss';
import FormikRadio from '../../Formik/Radio/FormikRadio';
import UploadAvatar from '../../PartnerPortal/Account/Profile/UserProfileSection/UploadPhoto';
import DragFileShopCover from '../OnlineStoreSection/DragFileShopCover';
import FormikTextMask from '../../Formik/TextMask/FormikTextMask';
import ModalCreateOnlineSuccessfully from '../ModalCreateOnlineSuccessfully';

interface OldValue {
  state_ship?: string;
  city_ship?: string;
  zip_code_ship?: string;
  country_ship?: string;
  address_ship?: string;
}

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required(t('myAccount.profile.validate.shopName'))
    .max(250, t('myAccount.profile.validate.storeNameLength')),
  email: Yup.string()
    .required(t('myAccount.profile.validate.shopEmail'))
    .matches(
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
      t('myAccount.profile.validate.emailInvalid'),
    ),
  phone: Yup.string()
    .required(t('common.validate.phoneNumberRequired'))
    .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, t('common.validate.phoneInvalid')),
  address_ship: Yup.string().required(t('common.validate.addressRequired')),
  city_ship: Yup.string().required(t('common.validate.cityRequired')),
  country_ship: Yup.string().required(t('common.validate.cityRequired')),
  state_ship: Yup.string().required(t('common.validate.stateRequired')),
  zip_code_ship: Yup.string()
    .required(t('common.validate.zipCodeRequired'))
    .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, t('common.validate.zipCodeInvalid')),
  country_shop: Yup.string().required(t('common.validate.cityRequired')),
  address_shop: Yup.string().required(t('common.validate.addressRequired')),
  city_shop: Yup.string().required(t('common.validate.cityRequired')),
  state_shop: Yup.string().required(t('common.validate.stateRequired')),
  zip_code_shop: Yup.string()
    .required(t('common.validate.zipCodeRequired'))
    .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, t('common.validate.zipCodeInvalid')),
  contact_name: Yup.string()
    .required(t('myAccount.profile.validate.contactName'))
    .max(250, t('myAccount.profile.validate.storeContactNameLength')),
  website_url: Yup.string()
    .max(250, t('myAccount.profile.validate.websiteUrl'))
    .matches(
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
      t('myAccount.profile.validate.websiteUrl'),
    ),
  reseller_number: Yup.string()
    .required(t('myAccount.profile.validate.resellerNumber'))
    .max(250, t('myAccount.profile.validate.storeResellerNumberLength')),
});

const inputFileRef: React.RefObject<HTMLInputElement> = React.createRef();

const defaultStateOptions = [
  {
    abbreviation: '',
    name: ' Select Your State',
  },
];
const FormCreateOnlineStore = () => {
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const router = useRouter();
  const userInfo = useSelector((state: StoreState) => state.authenticate.user);
  const detailPartnerLocation = useSelector((store: StoreState) => store.partner.account.detailPartnerLocation);
  const states = useSelector((store: StoreState) => store.common.states.state);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const stateOptions = useMemo(() => {
    return Array.isArray(states) && states.length
      ? [...defaultStateOptions, ...states].map((it) => {
          return {
            value: it.abbreviation,
            label: it.name,
          };
        })
      : [];
  }, [states]);

  useEffect(() => {
    if (!states || states?.length === 0) {
      dispatch(getStates());
    }
  }, [dispatch]);

  const [gallery, setGallery] = useState(null);
  const [logo, setLogo] = useState(null);
  const [oldValue, setOldValue] = useState<OldValue>(null);
  const [galleryFile, setGalleryFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [pdfUpload, setPdfUpload] = useState<File>(null);
  const [error, setError] = useState({
    pdf: false,
  });

  // #endregion

  const initialValues = useMemo(() => {
    return {
      name: detailPartnerLocation?.name ? detailPartnerLocation?.name : '',
      email: detailPartnerLocation?.email ? detailPartnerLocation?.email : '',
      phone: detailPartnerLocation?.phone ? detailPartnerLocation?.phone : '',
      address_ship: '',
      zip_code_ship: '',
      city_ship: '',
      state_ship: '',
      address_shop: detailPartnerLocation?.address ? detailPartnerLocation?.address : '',
      zip_code_shop: detailPartnerLocation?.zip_code ? detailPartnerLocation?.zip_code : '',
      city_shop: detailPartnerLocation?.city ? detailPartnerLocation?.city : '',
      state_shop: detailPartnerLocation?.state ? detailPartnerLocation?.state : '',
      is_shipping_same_shop: 'false',
      contact_name: '',
      website_url: '',
      country_shop: 'US',
      country_ship: 'US',
      reseller_number: '',
      description: '',
    };
  }, [detailPartnerLocation]);

  const handleFormSubmit = useCallback(
    async (form: FormCreateOnlineStoreModel) => {
      const formConvert: FormCreateOnlineStoreModel = {
        ...form,
        partner: userInfo?.partner,
        pdf_upload: pdfUpload,
        gallery: galleryFile,
        logo: logoFile,
      };
      try {
        await storefrontAddOnlineStore(formConvert);
        setIsOpenModal(true);
      } catch (_error) {
        toastError(_error);
      }
    },
    [galleryFile, logoFile, pdfUpload, userInfo],
  );

  const handleFileUpload = (event: { target: HTMLInputElement }) => {
    const target = event.target as HTMLInputElement;
    const listFileSelected: File[] = Array.from(target.files);
    const fileSelected: File = listFileSelected?.length > 0 ? listFileSelected[0] : null;
    if (fileSelected) {
      setPdfUpload(fileSelected);
      setError({
        ...error,
        pdf: false,
      });
    }
  };

  const handleValidateCustom = () => {
    const newRrror = {
      pdf: false,
    };
    if (!pdfUpload) {
      newRrror.pdf = true;
    }
    setError(newRrror);
  };

  const handleChangeLogo = useCallback((file: File): void => {
    setLogo(file);
  }, []);

  const handleChangeGallery = useCallback((file: File): void => {
    setGallery(file);
  }, []);

  const handleChangeLogoFile = useCallback((file): void => {
    setLogoFile(file);
  }, []);

  const handleChangeGalleryFile = useCallback((file): void => {
    setGalleryFile(file);
  }, []);

  const navigateProfile = useCallback(() => {
    router.push('/trade-in-account/my-account/profile');
  }, [router]);

  const onCloseModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const handleRadio = useCallback(
    (event: { target: HTMLInputElement }): void => {
      const target = event.target as HTMLInputElement;
      const values = formRef?.current?.values;
      if (target.value === 'true') {
        const newObject = {
          state_ship: values?.state_ship,
          city_ship: values?.city_ship,
          zip_code_ship: values?.zip_code_ship,
          country_ship: values?.country_ship,
          address_ship: values?.address_ship,
        };
        setOldValue({
          ...newObject,
        });
        formRef?.current?.setValues({
          ...formRef?.current?.values,
          is_shipping_same_shop: String(event?.target?.value),
          state_ship: values?.state_shop,
          city_ship: values?.city_shop,
          zip_code_ship: values?.zip_code_shop,
          country_ship: values?.country_shop,
          address_ship: values.address_shop,
        });
      } else {
        formRef?.current?.setValues({
          ...values,
          ...oldValue,
          is_shipping_same_shop: String(event?.target?.value),
        });
      }
    },
    [formRef, oldValue],
  );

  return (
    <>
      <Formik
        innerRef={formRef}
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={RegisterSchema}
        validate={handleValidateCustom}>
        {({ isValid, handleSubmit }: FormikProps<any>) => (
          <Form onSubmit={handleSubmit}>
            {/* Storefront infomation */}

            <Row>
              <Col>
                <div className={classes.contentTitleStoreFront}>Storefront information</div>
              </Col>
            </Row>

            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>Shop Name*</div>
              </Col>
              <Col xs={12} sm={8}>
                <FormikInput name="name" />
              </Col>
            </Row>

            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>Shop Email*</div>
              </Col>
              <Col xs={12} sm={8}>
                <FormikInput name="email" />
              </Col>
            </Row>

            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>Phone Number*</div>
              </Col>
              <Col xs={12} sm={8}>
                <FormikTextMask name="phone" typeMask="phone" />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>Website URL</div>
              </Col>
              <Col xs={12} sm={8}>
                <FormikInput name="website_url" />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>Contact name*</div>
              </Col>
              <Col xs={12} sm={8}>
                <FormikTextarea name="contact_name" rows={3} />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>Reseller number*</div>
              </Col>
              <Col xs={12} sm={8}>
                <FormikInput name="reseller_number" />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>Pdf Upload*</div>
              </Col>
              <Col xs={12} sm={8}>
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
                    accept="application/pdf, image/*"
                  />
                  {error.pdf && <div className={classes._errorText}>{t('myAccount.profile.validate.pdfUpload')}</div>}
                </div>
                <span className="mt-2">{pdfUpload?.name || ''}</span>
              </Col>
            </Row>

            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>Shop Logo</div>
              </Col>
              <Col xs={12} sm={8}>
                <UploadAvatar
                  photoUrl={logo}
                  src={logo}
                  onChange={handleChangeLogo}
                  onChangeData={handleChangeLogoFile}
                  handleUploadPhoto={null}
                />
              </Col>
            </Row>

            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>Shop Cover</div>
              </Col>
              <Col xs={12} sm={8}>
                <DragFileShopCover
                  photoUrl={gallery}
                  src={gallery}
                  onChange={handleChangeGallery}
                  onChangeData={handleChangeGalleryFile}
                  handleUploadPhoto={null}
                />
              </Col>
            </Row>

            {/* Store Address */}

            <Row>
              <Col>
                <div className={classes.contentTitleStoreFront}>Storefront Address</div>
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>Adress*</div>
              </Col>
              <Col xs={12} sm={8}>
                <FormikInput name="address_shop" />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>State*</div>
              </Col>
              <Col xs={12} sm={8}>
                <FormikSelect
                  inputId={'select-carrier'}
                  options={stateOptions}
                  isSearchable={true}
                  placeholder="Select State"
                  name={'state_shop'}
                />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>City*</div>
              </Col>
              <Col xs={12} sm={8}>
                <FormikInput name="city_shop" />
              </Col>
            </Row>

            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>Zip code*</div>
              </Col>
              <Col xs={12} sm={8}>
                <FormikInput name="zip_code_shop" />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>Country*</div>
              </Col>
              <Col xs={12} md={8}>
                <FormikInput name="country_shop" disabled={true} />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={12} className="text-center">
                <h4>Is your shipping address the same as shop address?</h4>
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={12} className={'d-flex justify-content-center'}>
                <FormikRadio
                  name="is_shipping_same_shop"
                  value={'true'}
                  label={<span>Yes</span>}
                  onChange={handleRadio}
                />
                <FormikRadio
                  className={'pl-2'}
                  onChange={handleRadio}
                  name="is_shipping_same_shop"
                  value={'false'}
                  label={<span>No</span>}
                />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <h3>Shipping Address</h3>
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>Adress*</div>
              </Col>
              <Col xs={12} sm={8}>
                <FormikInput name="address_ship" />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>State*</div>
              </Col>
              <Col xs={12} sm={8}>
                <FormikSelect
                  inputId={'select-carrier'}
                  isSearchable={true}
                  options={stateOptions}
                  placeholder="Select State"
                  name={'state_ship'}
                />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>City*</div>
              </Col>
              <Col xs={12} md={8}>
                <FormikInput name="city_ship" />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>Zip code*</div>
              </Col>
              <Col xs={12} md={8}>
                <FormikInput name="zip_code_ship" />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={4}>
                <div className={classes.label}>Country*</div>
              </Col>
              <Col xs={12} md={8}>
                <FormikInput name="country_ship" />
              </Col>
            </Row>
            <div className={classes.listButton}>
              <Button type="submit" className={classes.btn} disabled={!isValid}>
                Create
              </Button>
              <Button buttonType="danger" className={cx(classes.btn, 'ml-3')} onClick={navigateProfile}>
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <ModalCreateOnlineSuccessfully isOpen={isOpenModal} onClose={onCloseModal} />
    </>
  );
};

export default FormCreateOnlineStore;
