/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-key */
import Button from '@ui/Buttons/Primary/Button';
import Modal from '@ui/Modal/Modal';
import { createFeedbackByScorecardRequest } from 'api/partner/scorecard.api';
import FormikInput from 'components/Formik/Input/FormikInput';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import { Form, Formik, FormikProps } from 'formik';
import t from 'helpers/language';
import { toastSuccess } from 'helpers/utils.helper';
import useScreenDetect from 'hooks/useScreenDetect';
import StoreState from 'model/store';
import { CommonComponents } from 'model/store/common.model';
import { useRouter } from 'next/router';
import React, { FC, memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getComponents } from 'store/common/common.action';
import { getBaseComponent } from 'store/value-guide/value-guide.action';
import * as Yup from 'yup';
import classes from './modal-trade-in-feedback.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  getDefaultFeedback: () => void;
}

interface FormValues {
  message: string;
  type: string;
  make: string;
  bikeType: string;
  model: string;
}

const initialValues = {
  message: '',
  type: '',
  make: '',
  bikeType: '',
  model: '',
};

const subjectOptions = [
  {
    value: 'new_bike',
    label: 'New Bike',
  },
  {
    value: 'merchandise',
    label: 'Merchandise',
  },
  {
    value: 'undecided',
    label: 'Undecided',
  },
];

const ModalTradeInFeedback: FC<Props> = ({ isOpen, onClose, getDefaultFeedback }) => {
  const { currentWidthScreen } = useScreenDetect();
  const formRef = useRef<FormikProps<FormValues>>();
  const { query } = useRouter();
  const dispatch = useDispatch();
  const components = useSelector((store: StoreState) => store.common.components);

  const ValidateSchema = () =>
    Yup.object().shape({
      type: Yup.string().required(`Please select a topic`),
      message: Yup.string().required(`Message is required`),
      make: formRef?.current?.values?.type === 'new_bike' && Yup.string().required(`Please select a make`),
      bikeType: formRef?.current?.values?.type === 'new_bike' && Yup.string().required(`Please select a type`),
      model: formRef?.current?.values?.type === 'new_bike' && Yup.string().required(t('common.validate.modelRequired')),
    });

  const typeBikeOptions = useMemo(() => {
    return components?.type?.map((it) => {
      return {
        value: `${it.id}`,
        label: it.name,
      };
    });
  }, [components]);

  const makeOptions = useMemo(() => {
    return components?.allBrandBicycle?.map((it) => {
      return {
        value: `${it.id}`,
        label: it.name,
      };
    });
  }, [components]);

  useEffect(() => {
    handleGetDefault();
  }, []);

  const handleGetDefault = useCallback(() => {
    dispatch(getBaseComponent());
    dispatch(getComponents([CommonComponents.AllBrandBicycle, CommonComponents.BicycleType]));
  }, [dispatch]);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      if (values.type !== 'new_bike') {
        await createFeedbackByScorecardRequest({
          scorecardid: `${query?.id}`,
          message: values.message,
          type: values.type,
        });
      } else {
        const findBikeType = components?.type.find((it) => `${it.id}` === values.bikeType);
        const findBikeMake = components?.allBrandBicycle.find((it) => `${it.id}` === values.make);
        await createFeedbackByScorecardRequest({
          scorecardid: `${query?.id}`,
          bike: {
            brand: findBikeMake,
            bike_type: findBikeType,
            model: values.model,
          },
          message: values.message,
          type: values.type,
        });
      }
      await getDefaultFeedback();
      toastSuccess(t('partnerPortal.scorecard.feedbackSuccess'), t('seoTitle.success'));
      onClose();
    },
    [components, getDefaultFeedback, onClose, query],
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
      title={`Trade in Feedback`}>
      <Formik
        enableReinitialize={true}
        onSubmit={onSubmit}
        initialValues={initialValues}
        innerRef={formRef}
        validationSchema={() => ValidateSchema()}>
        {({ handleSubmit, values }: FormikProps<FormValues>) => (
          <Form onSubmit={handleSubmit} className={'mt-4'}>
            <div className={classes.wrapForm}>
              <div className={classes.formItem}>
                <div className={classes.title}>Subject*</div>
                <FormikSelect
                  inputId={'select-state'}
                  options={subjectOptions}
                  placeholder="Select a subject"
                  selectStyles={{
                    control: {
                      minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
                    },
                  }}
                  name="type"
                  isSearchable={true}
                />
              </div>
              {values.type === 'new_bike' && (
                <>
                  <div className={classes.formItem}>
                    <div className={classes.title}>Make*</div>
                    <FormikSelect
                      inputId={'select-state'}
                      options={makeOptions}
                      placeholder="Select a make"
                      selectStyles={{
                        control: {
                          minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
                        },
                      }}
                      name="make"
                      isSearchable={true}
                    />
                  </div>
                  <div className={classes.formItem}>
                    <div className={classes.title}>Type*</div>
                    <FormikSelect
                      inputId={'select-state'}
                      options={typeBikeOptions}
                      placeholder="Select a type"
                      selectStyles={{
                        control: {
                          minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
                        },
                      }}
                      name="bikeType"
                      isSearchable={true}
                    />
                  </div>
                  <div className={classes.formItem}>
                    <div className={classes.title}>Model*</div>
                    <FormikInput name="model" className={classes.customButtonSize} placeholder="Input your model" />
                  </div>
                </>
              )}
              <div className={classes.formItem}>
                <div className={classes.title}>Feedback*</div>
                <FormikTextarea
                  placeholder="What would you like us to know?"
                  name="message"
                  rows={currentWidthScreen > 767 ? 6 : 4}
                />
              </div>
              <div className={classes.wrapBottom}>
                <Button className={classes.customButtonSize} type="submit">
                  Send
                </Button>
                <Button buttonType="outline" className={classes.customButtonSize} onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default memo(ModalTradeInFeedback);
