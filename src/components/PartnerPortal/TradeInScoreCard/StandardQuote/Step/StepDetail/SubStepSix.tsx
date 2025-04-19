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
import { getListTradeInBicycle, saveNotesQuote } from 'store/partner/account/account.action';
import { DATA_RESET_CREATE_SCORECARD_QUANTITY, getTradeInPrice } from 'helpers/utilities.helper';
import { getStepSummaryStandardQuoteRequest } from 'api/partner/scorecard.api';
import Textarea from '@ui/Textarea';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import useScreenDetect from 'hooks/useScreenDetect';
import { SaveAsQuoteData, TradeInScoreCardsProps } from '../../formDefaultValue';
import { constTitleStep } from '../../constraint';
import classes from './sub-step-six.module.scss';

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
  formStepOneSubStepThree: GetListTradeInBicycleParams;
  handleSubmitStandardQuoteStepOneNextToStepTwo: (isInstantPayout: boolean) => void;
  handleDeclineStepOne: (value: ModalDeclineStepOneFormValue) => void;
  handleSubmitModalSaveAsQuote: (value: SaveAsQuoteData) => void;
  statusHistoryQuote: string;
}

const SubStepSix: FC<Props> = ({
  form,
  isCompleted,
  formStepOneSubStepThree,
  handleSubmitStandardQuoteStepOneNextToStepTwo,
  handleDeclineStepOne,
  handleSubmitModalSaveAsQuote,
  statusHistoryQuote,
}) => {
  const dispatch = useDispatch();
  const { query, push } = useRouter();
  const dataTradeInBicycle = useSelector((store: StoreState) => store.partner.account.dataTradeInBicycle);
  const { isInstantPayout } = useGetInfoPartner();
  const detailPartnerLocation = useSelector((store: StoreState) => store.partner.account.detailPartnerLocation);
  const notesQuote = useSelector((store: StoreState) => store.partner.account.notesQuote);
  const { currentWidthScreen } = useScreenDetect();
  const [visibleModalDecline, setVisibleModalDecline] = useState(false);
  const [visibleModalCostCalculator, setVisibleModalCostCalculator] = useState(false);
  const [isOpenModalSaveAsQuote, setIsOpenModalSaveAsQuote] = useState(false);
  const [checkIsInstantPayout, setCheckIsInstantPayout] = useState<boolean>(false);

  const onCloseModal = useCallback(() => {
    setIsOpenModalSaveAsQuote(false);
  }, []);

  const isCreateNewQuote = useMemo(() => {
    return query?.isCreateQuote;
  }, [query]);

  const addNotesQuote = useCallback(
    (notes: string) => {
      dispatch(saveNotesQuote(notes));
    },
    [dispatch],
  );

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
      dispatch(getListTradeInBicycle(formStepOneSubStepThree));
    }
  }, [dispatch]);

  const handleViewCostCalculator = useCallback(() => {
    setVisibleModalCostCalculator(true);
  }, []);

  const handleSaveAsQuote = useCallback(() => {
    if (query?.isQuote === 'true' && query?.editStepDetailOfQuote === 'true') {
      handleSubmitModalSaveAsQuote({
        customer_name: '',
        owner_first_name: '',
        owner_last_name: '',
        customer_email: '',
        customer_phone: '',
        shop_employee: '',
        notes: '',
      });
      return;
    }
    setIsOpenModalSaveAsQuote(true);
  }, [handleSubmitModalSaveAsQuote, query]);

  const renderComplete = useMemo(() => {
    switch (checkIsInstantPayout) {
      case true:
        return (
          <Row>
            <Col lg={12} className={classes.wrapContainer}>
              <div className={classes.headerStep}>{constTitleStep.StepOneSubStepSixInstantPayout}</div>
              <div className={classes.tradeInValue}>{`${formatCurrency((Number(tradeInValue) * 90) / 100)}` || ''}</div>
            </Col>
          </Row>
        );

      default:
        return (
          <Row>
            <Col lg={12} className={classes.wrapContainer}>
              <div className={classes.headerStep}>{constTitleStep.StepOneSubStepSix}</div>
              <div className={classes.tradeInValue}>{`${formatCurrency(tradeInValue)}` || `$0`}</div>
            </Col>
          </Row>
        );
    }
  }, [checkIsInstantPayout, tradeInValue]);

  const renderInfoCompleted = useMemo(() => {
    if (isCompleted || statusHistoryQuote !== '') {
      return renderComplete;
    }
    return (
      <Row>
        <Col lg={!isInstantPayout ? 12 : 6} className={classes.wrapContainer}>
          <div className={classes.headerStep}>{constTitleStep.StepOneSubStepSix}</div>
          <div className={classes.tradeInValue}>{`${formatCurrency(tradeInValue)}` || `$0`}</div>
          {!isCompleted && (
            <div
              className={cx(classes.wrapButton, {
                'd-none': isCreateNewQuote,
              })}>
              <Button
                buttonType="success"
                className={classes.customButtonSize}
                onClick={() => handleSubmitStandardQuoteStepOneNextToStepTwo(false)}>
                Accept
              </Button>
              {!isInstantPayout && statusHistoryQuote === '' && (
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
            <div className={classes.tradeInValue}>{`${formatCurrency((Number(tradeInValue) * 90) / 100)}` || ''}</div>
            {!isCompleted && (
              <div
                className={cx(classes.wrapButton, {
                  'd-none': isCreateNewQuote,
                })}>
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
    isCreateNewQuote,
    isInstantPayout,
    renderComplete,
    statusHistoryQuote,
    tradeInValue,
  ]);

  const onExit = useCallback(() => {
    dispatch(scoreCardAction.setCreateScorecardQuantity(DATA_RESET_CREATE_SCORECARD_QUANTITY));
    push(`/trade-in-account/tp-dashboard`);
  }, [dispatch, push]);

  return (
    <div>
      {renderInfoCompleted}

      <Row
        className={cx(classes.wrapContainer, {
          'd-none': isCreateNewQuote,
        })}>
        {isInstantPayout && !isCompleted && statusHistoryQuote === '' && (
          <Button
            buttonType="danger"
            className={cx(classes.customButtonSize, classes.customWidthButtonDecline)}
            onClick={() => setVisibleModalDecline(true)}>
            Decline
          </Button>
        )}
        {!isCreateNewQuote && (
          <div onClick={handleViewCostCalculator} className={classes.viewCost}>
            View Cost Calculator
          </div>
        )}
        {(!isCompleted || (statusHistoryQuote !== '' && query?.editStepDetailOfQuote === 'true')) && (
          <div
            onClick={handleSaveAsQuote}
            className={cx(classes.viewCost, {
              'd-none': isCreateNewQuote,
            })}>
            Save Quote
          </div>
        )}
      </Row>

      {isCreateNewQuote && (
        <>
          <Row className={classes.wrapNoteQuote}>
            <div className={classes.labelNotes}>Notes</div>
            <Textarea
              className={classes.inputNote}
              rows={3}
              disabled={false}
              value={notesQuote}
              onChange={(e) => addNotesQuote(e?.target?.value)}
            />
          </Row>

          {currentWidthScreen > 767 ? (
            <Row className={classes.wrapBtnQuote}>
              <Button buttonType="primary" className={classes.btnSaveQuote} onClick={handleSaveAsQuote}>
                Save Quote
              </Button>
              <Button
                buttonType="primary"
                className={classes.btnSaveQuote}
                onClick={() => handleSubmitStandardQuoteStepOneNextToStepTwo(false)}>
                Create Scorecard
              </Button>
              <Button buttonType="outline" onClick={onExit}>
                Cancle
              </Button>
            </Row>
          ) : (
            <Row className={classes.wrapBtnQuote}>
              <div className="d-flex justify-content-between mb-3">
                <Button buttonType="primary" className={classes.btnSaveQuote} onClick={handleSaveAsQuote}>
                  Save Quote
                </Button>
                <Button
                  buttonType="primary"
                  className={classes.btnSaveQuote}
                  onClick={() => handleSubmitStandardQuoteStepOneNextToStepTwo(false)}>
                  Create Scorecard
                </Button>
              </div>
              <div className="d-flex justify-content-center">
                <Button buttonType="outline" onClick={onExit}>
                  Cancle
                </Button>
              </div>
            </Row>
          )}
        </>
      )}

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
      {isOpenModalSaveAsQuote && (
        <Suspense fallback={null}>
          <ModalSaveAsQuote
            handleSubmitModalSaveAsQuote={handleSubmitModalSaveAsQuote}
            isOpen={isOpenModalSaveAsQuote}
            note={notesQuote}
            onClose={onCloseModal}
          />
        </Suspense>
      )}
    </div>
  );
};

export default SubStepSix;
