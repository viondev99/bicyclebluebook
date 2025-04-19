/* eslint-disable no-nested-ternary */
import React, { FC, useMemo } from 'react';
import cx from 'classnames';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import CheckBox from '@ui/CheckBox';
import ModalNumberScorecard from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalNumberScorecard';
import StoreState from 'model/store';
import { useDispatch, useSelector } from 'react-redux';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import classes from './sub-step-one.module.scss';
import { constStepOneSunStepOneDescription, constTitleStep } from '../../constraint';

interface Props {
  activeCard: number;
  setActiveCard: (data: number) => void;
}

const SubStepOne: FC<Props> = ({ activeCard, setActiveCard }) => {
  const dispatch = useDispatch();
  const { isOpenModalNumberScorecard } = useSelector(
    (state: StoreState) => state.partner.scorecard.createScoreCardQuantityData,
  );
  const { operationRedbarn } = useSelector((state: StoreState) => ({
    operationRedbarn: state.partner?.account?.detailPartnerLocation?.operation_redbarn,
  }));

  const renderContentSubstepOne = useMemo(() => {
    return (
      <Row className={classes.customRow}>
        <Col lg={6} md={6} className={classes.customCol}>
          <div className={cx(classes.wrapTitle, activeCard === 1 && classes.active)} onClick={() => setActiveCard(1)}>
            <span>Standard Quote</span>
            <CheckBox
              checked={activeCard === 1}
              className={classes.customCheckbox}
              checkMarkClassName={activeCard !== 1 && classes.checkMarkClassName}
            />
          </div>

          <div className={cx(classes.description, classes.isLargeScreen)}>
            {constStepOneSunStepOneDescription.STANDARD_QUOTE_DES}
          </div>
        </Col>
        <Col lg={6} md={6} className={classes.customCol}>
          <div className={cx(classes.wrapTitle, activeCard === 2 && classes.active)} onClick={() => setActiveCard(2)}>
            <span>Custom Quote</span>
            <CheckBox
              checked={activeCard === 2}
              className={classes.customCheckbox}
              checkMarkClassName={activeCard !== 2 && classes.checkMarkClassName}
            />
          </div>

          <div className={cx(classes.description, classes.isLargeScreen)}>
            {constStepOneSunStepOneDescription.CUSTOM_QUOTE_DES}
          </div>
        </Col>
        {operationRedbarn && (
          <>
            <Col lg={6} md={6} className={classes.customCol}>
              <div
                className={cx(classes.wrapTitle, activeCard === 3 && classes.active)}
                onClick={() => setActiveCard(3)}>
                <span>Standard Red Barn Quote</span>
                <CheckBox
                  checked={activeCard === 3}
                  className={classes.customCheckbox}
                  checkMarkClassName={activeCard !== 3 && classes.checkMarkClassName}
                />
              </div>

              <div className={cx(classes.description, classes.isLargeScreen)}>
                {constStepOneSunStepOneDescription.RED_BARN_QUOTE_DES}
              </div>
            </Col>
            <Col lg={6} md={6} className={classes.customCol}>
              <div
                className={cx(classes.wrapTitle, activeCard === 4 && classes.active)}
                onClick={() => setActiveCard(4)}>
                <span>Custom Red Barn Quote</span>
                <CheckBox
                  checked={activeCard === 4}
                  className={classes.customCheckbox}
                  checkMarkClassName={activeCard !== 4 && classes.checkMarkClassName}
                />
              </div>

              <div className={cx(classes.description, classes.isLargeScreen)}>
                {constStepOneSunStepOneDescription.CUSTOM_RED_BARN_QUOTE}
              </div>
            </Col>
          </>
        )}
      </Row>
    );
  }, [activeCard, operationRedbarn, setActiveCard]);

  return (
    <>
      <div className={classes.headerStep}>{constTitleStep.StepOneSubStepOne}</div>
      <div className={classes.wrapSubStepOne}>
        {renderContentSubstepOne}
        <div className={cx(classes.bottomDescription, classes.isSmallScreen)}>
          {activeCard === 1
            ? constStepOneSunStepOneDescription.STANDARD_QUOTE_DES
            : activeCard === 2
            ? constStepOneSunStepOneDescription.CUSTOM_QUOTE_DES
            : constStepOneSunStepOneDescription.RED_BARN_QUOTE_DES}
        </div>
      </div>

      {isOpenModalNumberScorecard && (
        <ModalNumberScorecard
          isOpen={isOpenModalNumberScorecard}
          onClose={() =>
            dispatch(
              scoreCardAction.setCreateScorecardQuantity({
                isOpenModalNumberScorecard: false,
              }),
            )
          }
        />
      )}
    </>
  );
};

export default SubStepOne;
