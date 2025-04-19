/* eslint-disable import/no-cycle */
import React, { FC, useCallback, useMemo, useState, Suspense } from 'react';
import Button from '@ui/Buttons/Primary/Button';
import ConditionDescriptionModal from '@ui/Condition/ConditionModal';
import images from 'assets/images';
import cx from 'classnames';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Radio from '@ui/Radio';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import { capitalizeEachFirstLetter } from 'helpers/string.helper';
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import Skeleton from 'react-loading-skeleton';

import { constStepOneSubStepFiveFormDescription, constTitleStep } from '../../constraint';
import { TradeInScoreCardsProps } from '../../formDefaultValue';
import classes from './sub-step-six.module.scss';

interface Props {
  isCompleted: boolean;
  form: TradeInScoreCardsProps;
  formStepDetailSubStepTwo: GetListTradeInBicycleParams;
  onChangeForm: (values: TradeInScoreCardsProps) => void;
  handleAddTradeInDropOffRequest: () => void;
}

const SubStepFive: FC<Props> = ({ form, isCompleted, onChangeForm, handleAddTradeInDropOffRequest }) => {
  const dataTradeInBicycle = useSelector((store: StoreState) => store.partner.account.dataTradeInBicycle);
  const loading = useSelector((store: StoreState) => store.partner.account.loading);
  const [show, setShow] = useState(false);

  const handleSelectCondition = useCallback(
    (item: any) => {
      if (isCompleted) {
        onChangeForm({
          ...form,
          condition: item?.condition,
          tradeInValue: item?.tradeInValue,
        });
        handleAddTradeInDropOffRequest();
      }
    },
    [form, handleAddTradeInDropOffRequest, isCompleted, onChangeForm],
  );

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
      ? dataTradeInBicycle?.conditions?.map((item) => {
          return (
            <Row className={cx(classes.customRow)} key={item?.condition} onClick={() => handleSelectCondition(item)}>
              <Col lg={3} md={3} sm={6} xs={6} className={classes.customCol}>
                <div className={classes.wrapRadio}>
                  <Radio
                    checked={form?.condition === item?.condition}
                    className={classes.customCheckbox}
                    disabled={!isCompleted}
                  />
                  <div className={classes.radioTitle}>{capitalizeEachFirstLetter(item?.condition || '')}</div>
                </div>
              </Col>
              <Col lg={3} md={3} sm={6} xs={6} className={cx(classes.customCol, classes.isSmallScreen)}>
                <div className={classes.wrapTitle}>{`${item?.percent * 100}% of bicycles`}</div>
              </Col>
              <Col lg={6} md={6} sm={12} className={classes.customCol}>
                <div className={classes.description}>
                  {item?.condition ? constStepOneSubStepFiveFormDescription[item?.condition] : ''}
                </div>
              </Col>
              <Col lg={3} md={3} sm={6} xs={6} className={cx(classes.customCol, classes.isLargeScreen)}>
                <div className={classes.wrapTitle}>{`${item?.percent * 100}% of bicycles`}</div>
              </Col>
            </Row>
          );
        })
      : null;
  }, [dataTradeInBicycle, form, handleSelectCondition, isCompleted]);

  return (
    <>
      <div className={classes.headerStep}>
        {constTitleStep.StepOneSubStepFive}
        <Button buttonType="transparent" className={classes.buttonInfo} onClick={() => setShow(true)}>
          <img className={classes.iconInfo} src={images.marketplace.iconInfo} alt="icon-info" />
        </Button>
      </div>
      <div className={classes.wrapSubStepFive}>{loading ? renderLoading : renderFormData}</div>
      <ConditionDescriptionModal isOpen={show} onClose={() => setShow(false)} />
    </>
  );
};

export default SubStepFive;
