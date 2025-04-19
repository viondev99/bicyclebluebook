/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-target-blank */
import Card from '@ui/Cards';
import cx from 'classnames';
import Modal from '@ui/Modal/Modal';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { capitalizeFirstLetter, formatCurrency } from 'helpers/string.helper';
import useScreenDetect from 'hooks/useScreenDetect';
import { GetListTradeInBicycleParams, GetStepDetailStandardQuoteResponse } from 'model/store/partner/scorecard.model';
import { getListTradeInBicycle } from 'store/partner/account/account.action';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import { useRouter } from 'next/router';
import { getStepDetailStandardQuoteRequest } from 'api/partner/scorecard.api';
import { TradeInScoreCardsProps } from 'components/PartnerPortal/TradeInScoreCard/StandardQuote/formDefaultValue';
import { TradeInPriceConfigs } from 'model/store/partner/scorecard-custom-quote.model';
import classes from './cost.module.scss';

interface Props {
  isOpen: boolean;
  form?: TradeInScoreCardsProps;
  formDetailBike?: GetListTradeInBicycleParams;
  tradeInPriceConfigs?: TradeInPriceConfigs[];
  onClose: () => void;
}

const CostCalculator: FC<Props> = ({ isOpen, form, formDetailBike, onClose, tradeInPriceConfigs }) => {
  const { query } = useRouter();
  const dispatch = useDispatch();
  const dataTradeInBicycle = useSelector((store: StoreState) => store.partner.account.dataTradeInBicycle);
  const { currentWidthScreen } = useScreenDetect();
  const [formAfterSubmit, setFormAfterSubmit] = useState(null);

  const listCalculates = useMemo(() => {
    if (tradeInPriceConfigs) {
      return tradeInPriceConfigs;
    }
    if (form?.condition && dataTradeInBicycle) {
      const findCondition = dataTradeInBicycle?.conditions?.find((it) => it.condition === form?.condition);
      if (findCondition) {
        return findCondition?.tradeInPriceConfigs || [];
      }
    }
    if (formAfterSubmit && dataTradeInBicycle) {
      const findCondition = dataTradeInBicycle?.conditions?.find((it) => it.condition === formAfterSubmit?.condition);
      if (findCondition) {
        return findCondition?.tradeInPriceConfigs || [];
      }
    }
    return [];
  }, [tradeInPriceConfigs, form, dataTradeInBicycle, formAfterSubmit]);

  const handleGetDefaultStepOne = useCallback(async () => {
    const detailScoreCard: GetStepDetailStandardQuoteResponse = await getStepDetailStandardQuoteRequest(`${query?.id}`);
    setFormAfterSubmit(detailScoreCard);
  }, [query]);

  useEffect(() => {
    if (tradeInPriceConfigs) {
      return;
    }
    if (!dataTradeInBicycle) {
      dispatch(getListTradeInBicycle(formDetailBike));
    }
    if (query?.id) {
      handleGetDefaultStepOne();
    }
  }, [dataTradeInBicycle, dispatch, formDetailBike, handleGetDefaultStepOne, query, tradeInPriceConfigs]);

  const renderItem = useMemo(() => {
    return listCalculates?.length
      ? listCalculates.map((it, idx) => {
          return (
            <div className={classes.wrapItem} key={it.name}>
              <div className={cx(classes.customTextSize, idx > 6 && classes.textBlue)}>
                {capitalizeFirstLetter(it.name)}
              </div>
              <span className={cx(classes.customTextSize, idx > 6 && classes.textBlue)}>
                {it?.price ? formatCurrency(it?.price, false) : `$0`}
              </span>
            </div>
          );
        })
      : null;
  }, [listCalculates]);

  return (
    <>
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
        hideButtonClose={currentWidthScreen <= 767}
        showButtonCloseXBlackLeft={currentWidthScreen <= 767}
        title={`Cost Comparison Calculator`}>
        <Card className={classes.wrapCard}>
          {renderItem}

          <hr className={classes.customHr} />

          <ul className={classes.customUl}>
            <li>Typical time to sell a used bike is 7 to 45 days</li>
            <li>Roughly 15% of online transactions are never completed</li>
            <li>3–5% of used bike sales are returned</li>
            <li>Personal time calculated at $50 per hour</li>
          </ul>
        </Card>
      </Modal>
    </>
  );
};

export default CostCalculator;
