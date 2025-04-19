/* eslint-disable no-nested-ternary */
/* eslint-disable import/named */
/* eslint-disable import/no-cycle */
import Button from '@ui/Buttons/Primary/Button';
import { getStepSummaryRedBarnQuoteRequest } from 'api/partner/scorecard.api';
import cx from 'classnames';
import { constTitleStep } from 'components/PartnerPortal/TradeInScoreCard/StandardQuote/constraint';
import { ModalDeclineStepOneFormValue } from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalDeclineStepOne';
import { formatCurrency } from 'helpers/string.helper';
import { getTradeInPrice } from 'helpers/utilities.helper';
import StoreState from 'model/store';
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import { useRouter } from 'next/router';
import React, { FC, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { getListTradeInBicycle } from 'store/partner/account/account.action';
import { TradeInScoreCardsProps } from '../../formDefaultValue';
import classes from './sub-step-six.module.scss';

const ModalDeclineStepOne = React.lazy(() =>
  import('components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalDeclineStepOne'),
);
const ModalCostCalculator = React.lazy(() =>
  import('components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalCostCalculator'),
);

interface Props {
  form: TradeInScoreCardsProps;
  isCompleted: boolean;
  formStepOneSubStepThree: GetListTradeInBicycleParams;
  handleSubmitStandardQuoteStepOneNextToStepTwo: (isInstantPayout: boolean) => void;
  handleDeclineStepOne: (value: ModalDeclineStepOneFormValue) => void;

  statusHistoryQuote: string;
}

const SubStepSix: FC<Props> = ({
  form,
  isCompleted,
  formStepOneSubStepThree,
  handleSubmitStandardQuoteStepOneNextToStepTwo,
  handleDeclineStepOne,
  statusHistoryQuote,
}) => {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const dataTradeInBicycle = useSelector((store: StoreState) => store.partner.account.dataTradeInBicycle);
  // disable instant payout
  const { isInstantPayout } = { isInstantPayout: false };
  const detailPartnerLocation = useSelector((store: StoreState) => store.partner.account.detailPartnerLocation);
  const isLoading = useSelector((store: StoreState) => store.partner.scorecard.loading);
  const isLoadingDataBicycle = useSelector((store: StoreState) => store.partner.account.loading);
  const [visibleModalDecline, setVisibleModalDecline] = useState(false);
  const [visibleModalCostCalculator, setVisibleModalCostCalculator] = useState(false);
  const dataStepDetailStandardQuote = useSelector(
    (store: StoreState) => store.partner.scorecard.dataStepDetailStandardQuote,
  );
  const [checkIsInstantPayout, setCheckIsInstantPayout] = useState<boolean>(false);

  const handleGetDataStepOne = useCallback(async () => {
    const responseStepTwo = await getStepSummaryRedBarnQuoteRequest(`${query?.id}`);
    setCheckIsInstantPayout(responseStepTwo?.isInstantPayout);
  }, [query]);

  useEffect(() => {
    if (query?.id) {
      handleGetDataStepOne();
    }
  }, [handleGetDataStepOne, query]);

  const scoreCardSetting = useMemo(() => {
    return detailPartnerLocation?.is_enable_adjustment ? detailPartnerLocation?.score_card : null;
  }, [detailPartnerLocation]);

  const getWheelsOrDrivetrain = useCallback(
    (name: string) => {
      if (
        form?.upgradeCompIds &&
        Array.isArray(form?.upgradeCompIds) &&
        form?.upgradeCompIds.length &&
        dataTradeInBicycle?.upgradeComps?.length
      ) {
        const upgradeCompIds: any = form?.upgradeCompIds || [];
        const selectedUpgradeCompIds = upgradeCompIds.find((it: any) => it.key === name);
        const nameConvert = dataTradeInBicycle?.upgradeComps.find((it) => it.id === selectedUpgradeCompIds?.value);
        return nameConvert?.up === true ? 'up' : nameConvert?.up === false ? 'down' : '';
      }
      return '';
    },
    [dataTradeInBicycle, form],
  );

  const tradeInValue = useMemo(() => {
    if (form && dataTradeInBicycle) {
      const msrp = dataTradeInBicycle.msrp || 0;
      const condition: { tradeInValue: number } = dataTradeInBicycle.conditions.find(
        (item: any) => item.condition === form?.condition,
      );

      const Wheels = getWheelsOrDrivetrain('Wheels');
      const Drivetrain = getWheelsOrDrivetrain('Drivetrain');

      return getTradeInPrice(
        condition?.tradeInValue ? Number(condition.tradeInValue) : 0,
        Wheels,
        Drivetrain,
        null,
        msrp,
        scoreCardSetting ? -(scoreCardSetting?.shipping + scoreCardSetting?.handling) : 0,
      );
    }
    return 0;
  }, [dataTradeInBicycle, form, getWheelsOrDrivetrain, scoreCardSetting]);

  useEffect(() => {
    if (formStepOneSubStepThree.bicycleId) {
      dispatch(getListTradeInBicycle(formStepOneSubStepThree));
    }
  }, [dispatch, formStepOneSubStepThree]);

  const handleViewCostCalculator = useCallback(() => {
    setVisibleModalCostCalculator(true);
  }, []);

  const renderComplete = useMemo(() => {
    switch (checkIsInstantPayout) {
      case true:
        return (
          <Row>
            <Col lg={12} className={classes.wrapContainer}>
              <div className={classes.headerStep}>{constTitleStep.StepOneSubStepSixInstantPayout}</div>
              <div className={classes.tradeInValue}>
                {`${formatCurrency((Number(dataStepDetailStandardQuote?.tradeValue) * 90) / 100)}` || ''}
              </div>
            </Col>
          </Row>
        );

      default:
        return (
          <Row>
            <Col lg={12} className={classes.wrapContainer}>
              <div className={classes.headerStep}>{constTitleStep.StepOneSubStepSix}</div>
              <div className={classes.tradeInValue}>
                {isLoadingDataBicycle || isLoading ? (
                  <Skeleton width={100} height={40} />
                ) : (
                  <span>{`${formatCurrency(dataStepDetailStandardQuote?.tradeValue)}` || `$0`}</span>
                )}
              </div>
            </Col>
          </Row>
        );
    }
  }, [checkIsInstantPayout, dataStepDetailStandardQuote, isLoading, isLoadingDataBicycle]);

  const renderInfoCompleted = useMemo(() => {
    if (isCompleted || statusHistoryQuote !== '') {
      return renderComplete;
    }
    return (
      <Row>
        <Col lg={!isInstantPayout ? 12 : 6} className={classes.wrapContainer}>
          <div className={classes.headerStep}>{constTitleStep.StepOneSubStepSix}</div>

          <div className={classes.tradeInValue}>
            {isLoadingDataBicycle ? (
              <Skeleton width={100} height={50} />
            ) : (
              <span>{`${formatCurrency(tradeInValue)}` || `$0`}</span>
            )}
          </div>

          {!isCompleted && (
            <div className={classes.wrapButton}>
              <Button
                disabled={isLoading || isLoadingDataBicycle}
                buttonType="success"
                className={classes.customButtonSize}
                onClick={() => handleSubmitStandardQuoteStepOneNextToStepTwo(false)}>
                Accept
              </Button>
              {!isInstantPayout && statusHistoryQuote === '' && (
                <Button
                  disabled={isLoading || isLoadingDataBicycle}
                  buttonType="danger"
                  className={cx(classes.customButtonSize, classes.customWidthButtonDecline, classes.mr30)}
                  onClick={() => setVisibleModalDecline(true)}>
                  Decline
                </Button>
              )}
            </div>
          )}
        </Col>

        {isInstantPayout && (
          <Col lg={6} className={classes.wrapContainer}>
            <div className={classes.headerStep}>{constTitleStep.StepOneSubStepSixInstantPayout}</div>
            <div className={classes.tradeInValue}>{`${formatCurrency((Number(tradeInValue) * 90) / 100)}` || ''}</div>
            {!isCompleted && (
              <div className={classes.wrapButton}>
                <Button
                  buttonType="success"
                  className={classes.customButtonSize}
                  onClick={() => handleSubmitStandardQuoteStepOneNextToStepTwo(true)}>
                  Accept
                </Button>
              </div>
            )}
          </Col>
        )}
      </Row>
    );
  }, [
    handleSubmitStandardQuoteStepOneNextToStepTwo,
    isCompleted,
    isInstantPayout,
    isLoading,
    isLoadingDataBicycle,
    renderComplete,
    statusHistoryQuote,
    tradeInValue,
  ]);

  return (
    <div>
      {renderInfoCompleted}

      <Row className={classes.wrapContainer}>
        {isInstantPayout && !isCompleted && statusHistoryQuote === '' && (
          <Button
            buttonType="danger"
            className={cx(classes.customButtonSize, classes.customWidthButtonDecline)}
            onClick={() => setVisibleModalDecline(true)}>
            Decline
          </Button>
        )}
        <div onClick={handleViewCostCalculator} className={classes.viewCost}>
          View Cost Calculator
        </div>
      </Row>

      {visibleModalDecline && (
        <Suspense fallback={null}>
          <ModalDeclineStepOne
            isOpen={visibleModalDecline}
            onClose={() => setVisibleModalDecline(false)}
            handleDeclineStepOne={handleDeclineStepOne}
          />
        </Suspense>
      )}
      {visibleModalCostCalculator && (
        <Suspense fallback={null}>
          <ModalCostCalculator
            isOpen={visibleModalCostCalculator}
            form={form}
            formDetailBike={formStepOneSubStepThree}
            onClose={() => setVisibleModalCostCalculator(false)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default SubStepSix;
