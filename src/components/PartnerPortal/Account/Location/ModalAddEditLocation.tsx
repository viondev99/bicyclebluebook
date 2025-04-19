import React, { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Button from '@ui/Buttons/Primary/Button';
import Modal from '@ui/Modal/Modal';
import cx from 'classnames';
import { FieldArray, Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import classes from './modal-add-edit-user.module.scss';
import FormikInput from 'components/Formik/Input/FormikInput';
import t from 'helpers/language';
import FormikRadio from 'components/Formik/Radio/FormikRadio';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import { useDispatch, useSelector } from 'react-redux';
import { getComponents, getStates } from 'store/common/common.action';
import StoreState from 'model/store';
import {
  addPartnerLocation,
  editPartnerLocation,
  getPartnerLocationDetail,
} from 'store/partner/account/account.action';
import { AddPartnerLocationParams, ItemPartnerLocationResponse } from 'model/store/partner/account.model';
import useScreenDetect from 'hooks/useScreenDetect';
import { CommonComponents } from 'model/store/common.model';
import UploadAvatar from '@ui/UploadAvatar/UploadAvatar';
import { toastError, urlRegex } from 'helpers/utils.helper';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import FormikTextMask from 'components/Formik/TextMask/FormikTextMask';
import { DefaultIconDeleteLink } from 'helpers/utilities.helper';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  recordEdit: ItemPartnerLocationResponse;
}

const FormSchema = Yup.object().shape({
  name: Yup.string()
    .required(t('common.validate.businessNameRequired'))
    .max(250, t('common.validate.businessNameLength')),
  phone: Yup.string()
    .required(t('common.validate.phoneNumberRequired'))
    .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, t('common.validate.phoneInvalid')),
  website: Yup.string().matches(urlRegex, t('partnerPortal.account.validate.webSite')),
  address: Yup.string()
    .required(t('common.validate.addressRequired'))
    .max(250, 'Address cannot exceed 250 characters.'),
  city: Yup.string().required(t('common.validate.cityRequired')).max(250, 'City cannot exceed 250 characters.'),
  state: Yup.string().required(t('common.validate.stateRequired')).max(250, 'State cannot exceed 250 characters.'),
  zip_code: Yup.string()
    .required(t('common.validate.zipCodeRequired'))
    .max(250, 'Zip Code cannot exceed 250 characters.'),
});

interface FormValues {
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  website: string;
  tell_about: string;
  smart_tailing: string;
  brands_carried: string[];
}

const defaultStateOptions = [
  {
    abbreviation: '',
    name: ' Select Your State',
  },
];

