import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Modal from 'components/ui/Modal/Modal';
import cx from 'classnames';
import { Formik, FormikProps, Form } from 'formik';
import * as Yup from 'yup';
import t from 'helpers/language';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import FormikInput from 'components/Formik/Input/FormikInput';
import FormikTextMask from 'components/Formik/TextMask/FormikTextMask';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { OptionsType } from 'react-select';
import Button from '@ui/Buttons/Primary/Button';
import { objectToFormData } from 'helpers/utilities.helper';
import iconClose from 'assets/img/modal/ic_close.svg';
import ic_done from 'assets/img/contact/ic_done.svg';
import ic_send from 'assets/img/contact/ic_send.svg';
import { getOptionsContact, getOptionsReasonContact, submitContact } from '../../../api/marketplace.api';
import { toastError } from '../../../helpers/utils.helper';
import classes from './contact.module.scss';

interface ContactForm {
  topic: string | null;
  reason: string;
  shopName: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  image?: any;
}
interface Files {
  lastModified?: number;
  lastModifiedDate?: Date;
  name?: string;
  size?: number;
  type?: number | string;
  webkitRelativePath?: string;
  src?: string;
}

interface Props {}

const ContactSchema = Yup.object().shape({
  topic: Yup.mixed().required(t('common.validateRequired')),
  name: Yup.string().required(t('common.validateRequired')),
  email: Yup.string().required(t('common.validateRequired')).email(t('authenticate.validate.emailRequired')),
  message: Yup.string().required(t('common.validateRequired')).min(30, t('common.validate.messageInvalid')),
});

const ContactBikeShopSchema = Yup.object().shape({
  topic: Yup.mixed().required(t('common.validateRequired')),
  reason: Yup.mixed().required(t('common.validateRequired')),
  shopName: Yup.string().required(t('common.validateRequired')),
  name: Yup.string().required(t('common.validateRequired')),
  email: Yup.string().required(t('common.validateRequired')).email(t('authenticate.validate.emailRequired')),
  phone: Yup.string().matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, t('common.validate.phoneInvalid')),
  message: Yup.string().required(t('common.validateRequired')).min(30, t('common.validate.messageInvalid')),
});

const initFormValue: ContactForm = {
  topic: null,
  reason: '',
  shopName: '',
  name: '',
  email: '',
  message: '',
  phone: '',
};

