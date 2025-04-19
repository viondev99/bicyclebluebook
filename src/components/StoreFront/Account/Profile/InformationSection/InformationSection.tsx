import React, { useState, useMemo, useCallback } from 'react';
import trim from 'lodash/trim';
import FormikInput from 'components/Formik/Input/FormikInput';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import FormikTextMask from 'components/Formik/TextMask/FormikTextMask';
import { Formik, FormikProps, Form } from 'formik';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Button from '@ui/Buttons/Primary/Button';
import t from 'helpers/language';
import cx from 'classnames';
import StoreState from 'model/store';
import { updateStorefrontDetail } from 'api/store-front/account.api';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import { URL_PDF_UPLOAD } from 'helpers/string.helper';
import { objectToFormData } from 'helpers/objectToFormdata.helper';
import classes from './information-section.module.scss';

interface Files {
  lastModified?: number;
  lastModifiedDate?: Date;
  name?: string;
  size?: number;
  type?: number | string;
  webkitRelativePath?: string;
  // src?: string;
}
interface FormInformation {
  name: string;
  email: string;
  phone: string;
  description: string;
  website_url: string;
  reseller_number: string;
  contact_name: string;
  pdf_upload?: Files | string;
}

const InformationSchema = Yup.object().shape({
  name: Yup.string().required(t('common.validateRequired')),
  email: Yup.string().required(t('common.validateRequired')).email(t('common.validate.emailInvalid')),
  phone: Yup.string()
    .required(t('common.validateRequired'))
    .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, t('common.validate.phoneInvalid')),
  website_url: Yup.string()
    .max(250, t('authenticate.validate.storeWebsiteUrlLength'))
    .matches(
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
      t('authenticate.validate.storeWebsiteUrlInvalid'),
    ),
  contact_name: Yup.string()
    .required(t('authenticate.validate.storeContactNameRequired'))
    .max(250, t('authenticate.validate.storeContactNameLength')),
  reseller_number: Yup.string()
    .required(t('authenticate.validate.storeResellerNumberRequired'))
    .max(250, t('authenticate.validate.storeResellerNumberLength')),
});

const inputFileRef: React.RefObject<HTMLInputElement> = React.createRef();

const InformationSection: React.FC = () => {
  const { detail } = useSelector((store: StoreState) => ({
    detail: store.storeFront.account.detail,
  }));
  const [editable, setEditable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pdfUpload, setPdfUpload] = useState<Files>(null);
  const [pdfUploadDefault, setPdfUploadDefault] = useState<Files | string>('');
  const [error, setError] = useState({
    pdf: false,
  });

  const initialValues = useMemo(() => {
    const pdf_upload: string = `${detail?.pdf_upload}`.replace(URL_PDF_UPLOAD, '');
    setPdfUploadDefault(pdf_upload);
    return {
      name: detail?.name || '',
      email: detail?.email || '',
      phone: detail?.phone || '',
      description: detail?.description || '',
      website_url: detail?.website_url || '',
      contact_name: detail?.contact_name || '',
      reseller_number: detail?.reseller_number || '',
    };
  }, [detail]);

  const handleFormSubmit = useCallback(
    (form: FormInformation) => {
      let payload: FormInformation = {
        name: trim(form.name),
        email: form.email !== detail.email ? trim(form.email) : detail.email,
        phone: trim(form.phone),
        description: form?.description || '',
        contact_name: trim(form.contact_name),
        reseller_number: trim(form.reseller_number),
        website_url: form?.website_url ? trim(form.website_url) : '',
      };
      if (pdfUpload) {
        payload = {
          ...payload,
          pdf_upload: pdfUpload,
        };
      }
      const formData = objectToFormData(payload, { indices: true });

      if (detail?.id) {
        setLoading(true);
        updateStorefrontDetail(detail.id, formData)
          .then(() => {
            toastSuccess(t('storeFront.account.updateAccount'), t('seoTitle.success'));
            setLoading(false);
            setEditable(false);
          })
          .catch((error) => {
            toastError(error);
            setLoading(false);
          });
      }
    },
    [detail, pdfUpload],
  );

  const handleFileUpload = (event: { target: HTMLInputElement }) => {
    const target = event.target as HTMLInputElement;
    const listFileSelected: Files[] = Array.from(target.files);
    let fileSelected: any = listFileSelected?.length > 0 ? listFileSelected[0] : null;
    if (fileSelected) {
      setPdfUpload(fileSelected);
      setError({
        ...error,
        pdf: false,
      });
    }
  };

  const handleValidateCustom = useCallback(() => {
    let error = {
      pdf: false,
    };
    if (!pdfUpload && (!detail.pdf_upload || detail.pdf_upload === '')) {
      error.pdf = true;
    }
    setError(error);
  }, [detail]);

  return (
    <div className={classes.storefrontInfo}>
      <div className={classes.headerForm}>
        <div className={classes.subTitle}>Storefront Information</div>
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
        validationSchema={InformationSchema}
        validate={handleValidateCustom}>
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
                <div className={classes.label}>Shop Email*</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikInput name="email" disabled={!editable} />
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
                <div className={classes.label}>Web Url</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikInput name="website_url" disabled={!editable} />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Contact Name*</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikInput name="contact_name" disabled={!editable} />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Reseller Number*</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikInput name="reseller_number" disabled={!editable} />
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
                <div className={classes.label}>PDF Upload*</div>
              </Col>
              <Col xs={12} sm={9}>
                <div>
                  <Button
                    disabled={!editable}
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
                    // accept="application/pdf,application/vnd.ms-excel"
                  />
                  {error.pdf && <div className={classes._errorText}>{t('authenticate.validate.pdfFileRequired')}</div>}
                </div>
                <span className="mt-2">{pdfUpload?.name || pdfUploadDefault || ''}</span>
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

export default InformationSection;
