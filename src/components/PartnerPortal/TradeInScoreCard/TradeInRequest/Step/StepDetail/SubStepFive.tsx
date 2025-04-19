/* eslint-disable import/no-cycle */
import Radio from '@ui/Radio';
import cx from 'classnames';
import StoreState from 'model/store';
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import React, { FC, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Skeleton from 'react-loading-skeleton';
import { Form, Formik } from 'formik';
import { upgradeComps } from 'helpers/utilities.helper';
import { constTitleStep } from '../../constraint';
import classes from './sub-step-five.module.scss';
import { TradeInScoreCardsProps } from '../../formDefaultValue';

const ModalCustomQuoteModification = React.lazy(() =>
  import('components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalCustomQuoteModification'),
);
interface Props {
  form: TradeInScoreCardsProps;
  formStepDetailSubStepTwo: GetListTradeInBicycleParams;
  onChangeForm: (values: TradeInScoreCardsProps) => void;
  setUpgradeCompIds: (values: number[]) => void;
  isCompleted: boolean;
  upgradeCompIds: number[];
}

interface FormValue {
  frameSize: string;
}

const SubStepFour: FC<Props> = ({
  form,
  formStepDetailSubStepTwo,
  isCompleted,
  onChangeForm,
  setUpgradeCompIds,
  upgradeCompIds,
}) => {
  const initialValues: FormValue = {
    frameSize: form?.frameSize,
  };
  const loading = useSelector((store: StoreState) => store.partner.account.loading);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [visibleModalCustomQuoteModification, setVisibleModalCustomQuoteModification] = useState(false);

  const handleChangeCheckbox = useCallback(
    (key: string, value: string | number) => {
      const newSelectedOptions = [...selectedOptions];
      const _index = newSelectedOptions.findIndex((it) => it.key === key);
      if (_index !== -1) {
        newSelectedOptions[_index].value = value;
        setSelectedOptions(newSelectedOptions);
        setUpgradeCompIds(newSelectedOptions);
      } else {
        setSelectedOptions([
          ...selectedOptions,
          ...[
            {
              key,
              value,
            },
          ],
        ]);
        setUpgradeCompIds([
          ...selectedOptions,
          ...[
            {
              key,
              value,
            },
          ],
        ]);
      }
    },
    [selectedOptions, setUpgradeCompIds],
  );

  useEffect(() => {
    if (upgradeCompIds?.length === 0) {
      setSelectedOptions([
        { key: 'Wheels', value: '' },
        { key: 'Drivetrain', value: '' },
      ]);
      return;
    }
    setSelectedOptions([...upgradeCompIds]);
  }, []);

  const listModifications = useMemo(() => {
    const tempListModifications: any = {};

    upgradeComps.forEach((item: any) => {
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

    return tempListModifications;
  }, []);

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

  const isChecked = useCallback(
    (key: string, item: any) => {
      const op = selectedOptions.find((it) => it.value === key);
      if (!op) {
        return item.value === '';
      }
      return op.id === item.value || (op.value === '' && item.value === '');
    },
    [selectedOptions],
  );

  const renderFormRadio = useMemo(() => {
    return Object.keys(listModifications).map((key) => {
      return (
        <Row className={cx(classes.customRow)} key={key}>
          <Col lg={7} md={7} sm={12} className={classes.customCol}>
            <div className={classes.wrapTitle}>{key}</div>
          </Col>
          <Col lg={5} md={5} sm={12} className={classes.customCol}>
            <Row>
              {listModifications[key].selects.map((item: any) => {
                return (
                  <Col key={key}>
                    <Radio
                      disabled={!isCompleted}
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
          <Col lg={6} md={6} sm={12} xs={12} className={classes.customCol}>
            <div className={classes.wrapTitle}>{key}</div>
          </Col>
          <Col lg={6} md={6} sm={12} xs={12} className={classes.customCol}>
            <div className={classes.wrapCheckboxMobile}>
              {listModifications[key].selects.map((item: any) => {
                return (
                  <div
                    className={cx(
                      classes.itemCheckboxMobile,
                      selectedOptions.some((it) => it.value === item.value && it.key === key) && classes.active,
                    )}
                    key={item}
                    onClick={() => handleChangeCheckbox(key, item.value)}>
                    {item?.label}
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>
      );
    });
  }, [handleChangeCheckbox, isChecked, listModifications]);

  return (
    <>
      <Formik onSubmit={null} initialValues={initialValues} enableReinitialize={true}>
        {() => {
          return (
            <Form>
              <div className={classes.headerStep}>{constTitleStep.StepOneSubStepFour}</div>
              <div className={cx(classes.wrapSubStepFour, classes.isLargeScreen)}>
                {loading ? renderLoading : renderFormRadio}
              </div>
              <div className={cx(classes.wrapSubStepFour, classes.isSmallScreen)}>
                {loading ? renderLoading : renderFormRadioMobile}
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
    </>
  );
};

export default SubStepFour;
