import React, { FC, memo, useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import numeral from 'numeral';
import get from 'lodash/get';
import * as Yup from 'yup';
import { Formik } from 'formik';
import toLower from 'lodash/toLower';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import Skeleton from 'react-loading-skeleton';
import { addTag } from 'helpers/common.helper';
import t from 'helpers/language';
import { normalizeServerConstant } from 'helpers/string.helper';
import StoreState from 'model/store';
import { getConditionsByComponents, resetConditionsByComponents } from 'store/trade-in/trade-in.action';
import ConditionModal from '@ui/Condition/ConditionModal';
import { TradeInForm, TradeInValues } from 'pages/trade-in/request';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import PopupNotEligibleModel from 'components/ValueGuide/Product/PopupNotEligibleModel/PopupNotEligibleModel';
import classes from './form-request.module.scss';
// import ProceedModal from './Modal/ProceedModal';
// import ModalNotExistCondition from './Modal/ModalNotExistCondition';

import FormRequestButton from './FormRequestButton';

const Step4Schema = Yup.object().shape({
  conition: Yup.string().required(t('common.validate.nameRequired')),
});

interface Step1Form {
  condition: string;
}

function formatTradeInValue(value: number) {
  return value ? numeral(value).format('0,0.00') : value;
}

interface Props {
  form: TradeInForm;
  brand: { value: string; label: string };
  model: { value: string; label: string };
  year: { value: string; label: string };
  onChangeStep: (step: number, subStep?: number) => void;
  onChangeForm: (values: Partial<TradeInForm>) => void;
}

const Step4: FC<Props> = (props) => {
  const { brand, model, year, onChangeStep, onChangeForm, form } = props;
  const dispatch = useDispatch();
  const conditions = useSelector((store: StoreState) => store.tradeIn.conditions);
  const loading = useSelector((store: StoreState) => store.tradeIn.loadingCondition);
  const [openModal, setOpenModal] = useState(false);
  const [show, setShow] = useState(false);
  // const [visibleModalNotExistCondition, setvisibleModalNotExistCondition] = useState(false);

  const initialForm: Step1Form = useMemo(() => {
    return {
      condition: form?.condition,
    };
  }, [form]);

  useEffect(() => {
    if (brand?.value && model?.value && year?.value) {
      dispatch(getConditionsByComponents({ brand: brand.value, model: model.value, year: year.value }));
    } else {
      dispatch(resetConditionsByComponents());
    }
  }, [brand, model, year, dispatch]);

  useEffect(() => {
    addTag({
      event: 'VirtualPageView',
      virtualBBBTradeInPageTitle: 'TradeInStep2',
      virtualBBBTradeInPageUrl: '/trade-in/request/step2',
    });
  }, []);

  const toggleModal = useCallback(() => {
    setOpenModal(!openModal);
  }, [openModal]);

  const onProceed = useCallback(() => {
    if (
      form?.tradeInValue < 400 ||
      conditions?.bicycleType?.name === 'E-Bike' ||
      conditions?.bicycleType?.name === 'Kids'
    ) {
      setShow(true);
    } else {
      let tradeInValues: Partial<TradeInValues>;
      get(conditions, 'listConditions', []).forEach((item) => {
        if (item.condition) {
          tradeInValues = {
            ...tradeInValues,
            [toLower(item.condition)]: `$${formatTradeInValue(item.tradeInValueMin)} - $${formatTradeInValue(
              item.tradeInValueMax,
            )}`,
          };
        }
      });
      setShow(false);
      onChangeStep(2, 2);
      onChangeForm({
        id: get(conditions, 'bicycleId', null),
        tradeInValues,
      });
    }
  }, [form, conditions, onChangeStep, onChangeForm]);

  const renderCondition = useMemo(() => {
    if (!conditions?.listConditions || conditions?.listConditions.length === 0) {
      return <div className={cx('text-center flex-grow-1', classes.description)}>This bike has no condition.</div>;
    }
    return conditions?.listConditions?.map((item) => (
      <Col
        lg={3}
        md={6}
        xs={6}
        key={item.condition}
        className={classes.colCustom}
        onClick={() => {
          onChangeForm({
            condition: item?.condition,
            tradeInValue: item?.tradeInValueAvg,
            tradeInValueMin: item?.tradeInValueMin,
          });
        }}>
        <div
          className={cx(classes.condition, {
            [classes.conditionSelected]: form?.condition === item?.condition,
          })}
          style={{ textTransform: 'capitalize' }}>
          {normalizeServerConstant(item.condition).toLowerCase()}
        </div>
      </Col>
    ));
  }, [conditions, form, onChangeForm]);

  // const handleNextStep = () => {
  //   if (conditions?.listConditions?.length) {
  //     return setShow(true);
  //   }
  //   setvisibleModalNotExistCondition(true);
  // };

  return (
    <>
      <Formik initialValues={initialForm} onSubmit={onProceed} enableReinitialize={true} validationSchema={Step4Schema}>
        {({ handleSubmit, values, setFieldValue }) => {
          return (
            <>
              <div className={classes.container}>
                <div className={classes.formContainer}>
                  <h1 className={classes.title}>What condition is the bike in?</h1>
                  <p className={classes.description}>
                    Estimates are based on your bike's condition, which will be inspected by our trade in partner.
                  </p>
                  <Row className={classes.conditionContainer}>
                    {loading
                      ? Array(4)
                          .fill(0)
                          .map((item, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Col lg={3} md={6} xs={6} key={`loading${index}`} className={classes.colCustom}>
                              <div className={classes.value}>
                                <Skeleton width={150} height={40} />
                              </div>
                            </Col>
                          ))
                      : renderCondition}
                  </Row>
                  <p className={classes.subDescription}>Looks new and is in excellent mechanical condition</p>
                  <div className={classes.learnAbout}>
                    <a className={classes.textLink} onClick={toggleModal}>
                      Learn more
                    </a>
                  </div>
                </div>
              </div>
              <FormRequestButton
                disabledBack={false}
                disabledContinue={loading || !form?.condition}
                onClickBack={() => onChangeStep(1, 3)}
                onClickContinue={onProceed}
              />
            </>
          );
        }}
      </Formik>
      {openModal && <ConditionModal isOpen={openModal} onClose={toggleModal} />}
      {show && (
        <Suspense fallback={null}>
          <PopupNotEligibleModel
            isOpen={show}
            onClose={() => setShow(false)}
            typeBike={conditions?.bicycleType?.name}
            fairCondition={form?.tradeInValue}
          />
        </Suspense>
      )}
      {/* {show && (
        <ProceedModal
          isOpen={show}
          bicycleType={conditions?.bicycleType?.name}
          onClose={() => setShow(false)}
          onProceed={onProceed}
          TVfairCondition={
            conditions?.listConditions?.find((item) => item?.condition === form?.condition)?.tradeInValueMin
          }
        />
      )} */}
      {/* {visibleModalNotExistCondition && (
        <ModalNotExistCondition
          isOpen={visibleModalNotExistCondition}
          onClose={() => setvisibleModalNotExistCondition(false)}
        />
      )} */}
    </>
  );
};

export default memo(Step4);
