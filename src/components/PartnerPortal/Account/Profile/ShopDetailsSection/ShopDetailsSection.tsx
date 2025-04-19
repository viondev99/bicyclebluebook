import React, { useEffect, useState, useMemo, useCallback } from 'react';
import trim from 'lodash/trim';
import FormikInput from 'components/Formik/Input/FormikInput';
import FormikTextMask from 'components/Formik/TextMask/FormikTextMask';
import FormikRadio from 'components/Formik/Radio/FormikRadio';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import Select from '@ui/Select/Select';
import UploadLogo from 'components/StoreFront/Account/Profile/ShopBrandingSection/UploadLogo';
import { Formik, FormikProps, Form } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Button from '@ui/Buttons/Primary/Button';
import t from 'helpers/language';
import cx from 'classnames';
import StoreState from 'model/store';
import { CommonComponents } from 'model/store/common.model';
import { updatePartnerDetail } from 'api/partner/account.api';
import { getPartnerDetailSucceeded, saveStatusShowPartnerTour } from 'store/partner/account/account.action';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import { useListCommonComponent } from 'hooks/useListCommonComponent';
import { useRouter } from 'next/router';
import { handleChangeStepTour } from 'store/authenticate/authenticate.action';
import useScreenDetect from 'hooks/useScreenDetect';
import classes from './shop-details-section.module.scss';

export const urlRegex: RegExp = new RegExp(
  `(?:^(?:(?:(?:[a-z]+:)?//)|www\.)(?:\S+(?::\S*)?@)?(?:localhost|(?:(?:[a-z\u00a1-\uffff0-9][-_]*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::[0-9]{2,5})?(?:[/?#][^\s"]*)?$)`,
  'i',
);

const DetailsSchema = Yup.object().shape({
  name: Yup.string().required(t('common.validateRequired')),
  phone: Yup.string()
    .required(t('common.validateRequired'))
    .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, t('common.validate.phoneInvalid')),
  website: Yup.string().matches(urlRegex, t('common.validate.websiteInvalid')),
  description: Yup.string(),
  smartEtailing: Yup.string(),
});

interface FormDetails {
  name: string;
  phone: string;
  website: string;
  description: string;
  smartEtailing: 'Yes' | 'No';
}

