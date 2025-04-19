/* eslint-disable no-nested-ternary */
/* eslint-disable import/named */
/* eslint-disable import/no-cycle */
import Button from '@ui/Buttons/Primary/Button';
import cx from 'classnames';
import { ModalDeclineStepOneFormValue } from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalDeclineStepOne';
import { formatCurrency } from 'helpers/string.helper';
import { useGetInfoPartner } from 'hooks/useGetInfoPartner';
import StoreState from 'model/store';
import { useRouter } from 'next/router';
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import React, { FC, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { getListTradeInBicycle } from 'store/partner/account/account.action';
import { getTradeInPrice } from 'helpers/utilities.helper';
import { getStepSummaryStandardQuoteRequest } from 'api/partner/scorecard.api';
import { TradeInScoreCardsProps } from '../../formDefaultValue';
import { constTitleStep } from '../../constraint';
import classes from './sub-step-six.module.scss';
import { SaveAsQuoteData } from '../../../StandardQuote/formDefaultValue';

const ModalDeclineStepOne = React.lazy(() =>
  import('components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalDeclineStepOne'),
);
const ModalCostCalculator = React.lazy(() =>
  import('components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalCostCalculator'),
);
const ModalSaveAsQuote = React.lazy(() =>
  import('components/PartnerPortal/TradeInScoreCard/StandardQuote/ModalSaveAsQuote'),
);
interface Props {
  form: TradeInScoreCardsProps;
  isCompleted: boolean;
  formStepDetailSubStepTwo: GetListTradeInBicycleParams;
  handleSubmitStandardQuoteStepOneNextToStepTwo: (isInstantPayout: boolean) => void;
  handleDeclineStepOne: (value: ModalDeclineStepOneFormValue) => void;
  handleSubmitModalSaveAsQuote: (value: SaveAsQuoteData) => void;
}

const SubStepSeven: FC<Props> = ({
  form,
  isCompleted,
  formStepDetailSubStepTwo,
  handleSubmitStandardQuoteStepOneNextToStepTwo,
  handleDeclineStepOne,
  handleSubmitModalSaveAsQuote,
}) => {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const dataTradeInBicycle = useSelector((store: StoreState) => store.partner.account.dataTradeInBicycle);
  const { isInstantPayout } = useGetInfoPartner();
  const detailPartnerLocation = useSelector((store: StoreState) => store.partner.account.detailPartnerLocation);
  const dataStepDetailStandardQuote = useSelector(
    (state: StoreState) => state.partner.scorecard.dataStepDetailStandardQuote,
  );
  const [visibleModalDecline, setVisibleModalDecline] = useState(false);
  const [visibleModalCostCalculator, setVisibleModalCostCalculator] = useState(false);
  const [isOpenModalSaveAsQuote, setIsOpenModalSaveAsQuote] = useState(false);
  const [checkIsInstantPayout, setCheckIsInstantPayout] = useState<boolean>(false);

  const onCloseModal = useCallback(() => {
    setIsOpenModalSaveAsQuote(false);
  }, []);

  const handleGetDataStepOne = useCallback(async () => {
    const responseStepTwo = await getStepSummaryStandardQuoteRequest(`${query?.id}`);
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
        condition ? Number(condition.tradeInValue) : 0,
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
    if (isCompleted) {
      dispatch(getListTradeInBicycle(formStepDetailSubStepTwo));
    }
  }, [dispatch]);

  const handleViewCostCalculator = useCallback(() => {
    setVisibleModalCostCalculator(true);
  }, []);

  const handleSaveAsQuote = useCallback(() => {
    setIsOpenModalSaveAsQuote(true);
  }, []);

  const renderComplete = useMemo(() => {
    switch (checkIsInstantPayout) {
      case false:
        return (
          <Row>
            <Col lg={12} className={classes.wrapContainer}>
              <div className={classes.headerStep}>{constTitleStep.StepOneSubStepSix}</div>
              <div className={classes.tradeInValue}>
                {isCompleted && dataStepDetailStandardQuote
                  ? `${formatCurrency(dataStepDetailStandardQuote?.tradeValue)}`
                  : `${formatCurrency(tradeInValue)}` || `$0`}
              </div>
            </Col>
          </Row>
        );

      default:
        return (
          <Row>
            <Col lg={12} className={classes.wrapContainer}>
              <div className={classes.headerStep}>{constTitleStep.StepOneSubStepSixInstantPayout}</div>
              <div className={classes.tradeInValue}>
                {isCompleted && dataStepDetailStandardQuote
                  ? `${formatCurrency(dataStepDetailStandardQuote?.tradeValue * 0.9)}`
                  : `${formatCurrency(Number(tradeInValue) * 0.9)}` || `$0`}
              </div>
            </Col>
          </Row>
        );
    }
  }, [checkIsInstantPayout, dataStepDetailStandardQuote, isCompleted, tradeInValue]);

  return (
    <div>
      {!isCompleted ? (
        <Row>
          <Col lg={!isInstantPayout ? 12 : 6} className={classes.wrapContainer}>
            <div className={classes.headerStep}>{constTitleStep.StepOneSubStepSix}</div>
            <div className={classes.tradeInValue}>
              {isCompleted && dataStepDetailStandardQuote
                ? `${formatCurrency(dataStepDetailStandardQuote?.tradeValue)}`
                : `${formatCurrency(tradeInValue)}` || `$0`}
            </div>
            {!isCompleted && (
              <div className={classes.wrapButton}>
                <Button
                  buttonType="success"
                  className={classes.customButtonSize}
                  onClick={() => handleSubmitStandardQuoteStepOneNextToStepTwo(false)}>
                  Accept
                </Button>
                {!isInstantPayout && (
                  <Button
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
              <div className={classes.tradeInValue}>
                {isCompleted && dataStepDetailStandardQuote
                  ? `${formatCurrency(dataStepDetailStandardQuote?.tradeValue * 0.9)}`
                  : `${formatCurrency(Number(tradeInValue) * 0.9)}` || `$0`}
              </div>
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
      ) : (
        <>{renderComplete}</>
      )}

      <Row className={classes.wrapContainer}>
        {isInstantPayout && !isCompleted && (
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
        {!isCompleted && (
          <div onClick={handleSaveAsQuote} className={classes.viewCost}>
            Save Quote
          </div>
        )}
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
            formDetailBike={formStepDetailSubStepTwo}
            onClose={() => setVisibleModalCostCalculator(false)}
          />
        </Suspense>
      )}

      {isOpenModalSaveAsQuote && (
        <Suspense fallback={null}>
          <ModalSaveAsQuote
            handleSubmitModalSaveAsQuote={handleSubmitModalSaveAsQuote}
            isOpen={isOpenModalSaveAsQuote}
            onClose={onCloseModal}
          />
        </Suspense>
      )}
    </div>
  );
};

export default SubStepSeven;