const ContactModal: FC = () => {
  const router = useRouter();
  const isOpen = !!router.query.contact;
  const [isSubmit, setSubmit] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isForBikeShop, setIsForBikeShop] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [reasons, setReasons] = React.useState([]);
  const [image, setImage] = React.useState<any>(null);
  const inputFileRef: React.RefObject<HTMLInputElement> = React.createRef();

  const handleToggle = useCallback(() => {
    if (router.pathname === '/contact') {
      router.replace('/contact');
      return;
    }
    if (router.query.backOnClose) {
      setSubmit(false);
      // router.back({ shallow: true });
      router.back();
    } else {
      router.push({ pathname: '/' }, undefined, { shallow: true });
    }
    setImage(null);
  }, [router]);

  const handleSubmit = (form: ContactForm) => {
    setLoading(true);
    const payload: {
      type: string;
      name: string;
      shop_name?: string;
      email: string;
      topic: string;
      message: string;
      reason?: string;
      image?: any;
    } = isForBikeShop
      ? {
          type: 'visit',
          name: form.name,
          shop_name: form.shopName,
          email: form.email,
          topic: form.topic,
          message: form.message,
          reason: form.reason,
          image,
        }
      : {
          type: 'visit',
          email: form.email,
          topic: form.topic,
          message: form.message,
          name: form.name,
          image,
        };
    const formData = objectToFormData(payload, { indices: true });
    submitContact(formData as any)
      .then((data) => {
        if (data) {
          setSubmit(true);
          setLoading(false);
          setImage(null);
        }
      })
      .catch((error) => {
        toastError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isOpen) {
      getOptionsContact()
        .then(({ data }) => {
          setOptions(data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      getOptionsReasonContact()
        .then(({ data }) => {
          setReasons(data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setIsForBikeShop(false);
    }
  }, [isOpen]);

  const topicOptions: OptionsType<any> = useMemo(() => {
    return options.map((item) => ({
      label: item.name,
      value: item._id,
    }));
  }, [options]);

  const reasonOptions: OptionsType<any> = useMemo(() => {
    return reasons.map((item) => ({
      label: item.name,
      value: item._id,
    }));
  }, [reasons]);

  const handleFileUpload = (event: { target: HTMLInputElement }) => {
    const target = event.target as HTMLInputElement;
    const listFileSelected: Files[] = Array.from(target.files);
    const fileSelected: any = listFileSelected?.length > 0 ? listFileSelected[0] : null;
    if (fileSelected) {
      fileSelected.src = URL.createObjectURL(fileSelected);
      setImage(fileSelected);
    }
  };

  const handleRemoveImageUpload = useCallback(() => {
    setImage(null);
  }, []);

  const renderImage = useMemo(() => {
    return (
      <div className={classes.renderImg}>
        <div className={classes.rowClose}>
          <Button className={classes.btnCloseUpload} onClick={handleRemoveImageUpload}>
            <img className="close-icon" src={iconClose} alt="" />
          </Button>
        </div>
        <img className={classes.imageUpload} src={image?.src} alt="" />
      </div>
    );
  }, [handleRemoveImageUpload, image]);

  return (
    <Modal
      closeable={false}
      isOpen={isOpen}
      onClose={handleToggle}
      title={
        isSubmit ? (
          <div className={classes.titleMess}>
            <img src={ic_done} alt={'error'} />
            <h2>Message sent</h2>
          </div>
        ) : (
          'Contact Us'
        )
      }
      className={cx(classes.modal)}
      contentClassName={cx(classes.content)}
      centered={true}
      toggle={handleToggle}>
      {isSubmit ? (
        <>
          <p>Thanks for getting in touch. We will get back to you as soon as possible.</p>
          <div className={classes.btnClose}>
            <Button buttonType="outline" onClick={() => router.push({ pathname: '/' }, undefined, { shallow: true })}>
              Close
            </Button>
          </div>
        </>
      ) : (
        <>
          <p>
            We want to hear from you. Please fill out the form and a BicycleBlueBook representative will be in touch
            with you as soon as possible.
          </p>
          <Formik
            initialValues={initFormValue}
            onSubmit={handleSubmit}
            validationSchema={isForBikeShop ? ContactBikeShopSchema : ContactSchema}>
            {(props: FormikProps<any>) => (
              <Form onSubmit={props.handleSubmit}>
                <Row>
                  <Col md={12} className={classes.wrapperInput}>
                    <FormikSelect
                      inputId={'topic-select'}
                      name={'topic'}
                      options={topicOptions}
                      onChangeValue={(value) => {
                        const result = !!options.find((item) => item._id === value)?.is_for_bike_shop;
                        setIsForBikeShop(result);
                      }}
                      placeholder={'Select a topic'}
                    />
                  </Col>
                  {isForBikeShop && (
                    <Col md={12} className={classes.wrapperInput}>
                      <FormikSelect
                        inputId={'reason-select'}
                        name={'reason'}
                        options={reasonOptions}
                        placeholder={'Select a reason'}
                      />
                    </Col>
                  )}
                  {isForBikeShop && (
                    <Col md={12} className={classes.wrapperInput}>
                      <FormikInput name={'shopName'} placeholder={'Shop Name'} />
                    </Col>
                  )}
                  <Col md={12} className={classes.wrapperInput}>
                    <FormikInput name={'name'} placeholder={'Name'} />
                  </Col>
                  <Col md={12} className={classes.wrapperInput}>
                    <FormikInput name={'email'} placeholder={'Email'} />
                  </Col>
                  {isForBikeShop && (
                    <Col md={12} className={classes.wrapperInput}>
                      <FormikTextMask name={'phone'} typeMask={'phone'} placeholder={'Phone'} />
                    </Col>
                  )}
                  <Col md={12} className={classes.wrapperInput}>
                    <FormikTextarea name={'message'} placeholder={'Message'} />
                  </Col>
                  <Col md={12} className={classes.wrapperInput}>
                    {image && renderImage}
                  </Col>
                  {!image && (
                    <Col md={12} className={cx(classes.wrapperInput, classes.wrapperButton)}>
                      <Button
                        className={classes.btnUpload}
                        onClick={() => {
                          inputFileRef.current.click();
                        }}>
                        Upload file
                      </Button>
                      <input
                        ref={inputFileRef}
                        type="file"
                        onChange={handleFileUpload}
                        hidden
                        accept="image/png, image/gif, image/jpeg"
                      />
                    </Col>
                  )}
                  <Col md={12} className={cx(classes.wrapperInput, classes.wrapperButton)}>
                    <Button type="submit" disabled={loading}>
                      Send <img src={ic_send} alt={'error'} />
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </>
      )}
    </Modal>
  );
};

export default ContactModal;