interface Props {
  isStatusAcceptOrWaitingAccept: boolean;
}
const ShopDetailsSection: React.FC<Props> = ({ isStatusAcceptOrWaitingAccept }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { partnerId, detail, detailPartnerLocation } = useSelector((store: StoreState) => ({
    detailPartnerLocation: store.partner.account.detailPartnerLocation,
    detail: store.partner.account.detail,
    partnerId: store.authenticate?.user?.partner,
  }));
  const { stepTour } = useSelector((store: StoreState) => store.authenticate);
  const [logo, setLogo] = useState(null);
  const [brands, setBrands] = useState(['']);
  const [editable, setEditable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const listBrands = useListCommonComponent(CommonComponents.AllBrandBicycle);
  const { currentWidthScreen } = useScreenDetect();

  const brandOptions = useMemo(() => {
    return (
      listBrands?.allBrandBicycle?.map((i) => ({
        value: String(i.id),
        label: i.name,
      })) || []
    );
  }, [listBrands]);

  useEffect(() => {
    setBrands(detail?.brands?.map((item) => String(item.id)) || ['']);
  }, [detail]);
  const initialValues = useMemo(() => {
    return {
      name: detail?.name || (detailPartnerLocation?.name ? detailPartnerLocation?.name : ''),
      phone: detail?.phone || (detailPartnerLocation?.phone ? detailPartnerLocation?.phone : ''),
      website: detail?.website || (detailPartnerLocation?.website ? detailPartnerLocation?.website : ''),
      description: detail?.description || '',
      smartEtailing: detail?.smartEtailing ? 'Yes' : 'No',
    };
  }, [detail]);

  const handleChangeLogo = useCallback((file: File): void => {
    setLogo(file);
  }, []);

  const handleUploadLogo = useCallback(
    (file: File) => {
      if (partnerId && file) {
        const form = new FormData();
        form.append('avatar', file);
        updatePartnerDetail(partnerId, form)
          .then((response) => {
            dispatch(getPartnerDetailSucceeded({ avatar: response.avatar }));
            toastSuccess(t('partnerPortal.account.updateAccount'));
          })
          .catch((error) => {
            toastError(error);
          });
      }
    },
    [partnerId, dispatch],
  );

  const handleChangeBrand = useCallback(
    (value: { label: string; value: string }, index: number) => {
      const temp = [...brands];
      if (temp.includes(value.value)) {
        toastError('partnerPortal.account.validate.duplicateBrand');
      } else {
        temp[index] = value.value;
      }

      setBrands(temp);
    },
    [brands],
  );

  const handleAddBrand = useCallback(() => {
    let temp = [...brands];
    if (temp.length < 4) {
      temp = [...temp, ''];
    }
    setBrands(temp);
  }, [brands]);

  const navigateCreateOnlineStore = useCallback(() => {
    router.push('/trade-in-account/my-account/profile/create-online-store');
  }, [router]);

  const handleFormSubmit = useCallback(
    (form: FormDetails) => {
      if (partnerId && brands?.filter((item) => !!item).length) {
        setLoading(true);
        const payload = new FormData();
        payload.append('name', trim(form.name));
        payload.append('phone', trim(form.phone));
        payload.append('website', trim(form.website));
        payload.append('smart_tailing', form.smartEtailing === 'Yes' ? 'true' : 'false');
        payload.append('tell_about', trim(form.description));
        brands.forEach((item, index) => {
          const found = brandOptions.find((i) => i.value === item);
          payload.append(`brands_carried[${index}].id`, found.value);
          payload.append(`brands_carried[${index}].name`, found.label);
        });
        updatePartnerDetail(partnerId, payload)
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
    [partnerId, brands, brandOptions],
  );

  return (
    <div className={classes.shopInfo}>
      {stepTour === 3 && (
        <div className={classes.wrapModal}>
          {currentWidthScreen >= 768 && <div className={classes.arrowLeft} />}
          <div className="mb-3">
            Account is where you can edit the information for your store, address, and website.
          </div>
          <div>
            You can also edit notifications, add/edit users and locations, and review the program terms and conditions.{' '}
          </div>
          <div className="d-flex justify-content-between mt-4">
            <button
              type="button"
              onClick={() => {
                dispatch(saveStatusShowPartnerTour(false));
                dispatch(handleChangeStepTour({ steps: 2 }));
                router.replace('/trade-in-account/tp-dashboard');
              }}
              className={classes.buttonBack}>
              Back
            </button>
            <button
              type="button"
              className={classes.buttonNext}
              onClick={() => {
                dispatch(saveStatusShowPartnerTour(false));
                dispatch(handleChangeStepTour({ steps: 4 }));
                if (currentWidthScreen < 768) {
                  router.replace('/trade-in-account/trade-in/history');
                }
              }}>
              Next
            </button>
          </div>
        </div>
      )}
      {stepTour === 4 && currentWidthScreen >= 768 && (
        <div
          className={cx(classes.wrapModal, {
            [classes.step4]: stepTour === 4,
          })}>
          {currentWidthScreen >= 768 && <div className={classes.arrowLeft} />}
          <div className={classes.titlePopUp}>
            Trade-in is where you can start a new scorecard, view your shop’s scorecard history, and view reimbursement
            status for trades you’ve sent to Bicycle Blue Book.
          </div>
          <div className="d-flex justify-content-between mt-4">
            <button
              type="button"
              onClick={() => {
                dispatch(saveStatusShowPartnerTour(false));
                dispatch(handleChangeStepTour({ steps: 3 }));
                if (currentWidthScreen < 768) {
                  router.replace('/trade-in-account/my-account/profile');
                }
              }}
              className={classes.buttonBack}>
              Back
            </button>
            <button
              type="button"
              className={classes.buttonNext}
              onClick={() => {
                dispatch(saveStatusShowPartnerTour(false));
                dispatch(handleChangeStepTour({ steps: 5 }));
                router.replace('/trade-in-account/marketing/digital');
              }}>
              Next
            </button>
          </div>
        </div>
      )}
      {isStatusAcceptOrWaitingAccept ? (
        <div className={'d-flex justify-content-end'}>
          <Button
            buttonType={'clear'}
            className={cx(classes.activeEdit, 'w-30 float-right')}
            onClick={navigateCreateOnlineStore}>
            Create online store
          </Button>
        </div>
      ) : null}
      <div className={classes.headerForm}>
        <div className={classes.subTitle}>Shop Details</div>
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
        validationSchema={DetailsSchema}>
        {({ isValid, handleSubmit }: FormikProps<any>) => (
          <Form onSubmit={handleSubmit}>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Business Name*</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikInput name="name" disabled={!editable} />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Phone Number*</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikTextMask name="phone" typeMask="phone" disabled={!editable} />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Website</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikInput name="website" disabled={!editable} />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3} />
              <Col xs={12} sm={9}>
                <div className={classes.title}>Does SmartEtailing host your website?</div>
                <div className={classes.radioGroup}>
                  <div className={classes.radio}>
                    <FormikRadio name="smartEtailing" value={'Yes'} disabled={!editable} />
                    <span>Yes</span>
                  </div>
                  <div className={classes.radio}>
                    <FormikRadio name="smartEtailing" value={'No'} disabled={!editable} />
                    <span>No</span>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Shop Logo</div>
              </Col>
              <Col xs={12} sm={9}>
                <UploadLogo
                  logoUrl={logo || detail?.logo || ''}
                  src={logo}
                  onChange={handleChangeLogo}
                  onChangeData={() => {}}
                  handleUploadLogo={handleUploadLogo}
                  isDisabled={!editable}
                />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Description</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikTextarea name="description" rows={3} disabled={!editable} />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Brand Carried</div>
              </Col>
              <Col xs={12} sm={9}>
                {brands?.map((item, index: number) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={`brands.${index}`} style={{ marginBottom: 10 }}>
                    <Select
                      inputId={`brand-select-shop-details-section-${index}`}
                      isSearchable={true}
                      value={item}
                      options={brandOptions}
                      onChange={(value: { value: string; label: string }) => handleChangeBrand(value, index)}
                      isDisabled={!editable}
                    />
                  </div>
                ))}
                {brands?.length < 4 && (
                  <Button
                    type="button"
                    buttonType="clear"
                    className={classes.btnAdd}
                    disabled={!editable}
                    onClick={handleAddBrand}>
                    Add another
                  </Button>
                )}
                {editable && !brands?.filter((item) => !!item).length && (
                  <div className={classes.error}>{t('partnerPortal.account.validate.brandRequired')}</div>
                )}
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

export default ShopDetailsSection;