const ModalAddEditUser: FC<Props> = (props) => {
  const { isOpen, onClose, recordEdit } = props;
  const { currentWidthScreen } = useScreenDetect();
  const formRef = useRef<FormikProps<FormValues>>();
  const dispatch = useDispatch();
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const states = useSelector((store: StoreState) => store.common.states.state);
  const allBrandBicycle = useSelector((store: StoreState) => store.common.components?.allBrandBicycle);
  const detailPartnerLocation = useSelector((store: StoreState) => store.partner.account.detailPartnerLocation);

  const [avatar, setavatar] = useState(null);
  const [avatarUpload, setavatarUpload] = useState(null);
  const [locationForm, setLocationForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
    website: '',
    tell_about: '',
    smart_tailing: 'No',
    brands_carried: [''],
  });

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

  const allBrandCarriedOptions = useMemo(() => {
    return Array.isArray(allBrandBicycle) && allBrandBicycle.length
      ? allBrandBicycle.map((it) => {
          return {
            value: `${it.id}`,
            label: it.name,
          };
        })
      : [];
  }, [allBrandBicycle]);

  useEffect(() => {
    dispatch(getStates());
    dispatch(getComponents([CommonComponents.AllBrandBicycle]));
    if (recordEdit?._id) {
      dispatch(getPartnerLocationDetail(recordEdit?._id));
    }
  }, [dispatch, recordEdit]);

  useEffect(() => {
    if (detailPartnerLocation) {
      setLocationForm({
        name: detailPartnerLocation?.name || '',
        address: detailPartnerLocation?.address || '',
        city: detailPartnerLocation?.city || '',
        state: detailPartnerLocation?.state || '',
        zip_code: detailPartnerLocation?.zip_code || '',
        phone: detailPartnerLocation?.phone || '',
        website: detailPartnerLocation?.website || '',
        tell_about: detailPartnerLocation?.tell_about || '',
        smart_tailing: detailPartnerLocation?.smart_tailing ? 'Yes' : 'No',
        brands_carried:
          Array.isArray(detailPartnerLocation?.brands_carried) && detailPartnerLocation?.brands_carried?.length > 0
            ? detailPartnerLocation.brands_carried.map((it) => it.id)
            : [''],
      });
      setavatar(detailPartnerLocation?.avatar);
    }
  }, [detailPartnerLocation]);

  const handleUploadAvatar = (file: File) => {
    setavatarUpload(file);
  };

  const handleFormSubmit = (values: FormValues) => {
    let brandsCarried = [...values.brands_carried]
      .filter((item) => item !== '')
      .map((item: string) => allBrandCarriedOptions.find((i: { value: string }) => i.value === item));

    const brands_carried = brandsCarried.map((it) => {
      return {
        id: Number(it.value),
        name: it.label,
      };
    });

    let payload: AddPartnerLocationParams = {
      address: values.address.trim(),
      avatar: avatarUpload ? avatarUpload : avatar,
      brands_carried,
      city: values.city.trim(),
      name: values.name.trim(),
      os_type: 'web',
      partner_parent: userInfo?.partner,
      phone: values.phone,
      smart_tailing: values.smart_tailing === 'Yes',
      state: values.state.trim(),
      website: values.website.trim(),
      tell_about: values.tell_about.trim(),
      zip_code: values.zip_code.trim(),
    };

    if (recordEdit) {
      dispatch(editPartnerLocation(payload));
      return;
    }
    dispatch(addPartnerLocation(payload));
  };

  const handleChangePhoto = useCallback((file: File): void => {
    setavatar(file);
  }, []);

  const handleAddBrand = () => {
    const brand = formRef?.current?.values?.brands_carried;
    if (brand[brand.length - 1] === '') {
      return toastError(`Brands Carried is required.`);
    }
    const newBrand = [...brand, ...['']];
    formRef.current.setFieldValue('brands_carried', newBrand);
  };

  const handleRemoveBrand = (index: number) => {
    let brandsCarried = [...formRef?.current?.values?.brands_carried];
    brandsCarried.splice(index, 1);
    formRef.current.setFieldValue('brands_carried', brandsCarried);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      centered={true}
      titleClassName={classes.titleClassName}
      className={classes.customModalConfirmDelete}
      icArrowLeftClassName={classes.icArrowLeftClassName}
      showImageLeft={true}
      hideButtonClose={true}
      title={`${recordEdit ? 'Edit' : 'Add'} Location`}>
      <div>
        <Formik
          innerRef={formRef}
          enableReinitialize={true}
          onSubmit={handleFormSubmit}
          initialValues={locationForm}
          validationSchema={FormSchema}>
          {({ handleSubmit, values }: FormikProps<FormValues>) => (
            <Form onSubmit={handleSubmit} className={'mt-4'}>
              <Row className={classes.mb22}>
                <Col md={3}>
                  <div className={classes.titleField}>Business Name *</div>
                </Col>
                <Col md={9}>
                  <FormikInput name="name" className={classes.formSize} />
                </Col>
              </Row>
              <Row className={classes.mb22}>
                <Col md={3}>
                  <div className={classes.titleField}>Phone Number *</div>
                </Col>
                <Col md={9}>
                  <FormikTextMask typeMask="phone" name="phone" className={classes.formSize} />
                </Col>
              </Row>
              <Row className={classes.mb22}>
                <Col md={3}>
                  <div className={classes.titleField}>Website</div>
                </Col>
                <Col md={9}>
                  <div>
                    <FormikInput name="website" className={classes.formSize} />
                    <div className={cx(classes.smartText, classes.wrapMobileContainer)}>
                      Does SmartEtailing host your website?
                    </div>
                    <div className={cx('d-flex', classes.wrapMobileContainer)}>
                      <FormikRadio
                        name="smart_tailing"
                        value={'Yes'}
                        className={cx(classes.radio, classes.mr34)}
                        label="Yes"
                      />
                      <FormikRadio name="smart_tailing" value={'No'} className={classes.radio} label="No" />
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className={classes.mb22}>
                <Col md={3}>
                  <div className={classes.titleField}>Shop Logo</div>
                </Col>
                <Col md={9}>
                  <div className={classes.wrapMobileContainer}>
                    <UploadAvatar
                      src={avatar}
                      avatarUrl={avatar || ''}
                      onChange={handleChangePhoto}
                      onChangeData={() => {}}
                      handleUploadAvatar={handleUploadAvatar}
                    />
                  </div>
                </Col>
              </Row>

              <Row className={classes.mb22}>
                <Col md={3}>
                  <div className={classes.titleField}>Summary</div>
                </Col>
                <Col md={9}>
                  <div className={classes.wrapMobileContainer}>
                    <FormikTextarea name="tell_about" rows={4} />
                  </div>
                </Col>
              </Row>

              <Row className={classes.mb22}>
                <Col md={3}>
                  <div className={classes.titleField}>Brands Carried</div>
                </Col>
                <Col md={9}>
                  <div>
                    <FieldArray
                      name={'brands_carried'}
                      render={() =>
                        values.brands_carried.map((item: any, index: number) => (
                          <div className={classes.wrapBrandsCarried} key={index}>
                            <div className={classes.brandsCarried}>
                              <FormikSelect
                                inputId={'select-state'}
                                options={allBrandCarriedOptions}
                                className={cx(classes.formSize)}
                                name={`brands_carried.${index}`}
                                isSearchable={true}
                                selectStyles={{
                                  control: {
                                    minHeight:
                                      currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
                                  },
                                }}
                              />
                            </div>
                            {index !== 0 && (
                              <img
                                src={DefaultIconDeleteLink}
                                className={classes.imgDelete}
                                onClick={() => handleRemoveBrand(index)}
                              />
                            )}
                          </div>
                        ))
                      }
                    />
                  </div>
                  {values.brands_carried.length < 4 && (
                    <div className={cx(classes.addBrandText, classes.wrapMobileContainer)} onClick={handleAddBrand}>
                      Add another
                    </div>
                  )}
                </Col>
              </Row>

              <div className={classes.wrapMobileContainer}>
                <hr className={classes.customHr} />
              </div>

              <Row className={classes.mb22}>
                <Col md={3}>
                  <div className={classes.titleField}>Address *</div>
                </Col>
                <Col md={9}>
                  <FormikInput name="address" className={classes.formSize} />
                </Col>
              </Row>
              <Row className={classes.mb22}>
                <Col md={3}>
                  <div className={classes.titleField}>City *</div>
                </Col>
                <Col md={9}>
                  <FormikInput name="city" className={classes.formSize} />
                </Col>
              </Row>
              <Row className={classes.mb22}>
                <Col md={3}>
                  <div className={classes.titleField}>State *</div>
                </Col>
                <Col md={9}>
                  <div className={classes.wrapMobileContainer}>
                    <FormikSelect
                      inputId={'select-state'}
                      options={stateOptions}
                      className={classes.formSize}
                      name="state"
                      isSearchable={true}
                      selectStyles={{
                        control: {
                          minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
                        },
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <Row className={classes.mb22}>
                <Col md={3}>
                  <div className={classes.titleField}>Zip Code *</div>
                </Col>
                <Col md={9}>
                  <FormikInput name="zip_code" className={classes.formSize} />
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </div>
      <div className={cx(classes.wrapButton, classes.bottomRight)}>
        <Button className={classes.btnSubmit} buttonType="primary" onClick={() => formRef.current.handleSubmit()}>
          {recordEdit?._id ? 'Save Changes' : 'Add Location'}
        </Button>
        {currentWidthScreen > 767 && (
          <Button className={classes.btnCancel} buttonType="outline" onClick={onClose} style={{ marginLeft: 20 }}>
            Cancel
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default memo(ModalAddEditUser);
