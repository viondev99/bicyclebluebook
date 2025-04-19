/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-cycle */
import Radio from '@ui/Radio';
import cx from 'classnames';
import StoreState from 'model/store';
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import React, { FC, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Skeleton from 'react-loading-skeleton';
import { getListTradeInBicycle } from 'store/partner/account/account.action';
import { Form, Formik, FormikProps } from 'formik';
import useScreenDetect from 'hooks/useScreenDetect';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import { CommonComponents } from 'model/store/common.model';
import { getComponents } from 'store/common/common.action';
import TooltipWheelDrivertrain from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/TooltipWheelDrivertrain';
import cloneDeep from 'lodash/cloneDeep';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import { TradeInScoreCardsProps } from '../../StandardQuote/formDefaultValue';
import { constTitleStep } from '../../StandardQuote/constraint';
import classes from './wheel-drivertrain-framesize.module.scss';

const ModalCustomQuoteModification = React.lazy(() =>
  import('components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalCustomQuoteModification'),
);
const ModalTooltipWheelDrivertrain = React.lazy(() =>
  import('components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalTooltipWheelDrivertrain'),
);
interface Props {
  form: TradeInScoreCardsProps;
  formCurrentStep: GetListTradeInBicycleParams;
  onChangeForm: (values: TradeInScoreCardsProps) => void;
  isCompleted: boolean;
  isRedBarn?: boolean;
}

interface FormValue {
  frameSize: string;
}

const WheelDrivertrainFramesize: FC<Props> = ({ form, formCurrentStep, isCompleted, onChangeForm, isRedBarn }) => {
  const dispatch = useDispatch();
  const { currentWidthScreen } = useScreenDetect();
  const initialValues: FormValue = {
    frameSize: form?.frameSize,
  };
  const components = useSelector((store: StoreState) => store.common.components);
  const dataTradeInBicycle = useSelector((store: StoreState) => store.partner.account.dataTradeInBicycle);
  const loading = useSelector((store: StoreState) => store.partner.account.loading);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [visibleModalCustomQuoteModification, setVisibleModalCustomQuoteModification] = useState(false);
  const [visibleModalTooltipWheelDrivertrain, setVisibleModalTooltipWheelDrivertrain] = useState('');
  const { listDataStepStandardQuote, indexScorecardSelected, type, listDataStepEbikeQuote } = useSelector(
    (state: StoreState) => state.partner.scorecard.createScoreCardQuantityData,
  );

  const msrpLess500 = dataTradeInBicycle?.msrp && Number(dataTradeInBicycle?.msrp) < 500 && !isRedBarn;

  const listModifications = useMemo(() => {
    const tempListModifications: any = {};
    if (dataTradeInBicycle?.upgradeComps?.length) {
      dataTradeInBicycle.upgradeComps.forEach((item: any) => {
        if (tempListModifications[item.name]) {
          tempListModifications[item.name].selects.unshift({
            value: item.id,
            label: item.up ? 'Upgraded' : 'Downgraded',
          });
        } else {
          tempListModifications[item.name] = {
            selects: [
              {
                value: item.id,
                label: item.up ? 'Upgraded' : 'Downgraded',
              },
              { value: '', label: 'None' },
            ],
          };
        }
      });
    }
    return tempListModifications;
  }, [dataTradeInBicycle]);

  useEffect(() => {
    if (formCurrentStep.bicycleId) {
      dispatch(getListTradeInBicycle(formCurrentStep));
    }
  }, [dispatch, formCurrentStep]);

  useEffect(() => {
    if (Object.keys(listModifications)?.length) {
      let newSelectedOptions: any = Object.keys(listModifications).map((it) => {
        return {
          key: it,
          value: '',
        };
      });
      if (form.upgradeCompIds?.length) {
        newSelectedOptions = [...form.upgradeCompIds];
      }

      setSelectedOptions(newSelectedOptions);
    }
  }, [form.upgradeCompIds, listModifications]);

  const frameSizeOptions = useMemo(() => {
    const frameSizeComponent =
      components?.bicycleDetailComp?.comps && Array.isArray(components?.bicycleDetailComp?.comps)
        ? components?.bicycleDetailComp?.comps?.find((it) => it.id === 178)
        : null;
    return frameSizeComponent?.selects?.length
      ? frameSizeComponent?.selects?.map((item) => {
          return {
            value: item.value,
            label: item.value,
          };
        })
      : [];
  }, [components]);

  useEffect(() => {
    const frameSizeComponent =
      components?.bicycleDetailComp?.comps && Array.isArray(components?.bicycleDetailComp?.comps)
        ? components?.bicycleDetailComp?.comps?.find((it) => it.id === 178)
        : null;

    if (!frameSizeComponent) {
      dispatch(getComponents([CommonComponents.DetailBicycleMyListing]));
    }
  }, [dispatch]);

  const handleChangeCheckbox = useCallback(
    (key: string, value: string | number) => {
      if (isCompleted) {
        return;
      }
      if (msrpLess500) {
        setVisibleModalCustomQuoteModification(true);
        return;
      }

      const newSelectedOptions = [...selectedOptions];
      const _index = newSelectedOptions.findIndex((it) => it.key === key);
      let newUpgradeCompIds: any = [];
      if (_index !== -1) {
        newSelectedOptions[_index].value = value;
        setSelectedOptions(newSelectedOptions);
        newUpgradeCompIds = newSelectedOptions;

        onChangeForm({
          ...form,
          upgradeCompIds: newUpgradeCompIds,
        });
      } else {
        newUpgradeCompIds = [
          ...selectedOptions,
          ...[
            {
              key,
              value,
            },
          ],
        ];
        setSelectedOptions(newUpgradeCompIds);

        onChangeForm({
          ...form,
          upgradeCompIds: newUpgradeCompIds,
        });
      }

      const cloneArr =
        type === 'standard' || type === 'red-barn'
          ? cloneDeep(listDataStepStandardQuote)
          : cloneDeep(listDataStepEbikeQuote);
      const keyy = type === 'standard' || type === 'red-barn' ? 'listDataStepStandardQuote' : 'listDataStepEbikeQuote';
      cloneArr[indexScorecardSelected] = {
        ...cloneArr[indexScorecardSelected],
        upgradeCompIds: newUpgradeCompIds,
      };
      dispatch(
        scoreCardAction.setCreateScorecardQuantity({
          [keyy]: cloneArr,
        }),
      );
    },
    [
      dispatch,
      form,
      indexScorecardSelected,
      isCompleted,
      listDataStepEbikeQuote,
      listDataStepStandardQuote,
      msrpLess500,
      onChangeForm,
      selectedOptions,
      type,
    ],
  );

  const handleChangeFormik = useCallback(
    (key: string, value: string) => {
      const cloneArr =
        type === 'standard' || type === 'red-barn'
          ? cloneDeep(listDataStepStandardQuote)
          : cloneDeep(listDataStepEbikeQuote);
      const keyy = type === 'standard' || type === 'red-barn' ? 'listDataStepStandardQuote' : 'listDataStepEbikeQuote';
      cloneArr[indexScorecardSelected] = {
        ...cloneArr[indexScorecardSelected],
        [key]: value,
      };
      dispatch(
        scoreCardAction.setCreateScorecardQuantity({
          [keyy]: cloneArr,
        }),
      );

      onChangeForm({
        ...form,
        [key]: value,
      });
    },
    [dispatch, form, indexScorecardSelected, listDataStepEbikeQuote, listDataStepStandardQuote, onChangeForm, type],
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
      </Row>
    );
  }, []);

  const renderFormRadio = useMemo(() => {
    return Object.keys(listModifications).map((key) => {
      return (
        <Row className={cx(classes.customRow)} key={key}>
          <Col lg={7} md={4} sm={12} className={classes.customCol}>
            <div className={classes.wrapTitle}>
              <span>{key}</span> <TooltipWheelDrivertrain onClick={() => setVisibleModalTooltipWheelDrivertrain(key)} />
            </div>
          </Col>
          <Col lg={5} md={8} sm={12} className={classes.customCol}>
            <Row>
              {listModifications[key].selects.map((item: any) => {
                return (
                  <Col key={key}>
                    <Radio
                      disabled={isCompleted}
                      name={key}
                      key={item}
                      checked={selectedOptions.some((it) => it.value === item.value && it.key === key)}
                      className={classes.customCheckbox}
                      label={item.label}
                      onChange={() => handleChangeCheckbox(key, item.value)}
                    />
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      );
    });
  }, [handleChangeCheckbox, isCompleted, listModifications, selectedOptions]);

  const renderFormRadioMobile = useMemo(() => {
    return Object.keys(listModifications).map((key) => {
      return (
        <Row className={cx(classes.customRow)} key={key}>
          <Col lg={6} md={6} sm={12} xs className={classes.customCol}>
            <div className={classes.wrapTitle}>
              <span>{key}</span> <TooltipWheelDrivertrain onClick={() => setVisibleModalTooltipWheelDrivertrain(key)} />
            </div>
          </Col>
          <Col lg={6} md={6} sm={12} className={classes.customCol}>
            <div className={classes.wrapCheckboxMobile}>
              {listModifications[key].selects.map((item: any) => {
                return (
                  <div
                    onClick={() => handleChangeCheckbox(key, item.value)}
                    className={cx(
                      classes.itemCheckboxMobile,
                      selectedOptions.some((it) => it.value === item.value && it.key === key) && classes.active,
                    )}
                    key={item}>
                    {item?.label}
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>
      );
    });
  }, [handleChangeCheckbox, listModifications, selectedOptions]);

  const renderFormSelect = useMemo(() => {
    return (
      <Row className={classes.customRow}>
        <Col lg={7} md={4} sm={12} className={cx(classes.customCol, 'd-flex align-items-center')}>
          <div className={classes.wrapTitle}>Frame Size*</div>
        </Col>
        <Col lg={5} md={8} sm={12} className={classes.customCol}>
          <div>
            <FormikSelect
              inputId={'select-state'}
              options={frameSizeOptions}
              placeholder="Select Frame Size"
              selectStyles={{
                control: {
                  minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
                },
              }}
              name="frameSize"
              isSearchable={true}
              onChangeValue={(value) => handleChangeFormik('frameSize', value)}
              disabled={isCompleted}
              className={classes.customSelect}
            />
          </div>
        </Col>
      </Row>
    );
  }, [currentWidthScreen, frameSizeOptions, handleChangeFormik, isCompleted]);

  return (
    <>
      <Formik onSubmit={null} initialValues={initialValues} enableReinitialize={true}>
        {() => {
          return (
            <Form>
              <div className={cx(classes.wrapSubStepFour, classes.isLargeScreen)}>
                <div className={classes.headerStep}>{constTitleStep.StepOneSubStepFour}</div>
                {loading ? renderLoading : renderFormRadio}
                {loading ? renderLoading : renderFormSelect}
              </div>
              <div className={cx(classes.wrapSubStepFour, classes.isSmallScreen)}>
                <div className={classes.headerStep}>{constTitleStep.StepOneSubStepFour}</div>
                {loading ? renderLoading : renderFormRadioMobile}
                {loading ? renderLoading : renderFormSelect}
              </div>
            </Form>
          );
        }}
      </Formik>
      {visibleModalCustomQuoteModification && (
        <Suspense fallback={null}>
          <ModalCustomQuoteModification
            isOpen={visibleModalCustomQuoteModification}
            onClose={() => {
              setVisibleModalCustomQuoteModification(false);
            }}
          />
        </Suspense>
      )}

      {visibleModalTooltipWheelDrivertrain !== '' && (
        <Suspense fallback={null}>
          <ModalTooltipWheelDrivertrain
            isOpen={visibleModalTooltipWheelDrivertrain !== ''}
            onClose={() => {
              setVisibleModalTooltipWheelDrivertrain('');
            }}
            type={visibleModalTooltipWheelDrivertrain}
          />
        </Suspense>
      )}
    </>
  );
};

export default WheelDrivertrainFramesize;
