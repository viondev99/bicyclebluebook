import Card from '@ui/Cards';
import cx from 'classnames';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { exceptionKeyInputNumber, formatNumberLarge, formatNumberLargeDecimal } from 'helpers/utilities.helper';
import Input from '@ui/Inputs/Input';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import StoreState from 'model/store';
import useScreenDetect from 'hooks/useScreenDetect';
import FilterRange from './FilterRange/FilterRange';
import images from '@images';
import classes from './general-info.module.scss';

interface FormRangeProps {
  scorecardEvaluations: [number, number];
  scorecardConversion: [number, number];
  avgTradeInValue: [number, number];
  saleMultiTimes: [number, number];
}
interface StepProps {
  scorecardEvaluations: number;
  scorecardConversion: number;
  avgTradeInValue: number;
  saleMultiTimes: number;
}

const GeneralInfo: FC = () => {
  const [form, setForm] = useState<FormRangeProps>({
    scorecardEvaluations: [0, 0],
    scorecardConversion: [0, 0],
    avgTradeInValue: [0, 0],
    saleMultiTimes: [0, 0],
  });
  const [range, setRange] = useState<FormRangeProps>({
    scorecardEvaluations: [0, 100],
    scorecardConversion: [0, 100],
    avgTradeInValue: [300, 2000],
    saleMultiTimes: [0, 10],
  });
  const [step, setStep] = useState<StepProps>({
    scorecardEvaluations: 1,
    scorecardConversion: 0.01,
    avgTradeInValue: 1,
    saleMultiTimes: 1,
  });
  const totalAdditionalMonthlyStoreRevenue = useMemo(() => {
    const avgTradeInValue = form.avgTradeInValue[1] || 0;
    const saleMultiTimes = form.saleMultiTimes[1] || 0;
    const scorecardConversion = form.scorecardConversion[1] ? form.scorecardConversion[1] / 100 : 0;
    const scorecardEvaluations = form.scorecardEvaluations[1] || 0;

    const total = avgTradeInValue * saleMultiTimes * scorecardConversion * scorecardEvaluations;
    return total;
  }, [form]);
  const dispatch = useDispatch();
  const { replace } = useRouter();
  const { stepTour } = useSelector((store: StoreState) => store.authenticate);
  const { currentWidthScreen } = useScreenDetect();

  const handleChangeInputNumber = useCallback(
    (value: string, key: string) => {
      let newValue = value;
      if (Number(newValue) > 100) {
        newValue = '100';
      }
      setForm({
        ...form,
        [key]: [0, Number(newValue)],
      });
    },
    [form],
  );
  const renderInputNumber = useCallback(
    (fieldName: string) => {
      return (
        <Input
          className={classes.customButtonSize}
          inputClassName={classes.customInputNumber}
          type="number"
          onKeyDown={(e) => {
            if (exceptionKeyInputNumber.includes(e.key)) {
              e.preventDefault();
            }
          }}
          onWheel={(e: any) => e.target.blur()}
          value={form.scorecardConversion[1] === 0 ? undefined : form.scorecardConversion[1]}
          onChange={(e) => handleChangeInputNumber(e.target.value, fieldName)}
          max={100}
        />
      );
    },
    [form, handleChangeInputNumber],
  );
  const handleChangeFilterRange = useCallback(
    (rangeValues: [number, number], key: string) => {
      setForm({
        ...form,
        [key]: rangeValues,
      });
    },
    [form],
  );

  const formatAvgTradeInValue = useCallback((value: number) => {
    return `$${formatNumberLarge(value)}`;
  }, []);

  const formatSaleMultiTimes = useCallback((value: number) => {
    return `${value}x`;
  }, []);

  const renderFilterRange = useCallback(
    (
      value: [number, number],
      rangeValue: [number, number],
      stepValue: number,
      key: string,
      formatDisplayValue?: (value: number) => void,
    ) => {
      return (
        <FilterRange
          range={rangeValue}
          step={stepValue}
          value={value}
          onChange={(event: [number, number]) => handleChangeFilterRange(event, key)}
          formatDisplayValue={formatDisplayValue}
        />
      );
    },
    [form],
  );

  return (
    <>
      <Card
        className={cx(classes.customCard, {
          [classes.customCardTour]: stepTour === 11 && currentWidthScreen >= 768,
        })}>
        <div className={cx(classes.headerText, classes.wrapGeneralHeader)}>Increase bike sales with trade-in</div>
        <div className={cx(classes.description, classes.wrapDescription)}>
          Use this sales calculator to determine your store’s incremental revenue opportunity with the BBB trade in
          program. Use the sliders to adjust the values in each section to calculate your additional monthly store
          revenue.
        </div>
        <div className={classes.wrapForm}>
          <div className={cx(classes.title, classes.mb50)}>
            <img src={images.tradeIn.ic_calendar_sale_calculator} alt="" /> Number of monthly scorecard evaluations
          </div>
          <Row className={classes.customRow}>
            <Col md={6} className={classes.customCol}>
              {renderFilterRange(
                form.scorecardEvaluations,
                range.scorecardEvaluations,
                step.scorecardEvaluations,
                'scorecardEvaluations',
              )}
            </Col>
          </Row>
        </div>

        <div className={classes.wrapForm}>
          <div className={cx(classes.title, classes.mb50, classes.mobileScoreCardConvension)}>
            <img src={images.tradeIn.ic_percent_sale_calculator} alt="" /> Scorecard conversion Percentage
          </div>
          <Row className={classes.customRow}>
            <Col lg={6} md={6} className={classes.customCol}>
              <div className={classes.wrapFilterRangeMarginTop}>
                {renderFilterRange(
                  form.scorecardConversion,
                  range.scorecardConversion,
                  step.scorecardConversion,
                  'scorecardConversion',
                )}
              </div>
            </Col>
            <Col lg={6} md={5} className={classes.customCol}>
              <div className={classes.wrapInputCenter}>
                {renderInputNumber('scorecardConversion')}
                <div className={classes.title}>%</div>
              </div>
            </Col>
          </Row>
        </div>

        <div className={classes.wrapForm}>
          <div className={cx(classes.title, classes.mb50)}>
            <img src={images.tradeIn.ic_calendar_dolar_sale_calculator} alt="" /> Average trade in value
          </div>
          <Row className={classes.customRow}>
            <Col md={6} className={classes.customCol}>
              {renderFilterRange(
                form.avgTradeInValue,
                range.avgTradeInValue,
                step.avgTradeInValue,
                'avgTradeInValue',
                formatAvgTradeInValue,
              )}
            </Col>
          </Row>
        </div>

        <div className={classes.wrapForm}>
          <div className={cx(classes.title, classes.mb50)}>
            <img src={images.tradeIn.ic_multi_times_sale_calculator} alt="" /> Trade in sales multiplier
          </div>
          <Row className={classes.customRow}>
            <Col md={6} className={classes.customCol}>
              {renderFilterRange(
                form.saleMultiTimes,
                range.saleMultiTimes,
                step.saleMultiTimes,
                'saleMultiTimes',
                formatSaleMultiTimes,
              )}
            </Col>
          </Row>
        </div>

        <hr className={classes.customHr} />

        <div className={classes.wrapResult}>
          <div className={classes.title}>Additional monthly store revenue</div>
          <div className={classes.resultTotal}>${formatNumberLargeDecimal(totalAdditionalMonthlyStoreRevenue)}</div>
        </div>
      </Card>
    </>
  );
};

export default GeneralInfo;
