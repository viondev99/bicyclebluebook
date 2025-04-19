/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/named */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-cycle */
import { partnerFeedbackByScorecardRequest } from 'api/partner/scorecard.api';
import cx from 'classnames';
import useScreenDetect from 'hooks/useScreenDetect';
import StoreState from 'model/store';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { getPartnerLocationDetail } from 'store/partner/account/account.action';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import images from '@images';
import ModalTradeInCredit from '../../../TradeInScoreCardComponent/Modal/ModalTradeInCredit';
import { constTitleStep } from '../../constraint';
import Partner from './Account/Partner';
import classes from './step-complete.module.scss';

interface Props {
  dataModalStepFiveTradeInCredit: any;
}

const StepComplete: FC<Props> = ({ dataModalStepFiveTradeInCredit }) => {
  const { query } = useRouter();
  const { currentWidthScreen } = useScreenDetect();
  const dispatch = useDispatch();
  const dataStepShippingAndCompleteStandardQuote = useSelector(
    (state: StoreState) => state.partner.scorecard.dataStepShippingAndCompleteStandardQuote,
  );
  const userInfo = useSelector((state: StoreState) => state.authenticate.user);
  const detailPartnerLocation = useSelector((store: StoreState) => store.partner.account.detailPartnerLocation);

  const [visibleModalTradeInCredit, setVisibleModalTradeInCredit] = useState(false);
  const [isFeedback, setIsFeedback] = useState<boolean>(false);
  const [isShowDataMobile, setIsShowDataMobile] = useState<boolean>(false);

  const getDefaultFeedback = useCallback(async () => {
    try {
      await partnerFeedbackByScorecardRequest(`${query?.id}`);
      setIsFeedback(true);
    } catch (error) {
      setIsFeedback(false);
    }
  }, [query]);

  const getDetailPartner = useCallback(async () => {
    if (!detailPartnerLocation) {
      dispatch(getPartnerLocationDetail(userInfo?.partner));
    }
  }, [detailPartnerLocation, dispatch, userInfo]);

  const handleGetDefaultStepSummary = useCallback(async () => {
    dispatch(scoreCardAction.getStepSummaryStandardQuote(`${query?.id}`));
  }, [dispatch, query]);

  const handleGetShipment = useCallback(async () => {
    dispatch(scoreCardAction.getShipment(`${query?.id}`));
  }, [dispatch, query]);

  useEffect(() => {
    getDefaultFeedback();
    getDetailPartner();
    handleGetDefaultStepSummary();
    handleGetShipment();
  }, []);

  useEffect(() => {
    setVisibleModalTradeInCredit(dataModalStepFiveTradeInCredit?.visibleModal);
  }, [dataModalStepFiveTradeInCredit]);

  return (
    <div className={classes.wrapStepComplete}>
      <div className={classes.header}>
        <img src={images.icCircleCheckBlue} alt={'icon CircleCheckBlue'} />
        {constTitleStep.StepFive}
      </div>
      <Row>
        <Col lg={9} md={8}>
          <div className={classes.customCard}>
            <div className={classes.title}>
              Your trade in number is <span>{dataStepShippingAndCompleteStandardQuote?.tradeInId}</span>.
            </div>
            {!isShowDataMobile && currentWidthScreen <= 575 && (
              <div className={classes.wrapMobile}>
                Full Details
                <img
                  onClick={() => setIsShowDataMobile(!isShowDataMobile)}
                  className={isShowDataMobile && classes.isShowData}
                  src={images.sell.icLightGreyArrowDown}
                  alt="arrowDown"
                />
              </div>
            )}
            {(currentWidthScreen > 575 || isShowDataMobile) && (
              <>
                <div className={cx(classes.text, classes.mb34)}>
                  As per the trade in partner program terms and conditions, all trade ins must:
                </div>
                <ol className={classes.customOl}>
                  <li>Match scorecard information and include one printed copy with the trade in bicycle</li>
                  <li>
                    Be accurately evaluated (see “conditional values” or email{' '}
                    <a className={classes.customLink} href="mailto:dealersupport@bicyclebluebook.com" target="_top">
                      dealersupport@bicyclebluebook.com
                    </a>{' '}
                    to schedule additional training if you require assistance with evaluations)
                  </li>
                  <li>Be properly packaged to eliminate shipping damage</li>
                  <li>Be in transit to Bicycle Blue Book within 7 days of trade in</li>
                </ol>
                <div className={cx(classes.text, classes.mb34)}>
                  Assuming all of the above conditions are met, reimbursement checks are mailed within fourteen days of
                  receipt at the Bicycle Blue Book warehouse.
                </div>
                <div className={classes.text}>
                  For questions regarding payments or shipped bikes please email{' '}
                  <a className={classes.customLink} href="mailto:dealersupport@bicyclebluebook.com" target="_top">
                    dealersupport@bicyclebluebook.com
                  </a>
                  .
                </div>
              </>
            )}
          </div>
        </Col>
        <Col lg={3} md={4}>
          <Partner isFeedback={isFeedback} getDefaultFeedback={getDefaultFeedback} />
        </Col>
      </Row>

      {visibleModalTradeInCredit && (
        <ModalTradeInCredit
          isOpen={visibleModalTradeInCredit}
          onClose={() => setVisibleModalTradeInCredit(false)}
          dataModalStepFiveTradeInCredit={dataModalStepFiveTradeInCredit}
        />
      )}
    </div>
  );
};

export default StepComplete;
