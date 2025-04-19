/* eslint-disable no-unused-expressions */
import React, { FC, memo, useCallback, useMemo, useRef } from 'react';
import FormikInput from 'components/Formik/Input/FormikInput';
import Modal from '@ui/Modal/Modal';
import useScreenDetect from 'hooks/useScreenDetect';
import Button from '@ui/Buttons/Primary/Button';
import cx from 'classnames';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import FormikTextMask from 'components/Formik/TextMask/FormikTextMask';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import t from 'helpers/language';
import { RegexEmail, RegexPhone } from 'helpers/constraint.helper';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import { saveNotesQuote } from 'store/partner/account/account.action';
import classes from './modal-save-as-quote.module.scss';
import { SaveAsQuoteData } from '../formDefaultValue';

interface Props {
  isOpen: boolean;
  note?: string;
  onClose: () => void;
  setNotes?: (value: string) => void;
  handleSubmitModalSaveAsQuote: (value: SaveAsQuoteData) => void;
}

const RegisterSchema = Yup.object().shape({
  owner_first_name: Yup.string()
    .required(t('common.validate.firstNameRequired'))
    .max(250, t('myAccount.profile.validate.storeNameLength')),
  owner_last_name: Yup.string()
    .required(t('common.validate.lastNameRequired'))
    .max(250, t('myAccount.profile.validate.storeNameLength')),
  customer_email: Yup.string()
    .required(t('myAccount.profile.validate.shopEmail'))
    .matches(RegexEmail, t('authenticate.validate.emailInvalid')),
  customer_phone: Yup.string()
    .required(t('common.validate.phoneNumberRequired'))
    .matches(RegexPhone, t('common.validate.phoneInvalid')),
  shop_employee: Yup.string()
    .required(t('partnerPortal.scorecard.validate.shopEmployee'))
    .max(250, t('myAccount.profile.validate.storeNameLength')),
  notes: Yup.string().max(1000, t('myAccount.profile.validate.storeNameLength')),
});

const ModalSaveAsQuote: FC<Props> = (props) => {
  const { isOpen, onClose, handleSubmitModalSaveAsQuote, note } = props;
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const { currentWidthScreen } = useScreenDetect();
  const { detailPartner, detailScoreCard } = useSelector((store: StoreState) => ({
    detailPartner: store?.partner?.account?.detailPartnerLocation,
    detailScoreCard: store?.partner?.scorecard?.dataStepSummaryStandardQuote,
  }));
  const initialValues: SaveAsQuoteData = useMemo(() => {
    return {
      customer_name: '',
      owner_first_name: '',
      owner_last_name: '',
      customer_email: '',
      customer_phone: '',
      shop_employee: detailPartner?.name || '',
      notes: note || '',
    };
  }, [detailPartner]);

  const handleFormSubmit = useCallback(
    (values: SaveAsQuoteData) => {
      handleSubmitModalSaveAsQuote(values);
      dispatch(saveNotesQuote(''));
      formRef.current?.resetForm();
      onClose();
    },
    [dispatch, handleSubmitModalSaveAsQuote, onClose],
  );

  const handleChange = useCallback(
    (value: string, formName: string) => {
      switch (formName) {
        case 'owner_first_name': {
          formRef.current?.setFieldValue('customer_name', `${value} ${formRef?.current?.values?.owner_last_name}`);
          break;
        }
        case 'owner_last_name':
          formRef.current?.setFieldValue('customer_name', `${formRef?.current?.values?.owner_first_name} ${value}`);
          break;

        case 'notes':
          formRef.current?.setFieldValue('notes', `${value}`);
          dispatch(saveNotesQuote(value));
          break;

        default:
          break;
      }
    },
    [dispatch],
  );

  const renderNotes = useMemo(() => {
    return (
      <Row className={classes.wrapperInput}>
        <Col xs={12} sm={4}>
          <div className={classes.label}>Notes</div>
        </Col>
        <Col xs={12} sm={8}>
          <FormikTextarea
            name={'notes'}
            onChange={(e) => {
              handleChange(e.target.value, 'notes');
            }}
            rows={6}
            maxLength={1000}
          />
        </Col>
      </Row>
    );
  }, [handleChange]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      centered={true}
      titleClassName={classes.titleClassName}
      className={classes.customModalSize}
      contentClassName={classes.paddingContentClassName}
      bodyProps={{
        className: classes.customModalBody,
      }}
      icArrowLeftClassName={classes.icArrowLeftClassName}
      hideButtonClose={true}
      showButtonCloseXBlackLeft={currentWidthScreen <= 767}
      title={`Save Quote`}>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={RegisterSchema}
        validate={null}
        innerRef={formRef}>
        {({ isValid, handleSubmit }: FormikProps<any>) => (
          <Form onSubmit={handleSubmit}>
            <div className={classes.wrapFormItem}>
              <Row className={classes.wrapperInput}>
                <Col xs={12} sm={4}>
                  <div className={classes.label}>Customer First name*</div>
                </Col>
                <Col xs={12} sm={8}>
                  <FormikInput
                    name="owner_first_name"
                    onChange={(e) => handleChange(e.target.value, 'owner_first_name')}
                    maxLength={127}
                  />
                </Col>
              </Row>
              <Row className={classes.wrapperInput}>
                <Col xs={12} sm={4}>
                  <div className={classes.label}>Customer Last name*</div>
                </Col>
                <Col xs={12} sm={8}>
                  <FormikInput
                    name="owner_last_name"
                    onChange={(e) => handleChange(e.target.value, 'owner_last_name')}
                    maxLength={127}
                  />
                </Col>
              </Row>
              <Row className={classes.wrapperInput}>
                <Col xs={12} sm={4}>
                  <div className={classes.label}>Customer Email*</div>
                </Col>
                <Col xs={12} sm={8}>
                  <FormikInput name="customer_email" maxLength={80} />
                </Col>
              </Row>
              <Row className={classes.wrapperInput}>
                <Col xs={12} sm={4}>
                  <div className={classes.label}>Customer Phone*</div>
                </Col>
                <Col xs={12} sm={8}>
                  <FormikTextMask name="customer_phone" typeMask="phone" />
                </Col>
              </Row>
              <Row className={classes.wrapperInput}>
                <Col xs={12} sm={4}>
                  <div className={classes.label}>Shop Employee*</div>
                </Col>
                <Col xs={12} sm={8}>
                  <FormikInput name="shop_employee" maxLength={255} />
                </Col>
              </Row>
              {renderNotes}
            </div>
            <div className={cx(classes.wrapFooter, 'text-left d-flex mt-4')}>
              <Button type={'submit'}>Save Quote</Button>
              <Button className={classes.buttonInfo} buttonType={'outline'} onClick={onClose}>
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default memo(ModalSaveAsQuote);
