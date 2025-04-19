/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable import/no-cycle */
import React, { FC, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import images from 'assets/images';
import cx from 'classnames';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Radio from '@ui/Radio';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import { capitalizeEachFirstLetter } from 'helpers/string.helper';
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import { getListTradeInBicycle } from 'store/partner/account/account.action';
import cloneDeep from 'lodash/cloneDeep';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import Skeleton from 'react-loading-skeleton';
import { constStepOneSubStepFiveFormDescription, constTitleStep } from '../../StandardQuote/constraint';
import { TradeInScoreCardsProps } from '../../StandardQuote/formDefaultValue';
import classes from './condition.module.scss';

const ConditionDescriptionModal = React.lazy(() => import('@ui/Condition/ConditionModal'));
interface Props {
  isCompleted: boolean;
  form: TradeInScoreCardsProps;
  formCurrentStep: GetListTradeInBicycleParams;
  onChangeForm: (values: TradeInScoreCardsProps) => void;
  handleAddTradeInDropOffRequest?: () => void;
  setSubStep?: (value: number) => void;
}

const SelectCondition: FC<Props> = ({
  form,
  formCurrentStep,
  isCompleted,
  onChangeForm,
  handleAddTradeInDropOffRequest,
  setSubStep,
}) => {
  const dispatch = useDispatch();
  const dataTradeInBicycle = useSelector((store: StoreState) => store.partner.account.dataTradeInBicycle);
  const loading = useSelector((store: StoreState) => store.partner.account.loading);
  const [selectedHintCondition, setSelectedHintCondition] = useState<string>('');
  const { listDataStepStandardQuote, indexScorecardSelected, type, listDataStepEbikeQuote } = useSelector(
    (state: StoreState) => state.partner.scorecard.createScoreCardQuantityData,
  );

  useEffect(() => {
    if (formCurrentStep.bicycleId) {
      dispatch(getListTradeInBicycle(formCurrentStep));
    }
  }, [dispatch, formCurrentStep]);

  const handleSelectCondition = useCallback(
    (item: any) => {
      if (isCompleted) {
        return;
      }
      onChangeForm({
        ...form,
        condition: item?.condition,
        tradeInValue: item?.tradeInValue,
      });
      const cloneArr =
        type === 'standard' || type === 'red-barn'
          ? cloneDeep(listDataStepStandardQuote)
          : cloneDeep(listDataStepEbikeQuote);
      const keyy = type === 'standard' || type === 'red-barn' ? 'listDataStepStandardQuote' : 'listDataStepEbikeQuote';
      cloneArr[indexScorecardSelected] = {
        ...cloneArr[indexScorecardSelected],
        condition: item?.condition,
        tradeInValue: item?.tradeInValue,
      };
      dispatch(
        scoreCardAction.setCreateScorecardQuantity({
          [keyy]: cloneArr,
        }),
      );
      handleAddTradeInDropOffRequest && handleAddTradeInDropOffRequest();
    },
    [
      dispatch,
      form,
      handleAddTradeInDropOffRequest,
      indexScorecardSelected,
      isCompleted,
      listDataStepEbikeQuote,
      listDataStepStandardQuote,
      onChangeForm,
      type,
    ],
  );

  const handleShowHintCondition = useCallback((condition: string) => {
    setSelectedHintCondition(condition || '');
  }, []);

  const renderLoading = useMemo(() => {
    return (
      <Row className={cx(classes.customRow)}>
        <Col sm={12}>
          <Skeleton width="100%" height={30} />
        </Col>
        <Col sm={12} className="mt-2">
          <Skeleton width="100%" height={30} />
        </Col>
        <Col sm={12} className="mt-2">
          <Skeleton width="100%" height={30} />
        </Col>
        <Col sm={12} className="mt-2">
          <Skeleton width="100%" height={30} />
        </Col>
      </Row>
    );
  }, []);

  const renderFormData = useMemo(() => {
    return dataTradeInBicycle?.conditions?.length
      ? dataTradeInBicycle?.conditions?.map((item, index) => {
          return (
            <div
              className={classes.wrapSubStepFive}
              style={{ paddingBottom: dataTradeInBicycle?.conditions?.length === index + 1 && 'unset' }}>
              <Row className={cx(classes.customRow)} key={item?.condition}>
                <Col lg={2} md={3} sm={6} xs={6} className={classes.customCol}>
                  <div className={classes.wrapRadio}>
                    <Radio
                      checked={form?.condition === item?.condition}
                      className={classes.customCheckbox}
                      disabled={isCompleted}
                      onClick={() => handleSelectCondition(item)}
                    />
                    <div onClick={() => handleSelectCondition(item)} className={classes.radioTitle}>
                      {capitalizeEachFirstLetter(item?.condition || '')}
                    </div>
                    <div className={classes.wrapbtnImgInfo}>
                      <img
                        onClick={() => handleShowHintCondition(item?.condition)}
                        className={classes.iconInfo}
                        src={images.marketplace.iconInfoWhite}
                        alt="icon-info"
                      />
                    </div>
                  </div>
                </Col>
                <Col lg={2} md={3} sm={6} xs={6} className={cx(classes.customCol, classes.isSmallScreen)}>
                  <div className={classes.wrapTitle}>{`${item?.percent * 100}% of bicycles`}</div>
                </Col>
                <Col lg={8} md={7} sm={12} xs={12} className={classes.customCol}>
                  <div onClick={() => handleSelectCondition(item)} className={classes.description}>
                    {item?.condition ? constStepOneSubStepFiveFormDescription[item?.condition] : ''}
                  </div>
                </Col>
                <Col
                  onClick={() => handleSelectCondition(item)}
                  lg={2}
                  md={2}
                  sm={6}
                  xs={6}
                  className={cx(classes.customCol, classes.isLargeScreen)}>
                  <div className={classes.wrapTitle}>{`${item?.percent * 100}% of bicycles`}</div>
                </Col>
              </Row>
            </div>
          );
        })
      : null;
  }, [dataTradeInBicycle, form, handleSelectCondition, handleShowHintCondition, isCompleted]);

  return (
    <div className={classes.wrapSelectCondition}>
      <div className={classes.headerStepCondition}>{constTitleStep.StepOneSubStepFive}</div>
      {loading ? renderLoading : renderFormData}
      <div className={classes.wrapBottom} />
      <Suspense fallback={null}>
        {selectedHintCondition !== '' && (
          <ConditionDescriptionModal
            isOpen={selectedHintCondition !== ''}
            onClose={() => setSelectedHintCondition('')}
            condition={selectedHintCondition}
          />
        )}
      </Suspense>
    </div>
  );
};

export default SelectCondition;
