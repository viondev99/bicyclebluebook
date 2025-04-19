/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-key */
import Button from '@ui/Buttons/Primary/Button';
import Modal from '@ui/Modal/Modal';
import cx from 'classnames';
import FormikInput from 'components/Formik/Input/FormikInput';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import { Form, Formik, FormikProps } from 'formik';
import { exceptionKeyInputNumber } from 'helpers/utilities.helper';
import useScreenDetect from 'hooks/useScreenDetect';
import React, { FC, memo, useCallback, useRef } from 'react';
import * as Yup from 'yup';
import images from '@images';
import classes from './modal-decline-step-one.module.scss';

export interface ModalDeclineStepOneFormValue {
  comment: string;
  reasonDeclineId: string;
  priceExpected: string | number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleDeclineStepOne: (value: ModalDeclineStepOneFormValue) => void;
}

const initialValues = {
  comment: '',
  reasonDeclineId: '',
  priceExpected: '',
};

const ReasonOptions = [
  { label: 'Select Reason', value: '' },
  { label: 'Not serious, just curious', value: '1' },
  { label: 'Offer too low', value: '3' },
];

const ModalContactRep: FC<Props> = ({ isOpen, onClose, handleDeclineStepOne }) => {
  const formRef = useRef<FormikProps<ModalDeclineStepOneFormValue>>();
  const { currentWidthScreen } = useScreenDetect();

  const FormSchema = () =>
    Yup.object().shape({
      reasonDeclineId: Yup.string().required(`Please select reason.`),
      priceExpected:
        formRef?.current?.values?.reasonDeclineId === '3' && Yup.string().required(`Expectation Price is required.`),
    });

  const onSubmit = useCallback(
    (values: ModalDeclineStepOneFormValue) => {
      handleDeclineStepOne(values);
      onClose();
    },
    [handleDeclineStepOne, onClose],
  );

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
      title={`Reason Customer Declined`}>
      <Formik
        innerRef={formRef}
        onSubmit={onSubmit}
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={() => FormSchema()}>
        {({ values, setValues, validateField, handleSubmit, errors }: FormikProps<ModalDeclineStepOneFormValue>) => {
          // const handleChangeValue = (data: object) => setValues({ ...values, ...data });
          return (
            <Form onSubmit={handleSubmit}>
              <div className={classes.wrapForm}>
                <div className={classes.wrapFormItem}>
                  <div className={classes.titleForm}>Reason*</div>
                  <div className={classes.wrapItem}>
                    <FormikSelect
                      inputId={'select-state'}
                      options={ReasonOptions}
                      placeholder="Select Brand"
                      selectStyles={{
                        control: {
                          minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
                        },
                      }}
                      name="reasonDeclineId"
                      isSearchable={true}
                    />
                  </div>
                  {values.reasonDeclineId === '3' && (
                    <>
                      <div className={classes.titleForm}>Expectation Price*</div>
                      <div className={classes.wrapItem}>
                        <FormikInput
                          name="priceExpected"
                          inputClassName={classes.customInputNumber}
                          className={cx(classes.customButtonSize, classes.customTextSize)}
                          renderPrefix={<img src={images.listing.icDollarListing} alt="icDollarListing" />}
                          placeholder="0"
                          type="number"
                          maxLength={100}
                          onKeyDown={(e) => {
                            if (exceptionKeyInputNumber.includes(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          onWheel={(e: any) => e.target.blur()}
                          style={{
                            minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
                          }}
                        />
                      </div>
                    </>
                  )}
                  <div className={classes.titleForm}>Additional Comments</div>
                  <div className={classes.wrapItem}>
                    <FormikTextarea
                      className={classes.customTextSize}
                      name={'comment'}
                      rows={6}
                      placeholder="Anything else we should know?"
                    />
                  </div>
                </div>
                <div className={classes.wrapBottom}>
                  <Button
                    buttonType="danger"
                    className={classes.customButtonSize}
                    onClick={() => formRef.current.handleSubmit()}>
                    Decline
                  </Button>
                  <Button buttonType="outline" className={classes.customButtonSize} onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default memo(ModalContactRep);
