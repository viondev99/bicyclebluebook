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
import { getBrandFromYearModelRedBarn } from 'store/value-guide/value-guide.action';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import cloneDeep from 'lodash/cloneDeep';
import { constTitleStep } from 'components/PartnerPortal/TradeInScoreCard/StandardQuote/constraint';
import { TradeInScoreCardsProps } from '../../formDefaultValue';
import ModelSelect from '../../../TradeInScoreCardComponent/ModelSelect';
import classes from './sub-step-two.module.scss';

interface FormValue {
  brand: string;
  familyName: string;
  frameSize: string;
}

interface Props {
  formStepOneStepTwoRef: any;
  form: TradeInScoreCardsProps;
  handleSubmitStepOneSubStepTwo: () => void;
  setFormStepOneSubStepThree: (values: GetListTradeInBicycleParams) => void;
  onChangeForm: (values: TradeInScoreCardsProps) => void;
  isCompleted: boolean;
  gotoCustomQuote: () => void;
}

const SubStepTwo: FC<Props> = ({
  form,
  formStepOneStepTwoRef,
  isCompleted,
  onChangeForm,
  handleSubmitStepOneSubStepTwo,
  setFormStepOneSubStepThree,
  gotoCustomQuote,
}) => {
  const { currentWidthScreen } = useScreenDetect();
  const dispatch = useDispatch();
  const brands = useSelector((store: StoreState) => store.valueGuide.baseComponent?.branchYearModel);
  const { indexScorecardSelected, listDataStepStandardQuote } = useSelector(
    (state: StoreState) => state.partner.scorecard.createScoreCardQuantityData,
  );

  const initialValues: FormValue = {
    brand: form.brand,
    familyName: form.familyName,
    frameSize: form.frameSize,
  };

  const brandOptions = useMemo(() => {
    return brands?.length > 0 ? sortFilterBrand(brands, true) : [];
  }, [brands]);

  useEffect(() => {
    dispatch(getBrandFromYearModelRedBarn());
    dispatch(getComponents([CommonComponents.DetailBicycleMyListing]));
  }, [dispatch]);

  const handleChangeFormik = useCallback(
    (key: string, value: string) => {
      const cloneArr = cloneDeep(listDataStepStandardQuote);
      const objChange: any = {
        brandId: '',
        chargerIncluded: null,
        ebikeSubtypeId: -1,
        hasKey: null,
        modelId: '',
        yearId: '',
        bicycleId: '',
      };
      cloneArr[indexScorecardSelected] = {
        ...cloneArr[indexScorecardSelected],
        ...objChange,
        [key]: value,
      };

      setFormStepOneSubStepThree(objChange);

      dispatch(
        scoreCardAction.setCreateScorecardQuantity({
          listDataStepStandardQuote: cloneArr,
        }),
      );

      onChangeForm({
        ...form,
        [key]: value,
      });
    },
    [dispatch, form, indexScorecardSelected, listDataStepStandardQuote, onChangeForm, setFormStepOneSubStepThree],
  );

  return (
    <Formik
      innerRef={formStepOneStepTwoRef}
      onSubmit={handleSubmitStepOneSubStepTwo}
      initialValues={initialValues}
      enableReinitialize={true}>
      {({ values, setValues, validateField, handleSubmit, errors }: FormikProps<FormValue>) => {
        return (
          <Form onSubmit={handleSubmit}>
            <div className={classes.headerStep}>{constTitleStep.StepOneSubStepTwo}</div>
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
                      disabled={isCompleted}
                    />
                  </div>
                </Col>
                <Col md={6} className={classes.customCol}>
                  <div className={classes.wrapTitle}>Product Family</div>
                  <div>
                    <ModelSelect
                      brand={values.brand}
                      handleChangeFormik={handleChangeFormik}
                      isCompleted={isCompleted}
                      isClearable={true}
                    />
                  </div>
                </Col>
              </Row>
              <div className={classes.bottomDescription}>Not sure of the exact model?</div>
              <div className={classes.bottomDescription}>
                Enter the brand to see a list of product families and the years they were made.
              </div>
            </div>

            <div className={cx(classes.textBottomLeft, classes.my18)}>
              Bikes not listed in our database require a<span onClick={gotoCustomQuote}>custom quote.</span>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SubStepTwo;
