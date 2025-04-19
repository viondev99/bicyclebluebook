/* eslint-disable no-nested-ternary */
/* eslint-disable import/named */
/* eslint-disable import/no-cycle */
import Button from '@ui/Buttons/Primary/Button';
import cx from 'classnames';
import { ModalDeclineStepOneFormValue } from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalDeclineStepOne';
import { formatCurrency } from 'helpers/string.helper';
import { useGetInfoPartner } from 'hooks/useGetInfoPartner';
import StoreState from 'model/store';
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import React, { FC, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { getListTradeInBicycle } from 'store/partner/account/account.action';
import { statusToTextHistoryLead } from 'components/PartnerPortal/CostCalculator/constraint';
import { TradeInScoreCardsProps } from '../../formDefaultValue';
import { constTitleStep } from '../../constraint';
import classes from './sub-step-eight.module.scss';
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
  handleSubmitStepDetails: (isInstantPayout: boolean) => void;
  handleDeclineStepOne: (value: ModalDeclineStepOneFormValue) => void;
  handleSubmitModalSaveAsQuote: (value: SaveAsQuoteData) => void;
}

const SubStepSeven: FC<Props> = ({
  form,
  isCompleted,
  formStepDetailSubStepTwo,
  handleSubmitStepDetails,
  handleDeclineStepOne,
  handleSubmitModalSaveAsQuote,
}) => {
  const dispatch = useDispatch();
  const { isInstantPayout } = useGetInfoPartner();
  const dataStepDetailStandardQuote = useSelector(
    (state: StoreState) => state.partner.scorecard.dataStepDetailStandardQuote,
  );
  const [visibleModalDecline, setVisibleModalDecline] = useState(false);
  const [visibleModalCostCalculator, setVisibleModalCostCalculator] = useState(false);
  const [isOpenModalSaveAsQuote, setIsOpenModalSaveAsQuote] = useState(false);

  const dataTradeInRequest = useSelector((store: StoreState) => store.partner.scorecard.dataTradeInRequest);

  const onCloseModal = useCallback(() => {
    setIsOpenModalSaveAsQuote(false);
  }, []);

  const isShowAccept = useMemo(() => {
    return (
      dataTradeInRequest?.statusStage?.status === statusToTextHistoryLead.NEW_LEAD ||
      dataTradeInRequest?.statusStage?.status === statusToTextHistoryLead.OPEN
    );
  }, [dataTradeInRequest]);

  const tradeInValue = useMemo(() => {
    return dataTradeInRequest?.tradeValue;
  }, [dataTradeInRequest]);

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

  const renderTradeInValue = useMemo(() => {
    if (form?.tradeInValue) {
      return formatCurrency(form?.tradeInValue);
    }
    if (isCompleted && dataStepDetailStandardQuote) {
      return formatCurrency(dataStepDetailStandardQuote?.tradeValue);
    }
    return formatCurrency(tradeInValue);
  }, [dataStepDetailStandardQuote, form, isCompleted, tradeInValue]);

  return (
    <div>
      <Row className={classes.wrapSectionContainer}>
        <Col lg={!isInstantPayout ? 12 : 6} className={classes.wrapContainer}>
          <div className={classes.headerStep}>{constTitleStep.StepOneSubStepSix}</div>
          <div className={classes.tradeInValue}>{`${renderTradeInValue}` || `$0`}</div>
          {isCompleted && isShowAccept && (
            <div className={classes.wrapButton}>
              <Button
                buttonType="success"
                className={classes.customButtonSize}
                onClick={() => handleSubmitStepDetails(false)}>
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
              {isInstantPayout && isCompleted && (
                <Button
                  buttonType="danger"
                  className={cx(classes.customButtonSize, classes.customWidthButtonDecline)}
                  onClick={() => setVisibleModalDecline(true)}>
                  Decline
                </Button>
              )}
            </div>
          )}
        </Col>
      </Row>

      <Row className={classes.wrapContainer}>
        <div onClick={handleViewCostCalculator} className={classes.viewCost}>
          View Cost Calculator
        </div>
        {/* <div onClick={handleSaveAsQuote} className={classes.viewCost}>
          Save Quote
        </div> */}
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

      {/* {isOpenModalSaveAsQuote && (
        <Suspense fallback={null}>
          <ModalSaveAsQuote
            handleSubmitModalSaveAsQuote={handleSubmitModalSaveAsQuote}
            isOpen={isOpenModalSaveAsQuote}
            onClose={onCloseModal}
          />
        </Suspense>
      )} */}
    </div>
  );
};

export default SubStepSeven;
