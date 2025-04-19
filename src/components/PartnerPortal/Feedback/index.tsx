/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-target-blank */
import Card from '@ui/Cards';
import React, { FC, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Form, Formik, FormikProps } from 'formik';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import FormikInput from 'components/Formik/Input/FormikInput';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import Button from '@ui/Buttons/Primary/Button';
import useScreenDetect from 'hooks/useScreenDetect';
import { getOptionsContact, getOptionsReasonContact, submitContact } from 'api/marketplace.api';
import { toastError } from 'helpers/utils.helper';
import { handleChangeStepTour } from 'store/authenticate/authenticate.action';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import cx from 'classnames';
import { getPartnerLocationDetail, saveStatusShowPartnerTour } from 'store/partner/account/account.action';
import { FormSchema } from './formValidate';
import classes from './feedback.module.scss';
import images from '@images';

const ModalThankyou = React.lazy(() => import('./ModalThankyou'));

interface FormValue {
  email: string;
  message: string;
  name: string;
  phone: string;
  reason: string;
  shop_name: string;
  topic: string;
  type: string;
}

const initialValues = {
  email: '',
  message: '',
  name: '',
  phone: '',
  reason: '',
  shop_name: '',
  topic: '',
  type: 'visit',
};

const Feedback: FC = () => {
  const { currentWidthScreen } = useScreenDetect();
  const [topic, setTopic] = useState(null);
  const [reason, setReason] = useState(null);
  const [topicOptions, setTopicOptions] = useState([]);
  const [visibleModalThankyou, setVisibleModalThankyou] = useState(false);
  const formRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { stepTour } = useSelector((store: StoreState) => store.authenticate);
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const partner = useSelector((store: StoreState) => store.partner.account.detailPartnerLocation);

  useEffect(() => {
    if (userInfo) {
      dispatch(getPartnerLocationDetail(userInfo?.partner));
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    handleGetTopic();
    handleGetReason();
  }, []);

  useEffect(() => {
    if (reason && topic && topic?.data?.length) {
      let dataReason = null;
      topic.data
        .filter((item: any) => item.is_for_bike_shop)
        .map((item: any) => {
          let dataOption =
            Object.keys(reason).length > 0
              ? reason.data.filter((i: any) => {
                  if (i.topic === item._id) {
                    return i;
                  }
                })
              : [];
          dataOption = dataOption.map((it: any) => {
            return {
              value: it._id,
              label: it.name,
              topic: it.topic,
            };
          });
          dataReason = [...dataOption];
          return dataOption;
        });
      setTopicOptions(dataReason);
    }
  }, [reason, topic]);

  const handleGetTopic = useCallback(async () => {
    try {
      const response = await getOptionsContact();
      setTopic(response);
    } catch (error) {
      toastError(error);
    }
  }, []);

  const handleGetReason = useCallback(async () => {
    try {
      const response = await getOptionsReasonContact();
      setReason(response);
    } catch (error) {
      toastError(error);
    }
  }, []);

  const onSubmit = async (values: FormValue) => {
    const topicSelected = topicOptions?.find((it: { value: string }) => it.value === values.reason);
    try {
      await submitContact({
        ...values,
        topic: topicSelected?.topic,
      });
      formRef.current?.resetForm();
      setVisibleModalThankyou(true);
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <>
      {stepTour === 7 && (
        <div
          className={cx(classes.wrapModal, {
            [classes.step7]: stepTour === 7,
          })}>
          {currentWidthScreen >= 768 && <div className={classes.arrowLeft} />}
          <div>
            The feedback section allows you contact us directly to make a suggestion for the program or report a bug
            with the system.
          </div>
          <div className="d-flex justify-content-between mt-4">
            <button
              type="button"
              onClick={() => {
                dispatch(saveStatusShowPartnerTour(false));
                dispatch(handleChangeStepTour({ steps: 6 }));
                router.replace('/trade-in-account/training');
              }}
              className={classes.buttonBack}>
              Back
            </button>
            <button
              type="button"
              className={classes.buttonNext}
              onClick={() => {
                dispatch(saveStatusShowPartnerTour(false));
                dispatch(handleChangeStepTour({ steps: 8 }));
              }}>
              Next
            </button>
          </div>
        </div>
      )}
      {stepTour === 8 && (
        <div
          className={cx(classes.wrapModal, {
            [classes.step8]: stepTour === 8,
          })}>
          {currentWidthScreen >= 768 && <div className={classes.arrowUp} />}
          <div>You can also contact your Bicycle Blue Book representative directly</div>
          <div className="d-flex justify-content-between mt-4">
            <button
              type="button"
              onClick={() => {
                dispatch(saveStatusShowPartnerTour(false));
                dispatch(handleChangeStepTour({ steps: 7 }));
                router.replace('/trade-in-account/feedback');
              }}
              className={classes.buttonBack}>
              Back
            </button>
            <button
              type="button"
              className={classes.buttonNext}
              onClick={() => {
                dispatch(saveStatusShowPartnerTour(false));
                dispatch(handleChangeStepTour({ steps: 9 }));
                router.replace('/trade-in-account/cost-calculator');
              }}>
              Next
            </button>
          </div>
        </div>
      )}

      {stepTour === 8 && currentWidthScreen >= 768 && (
        <div
          className={cx(classes.wrapModalContact, {
            [classes.wrapModalContactMobile]: currentWidthScreen < 768,
          })}>
          <div className={classes.mainTitle}>
            <h2>Contact Your Rep</h2>
            {currentWidthScreen >= 768 && (
              <img className={classes.iconClose} src={images.iconClose} alt={'close-icon'} />
            )}
          </div>
          <div className={classes.title}>{partner?.admin_manager?.name || ''}</div>
          <div className={classes.wrapItem}>
            <div className={classes.wrapImage}>
              <img className={classes.icEmailBlack} src={images.icEmailBlack} alt="Email logo" />
            </div>
            <a href={`mailto:${partner?.admin_manager?.email}`}>{partner?.admin_manager?.email || ''}</a>
          </div>
          {partner?.admin_manager?.phones?.length
            ? partner.admin_manager.phones.map((phone: string, index: number) => (
                <div className={classes.wrapItem} key={phone}>
                  <div className={classes.wrapImage}>
                    <img className={classes.icPhoneBlack} src={images.icPhoneBlack} alt="Phone logo" />
                  </div>
                  <a href={`tel:${phone}`}>{phone}</a>
                </div>
              ))
            : null}
        </div>
      )}

      <Card className={classes.customCard}>
        <div className={classes.cardTitle}>Feedback</div>
        <div className={classes.description}>
          Whether you have a question, would like to report a bug, or have a suggestion—we would love to hear from you.
          For immediate assistance, please contact your rep.
        </div>
        <Formik
          innerRef={formRef}
          onSubmit={onSubmit}
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={FormSchema}>
          {({ values, setValues, validateField, handleSubmit, errors }: FormikProps<FormValue>) => {
            // const handleChangeValue = (data: object) => setValues({ ...values, ...data });
            return (
              <Form onSubmit={handleSubmit}>
                <Row className={classes.wrapItem}>
                  <Col md={3} className={classes.title}>
                    Topic
                  </Col>
                  <Col md={9} className={classes.customForm}>
                    <FormikSelect
                      inputId={'select-state'}
                      options={topicOptions}
                      placeholder="Select a topic"
                      selectStyles={{
                        control: {
                          minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
                        },
                      }}
                      name="reason"
                      isSearchable={true}
                    />
                  </Col>
                </Row>
                <Row className={classes.wrapItem}>
                  <Col md={3} className={classes.title}>
                    Shop Name
                  </Col>
                  <Col md={9} className={classes.customForm}>
                    <FormikInput className={classes.customInput} name="shop_name" />
                  </Col>
                </Row>
                <Row className={classes.wrapItem}>
                  <Col md={3} className={classes.title}>
                    Contact Name
                  </Col>
                  <Col md={9} className={classes.customForm}>
                    <FormikInput className={classes.customInput} name="name" />
                  </Col>
                </Row>
                <Row className={classes.wrapItem}>
                  <Col md={3} className={classes.title}>
                    Email Address
                  </Col>
                  <Col md={9} className={classes.customForm}>
                    <FormikInput className={classes.customInput} name="email" />
                  </Col>
                </Row>
                <Row className={classes.wrapItem}>
                  <Col md={3} className={classes.title}>
                    Phone Number
                  </Col>
                  <Col md={9} className={classes.customForm}>
                    <FormikInput className={classes.customInput} name="phone" />
                  </Col>
                </Row>
                <Row className={classes.wrapItem}>
                  <Col md={3} className={classes.title}>
                    Message
                  </Col>
                  <Col md={9} className={classes.customForm}>
                    <FormikTextarea className={classes.customTextarea} name="message" rows={4} />
                  </Col>
                </Row>

                <Button className={classes.btnSize} type={'submit'}>
                  Send Feedback
                </Button>
              </Form>
            );
          }}
        </Formik>

        {visibleModalThankyou && (
          <Suspense fallback={null}>
            <ModalThankyou isOpen={visibleModalThankyou} onClose={() => setVisibleModalThankyou(false)} />
          </Suspense>
        )}
      </Card>
    </>
  );
};

export default Feedback;
