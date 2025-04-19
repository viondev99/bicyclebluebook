/* eslint-disable no-unused-expressions */
/* eslint-disable import/named */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-cycle */
import CheckBox from '@ui/CheckBox';
import cx from 'classnames';
import StoreState from 'model/store';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { getPartnerLocationDetail } from 'store/partner/account/account.action';
import { constTitleStep } from '../../constraint';
import { FormStepFourSelectThree } from '../../formDefaultValue';
import classes from './step-shipping.module.scss';
import WithBicycleBlueBook from './WithBicycleBlueBook';
import WithDropOff from './WithDropOff';
import WithMyAccount from './WithMyAccount';

interface Props {
  activeShip: number;
  setActiveShip: (data: number) => void;
  formStepForSelectOneRef: any;
  formStepForSelectTwoRef: any;
  formStepFourSelectFour: FormStepFourSelectThree;
  setFormStepFourSelectFour: (values: FormStepFourSelectThree) => void;
  isCompleted: boolean;
}

const StepShipping: FC<Props> = ({
  activeShip,
  formStepForSelectOneRef,
  formStepForSelectTwoRef,
  formStepFourSelectFour,
  setActiveShip,
  setFormStepFourSelectFour,
  isCompleted,
}) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const detailPartner = useSelector((store: StoreState) => store.partner.account.detailPartnerLocation);
  const dataStepShippingAndCompleteStandardQuote = useSelector(
    (state: StoreState) => state.partner.scorecard.dataStepShippingAndCompleteStandardQuote,
  );

  const enableDropOff = useMemo(() => {
    return detailPartner?.drop_off_enabled;
  }, [detailPartner]);

  useEffect(() => {
    if (userInfo && !detailPartner) {
      dispatch(getPartnerLocationDetail(userInfo?.partner));
    }
  }, [dispatch]);

  useEffect(() => {
    if (dataStepShippingAndCompleteStandardQuote && isCompleted) {
      if (
        dataStepShippingAndCompleteStandardQuote?.dropOff &&
        Object.keys(dataStepShippingAndCompleteStandardQuote?.dropOff).length
      ) {
        setActiveShip(3);
        return;
      }
      if (
        dataStepShippingAndCompleteStandardQuote?.myAccount &&
        Object.keys(dataStepShippingAndCompleteStandardQuote?.myAccount).length
      ) {
        setActiveShip(2);
        return;
      }
      setActiveShip(1);
    }
  }, [dataStepShippingAndCompleteStandardQuote, isCompleted, setActiveShip]);

  const renderForm = useMemo(() => {
    switch (activeShip) {
      case 1: {
        return <WithBicycleBlueBook formStepForSelectOneRef={formStepForSelectOneRef} isCompleted={isCompleted} />;
      }
      case 2: {
        return <WithMyAccount formStepForSelectTwoRef={formStepForSelectTwoRef} isCompleted={isCompleted} />;
      }
      case 3: {
        return (
          <WithDropOff
            formStepFourSelectFour={formStepFourSelectFour}
            setFormStepFourSelectFour={setFormStepFourSelectFour}
            isCompleted={isCompleted}
          />
        );
      }
      default:
        return null;
    }
  }, [
    activeShip,
    formStepForSelectOneRef,
    formStepForSelectTwoRef,
    formStepFourSelectFour,
    isCompleted,
    setFormStepFourSelectFour,
  ]);

  const handleChangeShippingPage = useCallback(
    (page: number) => {
      if (isCompleted) {
        return;
      }
      setActiveShip(page);
    },
    [isCompleted, setActiveShip],
  );

  return (
    <div className={classes.wrapStepShipping}>
      <div className={classes.header}>{constTitleStep.StepFour}</div>
      <Row className={classes.customRow}>
        <Col lg={4} md={6} className={classes.customCol}>
          <div
            className={cx(classes.wrapTitle, activeShip === 1 && classes.active, isCompleted && classes.disableCursor)}
            onClick={() => handleChangeShippingPage(1)}>
            <span>With Bicycle Blue Book</span>
            <CheckBox
              checked={activeShip === 1}
              className={classes.customCheckbox}
              checkMarkClassName={activeShip !== 1 && classes.checkMarkClassName}
            />
          </div>
        </Col>
        <Col lg={4} md={6} className={classes.customCol}>
          <div
            className={cx(classes.wrapTitle, activeShip === 2 && classes.active, isCompleted && classes.disableCursor)}
            onClick={() => handleChangeShippingPage(2)}>
            <span>With My Account</span>
            <CheckBox
              checked={activeShip === 2}
              className={classes.customCheckbox}
              checkMarkClassName={activeShip !== 2 && classes.checkMarkClassName}
            />
          </div>
        </Col>
        {enableDropOff && (
          <Col lg={4} md={6} className={classes.customCol}>
            <div
              className={cx(
                classes.wrapTitle,
                activeShip === 3 && classes.active,
                isCompleted && classes.disableCursor,
              )}
              onClick={() => handleChangeShippingPage(3)}>
              <span>Drop Off at Warehouse</span>
              <CheckBox
                checked={activeShip === 3}
                className={classes.customCheckbox}
                checkMarkClassName={activeShip !== 3 && classes.checkMarkClassName}
              />
            </div>
          </Col>
        )}
      </Row>
      {renderForm}
    </div>
  );
};

export default StepShipping;
