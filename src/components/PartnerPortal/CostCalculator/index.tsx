/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-target-blank */
import Card from '@ui/Cards';
import cx from 'classnames';
import images from 'assets/images';
import React, { FC, useMemo, useState } from 'react';
import Input from '@ui/Inputs/Input';
import Button from '@ui/Buttons/Primary/Button';
import { toastError } from 'helpers/utils.helper';
import { costCalCulatorRequest, CostCalCulatorResponse } from 'api/partner/cost-calculator.api';
import { capitalizeFirstLetter, formatCurrency } from 'helpers/string.helper';
import { exceptionKeyInputNumber } from 'helpers/utilities.helper';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import useScreenDetect from 'hooks/useScreenDetect';
import { ListItemCalculate } from './constraint';
import classes from './cost.module.scss';

const CostCalculator: FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [form, setForm] = useState(ListItemCalculate);
  const { stepTour } = useSelector((store: StoreState) => store.authenticate);
  const { currentWidthScreen } = useScreenDetect();

  const handleSubmitCostCalculator = async () => {
    try {
      if (!inputValue || inputValue.trim() === '') {
        toastError('Please input price.');
        return;
      }
      const response: CostCalCulatorResponse[] = await costCalCulatorRequest(`${inputValue}`);
      if (response && Array.isArray(response)) {
        setForm(response.splice(1, response.length));
      }
    } catch (err) {
      toastError(err);
    }
  };

  const handleReset = () => {
    setInputValue('');
    setForm(ListItemCalculate);
  };

  const renderItem = useMemo(() => {
    return form.map((it, idx) => {
      return (
        <div className={classes.wrapItem} key={it.name}>
          <div className={cx(classes.customTextSize, idx > 5 && classes.textBlue)}>
            {capitalizeFirstLetter(it.name)}
          </div>
          <span className={cx(classes.customTextSize, idx > 5 && classes.textBlue)}>
            {formatCurrency(it.price, false)}
          </span>
        </div>
      );
    });
  }, [form]);

  return (
    <>
      <Card
        className={cx(classes.wrapCard, {
          [classes.wrapCardTour]: stepTour === 9 && currentWidthScreen >= 768,
        })}>
        <div className={classes.header}>Cost Comparison Calculator</div>
        <div className={cx(classes.description, classes.customTextSize)}>Bicycle Blue Book Private Party Value</div>
        <div className={classes.wrapButton}>
          <div className={cx(classes.wrapInput, classes.customTextSize)}>
            <Input
              inputClassName={classes.customInputNumber}
              className={cx(classes.customButtonSize, classes.customTextSize)}
              renderPrefix={<img src={images.listing.icDollarListing} alt="icDollarListing" />}
              placeholder="0"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              type="number"
              maxLength={100}
              onKeyDown={(e) => {
                if (exceptionKeyInputNumber.includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onWheel={(e: any) => e.target.blur()}
            />
          </div>
          <div className={classes.button}>
            <Button
              onClick={handleSubmitCostCalculator}
              buttonType={'primary'}
              className={cx(classes.btnCalculate, classes.customButtonSize)}>
              Calculate
            </Button>
            <Button
              onClick={handleReset}
              buttonType="warning"
              className={cx(classes.btnReset, classes.customButtonSize)}>
              Reset
            </Button>
          </div>
        </div>

        {renderItem}

        <hr className={classes.customHr} />

        <ul className={classes.customUl}>
          <li>Typical time to sell a used bike is 7 to 45 days</li>
          <li>Roughly 15% of online transactions are never completed</li>
          <li>3–5% of used bike sales are returned</li>
          <li>Personal time calculated at $50 per hour</li>
        </ul>
      </Card>
    </>
  );
};

export default CostCalculator;
