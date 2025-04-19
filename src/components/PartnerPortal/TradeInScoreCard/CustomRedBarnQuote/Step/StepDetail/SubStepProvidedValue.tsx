/* eslint-disable no-nested-ternary */
/* eslint-disable import/named */
/* eslint-disable import/no-cycle */
import React, { FC, Suspense, useCallback, useMemo, useState } from 'react';
import Button from '@ui/Buttons/Primary/Button';
import cx from 'classnames';
import { formatCurrency } from 'helpers/string.helper';
import { useGetInfoPartner } from 'hooks/useGetInfoPartner';
import StoreState from 'model/store';
import { useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { toastError } from 'helpers/utils.helper';
import {
  createNewRedBarnCustomQuoteProvidedValueRequest,
  customRedBarnDecline,
  TradeInDetailDeclineBody,
} from 'api/partner/scorecard.api';
import { useRouter } from 'next/router';
import { ModalDeclineStepOneFormValue } from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalDeclineStepOne';
import { constTitleStep } from '../../constraint';
import classes from './sub-step-provided-value.module.scss';

const ModalDeclineStepOne = React.lazy(() =>
  import('components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalDeclineStepOne'),
);
const ModalCostCalculator = React.lazy(() =>
  import('components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalCostCalculator'),
);
interface Props {}

const SubStepProvidedValue: FC<Props> = () => {
  const router = useRouter();
  const { isInstantPayout } = useGetInfoPartner();
  const dataDetailCustomQuote = useSelector((state: StoreState) => state.partner.scorecard.dataDetailCustomQuote);

  const [visibleModalDecline, setVisibleModalDecline] = useState(false);
  const [visibleModalCostCalculator, setVisibleModalCostCalculator] = useState(false);

  const tradeInPriceConfigs = useMemo(() => {
    return dataDetailCustomQuote?.tradeInPriceConfigs || [];
  }, [dataDetailCustomQuote]);

  const handleSubmitCreateNewTradeInCustomQuoteProvidedValue = useCallback(
    async (isInstantPayoutss: boolean) => {
      try {
        await createNewRedBarnCustomQuoteProvidedValueRequest({ id: dataDetailCustomQuote?.id });
        router.push({
          pathname: `/trade-in-account/trade-in/red-barn-quote/${dataDetailCustomQuote?.scorecardRedBarn?.id}`,
          query: { step: 2 },
        });
      } catch (error) {
        toastError(error);
      }
    },
    [dataDetailCustomQuote, router],
  );

  const handleDeclineStepOne = useCallback(
    async (values: ModalDeclineStepOneFormValue) => {
      try {
        let payload: TradeInDetailDeclineBody = {
          comment: values?.comment,
          reasonDeclineId: values?.reasonDeclineId,
          redBarnCustomQuoteId: String(dataDetailCustomQuote?.id),
        };
        if (values?.reasonDeclineId === '3') {
          payload = {
            ...payload,
            priceExpected: values?.priceExpected,
          };
        }
        await customRedBarnDecline(String(dataDetailCustomQuote?.scorecardRedBarn?.id), payload);
        router.push(`/trade-in-account/trade-in/new`);
      } catch (error) {
        toastError(error);
      }
    },
    [dataDetailCustomQuote, router],
  );

  const handleViewCostCalculator = useCallback(() => {
    setVisibleModalCostCalculator(true);
  }, []);

  return (
    <div>
      <Row>
        <Col lg={!isInstantPayout ? 12 : 6} className={classes.wrapContainer}>
          <div className={classes.headerStep}>{constTitleStep.StepOneSubStepSix}</div>
          <div className={classes.tradeInValue}>{`${formatCurrency(dataDetailCustomQuote?.tradeInValue)}` || `$0`}</div>

          <div className={classes.wrapButton}>
            <Button
              buttonType="success"
              className={classes.customButtonSize}
              onClick={() => handleSubmitCreateNewTradeInCustomQuoteProvidedValue(false)}>
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
        </Col>

        {isInstantPayout && (
          <Col lg={6} className={classes.wrapContainer}>
            <div className={classes.headerStep}>{constTitleStep.StepOneSubStepSixInstantPayout}</div>
            <div className={classes.tradeInValue}>
              {`${formatCurrency((Number(dataDetailCustomQuote?.tradeInValue) * 90) / 100)}` || ''}
            </div>

            <div className={classes.wrapButton}>
              <Button
                buttonType="success"
                className={classes.customButtonSize}
                onClick={() => handleSubmitCreateNewTradeInCustomQuoteProvidedValue(true)}>
                Accept
              </Button>
            </div>
          </Col>
        )}
      </Row>

      <Row className={classes.wrapContainer}>
        {isInstantPayout && (
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
            onClose={() => setVisibleModalCostCalculator(false)}
            tradeInPriceConfigs={tradeInPriceConfigs}
          />
        </Suspense>
      )}
    </div>
  );
};

export default SubStepProvidedValue;
