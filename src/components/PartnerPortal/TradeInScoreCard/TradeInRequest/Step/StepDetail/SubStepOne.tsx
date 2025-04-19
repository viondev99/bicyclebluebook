/* eslint-disable import/no-cycle */
/* eslint-disable no-nested-ternary */
import cx from 'classnames';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import { Form, Formik, FormikProps } from 'formik';
import { sortFilterBrand } from 'helpers/utilities.helper';
import useScreenDetect from 'hooks/useScreenDetect';
import StoreState from 'model/store';
import { CommonComponents } from 'model/store/common.model';
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { getComponents } from 'store/common/common.action';
import { getBrandFromYearModel } from 'store/value-guide/value-guide.action';
import { getStepDetailStandardQuoteRequest } from 'api/partner/scorecard.api';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import { useRouter } from 'next/router';
import { TradeInScoreCardsProps } from '../../formDefaultValue';
import ModelSelect from '../../ModelSelect';
import { constTitleStep } from '../../constraint';
import classes from './sub-step-one.module.scss';

interface FormValue {
  brand: string;
  familyName: string;
  frameSize: string;
}
interface Props {
  formStepDetailsSubStepOneRef: any;
  form: TradeInScoreCardsProps;
  handleSubmitStepSummarySubStepOne: () => void;
  setFormStepDetailSubStepTwo: (values: GetListTradeInBicycleParams) => void;
  onChangeForm: (values: TradeInScoreCardsProps) => void;
  isCompleted: boolean;
  gotoCustomQuote: () => void;
}

const SubStepOne: FC<Props> = ({
  form,
  formStepDetailsSubStepOneRef,
  isCompleted,
  onChangeForm,
  handleSubmitStepSummarySubStepOne,
  setFormStepDetailSubStepTwo,
  gotoCustomQuote,
}) => {
  const { currentWidthScreen } = useScreenDetect();
  const dispatch = useDispatch();
  const { query } = useRouter();
  const brands = useSelector((store: StoreState) => store.valueGuide.baseComponent?.branchYearModel);
  const initialValues: FormValue = {
    brand: form.brand,
    familyName: form.familyName,
    frameSize: form.frameSize,
  };

  const brandOptions = useMemo(() => {
    return brands?.length > 0 ? sortFilterBrand(brands) : [];
  }, [brands]);

  useEffect(() => {
    dispatch(getBrandFromYearModel(false));
    dispatch(scoreCardAction.getStepDetailRequest(`${query?.tradeInId}`));
    dispatch(getComponents([CommonComponents.DetailBicycleMyListing]));
  }, [dispatch, query]);

  const handleChangeFormik = useCallback(
    (key: string, value: string) => {
      if (key !== 'frameSize') {
        setFormStepDetailSubStepTwo({
          brandId: '',
          chargerIncluded: null,
          ebikeSubtypeId: -1,
          hasKey: null,
          isEbike: null,
          modelId: '',
          yearId: '',
          bicycleId: '',
          eBikeHours: '',
          brand: '',
          familyName: '',
          upgradeCompIds: [],
          condition: '',
          tradeInValue: '',
          frameSize: '',
        });
      }
      onChangeForm({
        ...form,
        [key]: value,
      });
    },
    [form, onChangeForm, setFormStepDetailSubStepTwo],
  );

  return (
    <Formik
      innerRef={formStepDetailsSubStepOneRef}
      onSubmit={handleSubmitStepSummarySubStepOne}
      initialValues={initialValues}
      enableReinitialize={true}>
      {({ values, setValues, validateField, handleSubmit, errors }: FormikProps<FormValue>) => {
        return (
          <Form onSubmit={handleSubmit}>
            <div className={classes.wrapSubStepTwo}>
              <Row className={classes.customRow}>
                <Col md={6} className={classes.customCol}>
                  <div className={classes.wrapTitle}>Brand*</div>
                  <div>
                    <FormikSelect
                      inputId={'select-state'}
                      options={brandOptions}
                      placeholder="Select Brand"
                      selectStyles={{
                        control: {
                          minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
                        },
                      }}
                      name="brand"
                      isSearchable={true}
                      onChangeValue={(value) => handleChangeFormik('brand', value)}
                      disabled={!isCompleted}
                    />
                  </div>
                </Col>
                <Col md={6} className={classes.customCol}>
                  <div className={classes.wrapTitle}>Product Family*</div>
                  <div>
                    <ModelSelect
                      brand={values.brand}
                      handleChangeFormik={handleChangeFormik}
                      isCompleted={!isCompleted}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SubStepOne;
