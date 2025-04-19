import React, { FC, useCallback, useState } from 'react';
import MobileFullScreenModal from '@ui/Modal/MobileFullScreenModal';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { Form, Formik, FormikProps } from 'formik';
import { Doughnut } from 'react-chartjs-2';
import Button from '@ui/Buttons/Primary/Button';
import cx from 'classnames';
import iconDollar from 'assets/img/common/ic_dollar.svg';
import iconPercentage from 'assets/img/common/ic_percentage.svg';
import { formatCurrency } from 'helpers/string.helper';
import { FormValue } from 'components/Account/Personal/MyListing/Form/form';
import FormikRadio from 'components/Formik/Radio/FormikRadio';
import FormikInput from 'components/Formik/Input/FormikInput';
import * as Yup from 'yup';
import BigNumber from 'bignumber.js';
import classes from './profit-calculate-modal.module.scss';
import { CalculatorModel, initCalculator, useCalculator, Value } from './calulator';

interface Props {
  formValue: FormValue;
  onClose: () => void;
  isOpen: boolean;
  setValues: (values: any, shouldValidate?: boolean | undefined) => any;
}

const CalculateSchema = Yup.object().shape({});

const ProfitCalculateModal: FC<Props> = ({ formValue, onClose, isOpen, setValues }) => {
  const [formValues, setFormValues] = useState(initCalculator);
  const calculatedPrice = useCalculator(formValues);

  const dataChart = [
    {
      label: 'Net Profit',
      value: Number(calculatedPrice.netProfit.toFixed(0)),
      color: 'rgb(47, 170, 227)',
    },
    {
      label: 'Item Cost',
      value: Number(Number(formValues.cost).toFixed(0)),
      color: 'rgb(4, 193, 95)',
    },
    {
      label: 'BBB Fee',
      value: Number(calculatedPrice.BBBFee.toFixed(0)),
      color: 'rgb(243, 130, 48)',
    },
    {
      label: 'Paypal Fee',
      value: Number(calculatedPrice.paypalFee.toFixed(0)),
      color: '#EBE880',
    },
  ];
  const handleFormSubmit = useCallback(
    (values: CalculatorModel) => {
      let data: Value = {
        salePrice: calculatedPrice.sale.toFixed(0),
        bestOfferAutoAcceptPrice: formValue.enableAutoAcceptOffer
          ? Number(((Number(calculatedPrice?.sale.toFixed(0)) * 95) / 100).toFixed(2))
          : 0.0,
        minimumOfferAutoAcceptPrice: formValue.enableMinimumOfferAccept
          ? Number(((Number(calculatedPrice?.sale.toFixed(0)) * 60) / 100).toFixed(2))
          : 0.0,
        profitCalculator: {
          calculatorType: values.calculate,
          itemCost: values.cost ? Number(values.cost) : null,
          paypalFeeFixedAmount: values.paypalFixed ? Number(values.paypalFixed) : null,
          paypalFeePercent: values.paypalPercent
            ? new BigNumber(Number(values.paypalPercent)).dividedBy(100).toNumber()
            : null,
          profit: null,
          profitType: values.calculate === 'price' ? values.desired : null,
          sellingPrice: calculatedPrice.sale.toFixed(0),
          shippingFee: values.shippingFee ? Number(values.shippingFee) : null,
        },
      };
      if (values.calculate === 'price' && values.amount) {
        data = {
          ...data,
          profitCalculator: {
            ...data.profitCalculator,
            profit:
              values.desired === 'margin'
                ? new BigNumber(Number(values.amount)).dividedBy(100).toNumber()
                : Number(values.amount),
          },
        };
      }
      setValues(data);
      onClose();
    },
    [calculatedPrice, onClose, setValues, formValue],
  );

  return (
    <MobileFullScreenModal title={'Profit Calculator'} onClose={onClose} isOpen={isOpen} className={classes.modal}>
      <Formik onSubmit={handleFormSubmit} initialValues={formValues} validationSchema={CalculateSchema}>
        {({ handleSubmit, values, handleChange }: FormikProps<CalculatorModel>) => {
          setFormValues(values);
          return (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col xs={12} lg={6}>
                  <div className={cx('d-flex', classes.selectCalulate)}>
                    <FormikRadio
                      name={'calculate'}
                      value={'price'}
                      label={<span className={classes.customLabel}>Calculate my selling price</span>}
                    />
                    <FormikRadio
                      name={'calculate'}
                      value={'profit'}
                      label={<span className={classes.customLabel}>I’ll set my own</span>}
                      className={classes.radio}
                    />
                  </div>
                  {values.calculate === 'profit' && (
                    <div className={classes.formItem}>
                      <h4 className={classes.label}>Selling Price</h4>
                      <FormikInput
                        renderPrefix={<img src={iconDollar} alt={'Dollar Icon'} className="icon-button22" />}
                        type="number"
                        name={'salePrice'}
                        placeholder="0"
                        className={classes.input}
                      />
                    </div>
                  )}
                  <div className={classes.formItem}>
                    <h4 className={classes.label}>Item Cost</h4>
                    <FormikInput
                      renderPrefix={<img src={iconDollar} alt={'Dollar Icon'} className="icon-button22" />}
                      type="number"
                      placeholder="0"
                      name={'cost'}
                      className={classes.input}
                    />
                  </div>
                  <div className={classes.formItem}>
                    <h4 className={classes.label}>Shipping Fee</h4>
                    <FormikInput
                      renderPrefix={<img src={iconDollar} alt={'Dollar Icon'} className="icon-button22" />}
                      type="number"
                      placeholder="0"
                      className={classes.input}
                      name={'shippingFee'}
                    />
                  </div>
                  {values.calculate === 'price' && (
                    <div className={cx(classes.formItem, classes.desired)}>
                      <h4 className={cx(classes.label, 'mb-auto mb-md-2')}>Desired Profit</h4>
                      <div className={'d-flex flex-column flex-grow-1 w-100'}>
                        <div className={cx(classes.groupRadio, 'd-flex')}>
                          <FormikRadio label={'Margin'} value={'margin'} name={'desired'} />
                          <FormikRadio
                            label={'Fixed'}
                            value={'fixed'}
                            name={'desired'}
                            style={{ marginLeft: '50px' }}
                          />
                        </div>
                        <FormikInput
                          renderPrefix={
                            values.desired === 'margin' ? (
                              <img src={iconPercentage} alt={'Dollar Icon'} className="icon-button22" />
                            ) : (
                              <img src={iconDollar} alt={'Dollar Icon'} className="icon-button22" />
                            )
                          }
                          placeholder="0"
                          type="number"
                          className={classes.input}
                          name={'amount'}
                        />
                      </div>
                    </div>
                  )}
                  <div className={classes.formItem}>
                    <h4 className={classes.label}>Paypal Fee</h4>
                    <div className={cx('d-flex align-items-center flex-grow-1', classes.groupFee)}>
                      <FormikInput
                        className={classes.paypalInput}
                        name={'paypalPercent'}
                        disabled={true}
                        placeholder="0"
                        renderPrefix={<img src={iconPercentage} alt={'Percentage Icon'} />}
                      />
                      <h4 className={'mx-4'}>+</h4>
                      <FormikInput
                        className={classes.paypalInput}
                        placeholder="0"
                        name={'paypalFixed'}
                        disabled={true}
                        renderPrefix={<img src={iconDollar} alt={'Dollar Icon'} className="icon-button22" />}
                      />
                    </div>
                  </div>

                  <div className={classes.formItem}>
                    <h4 className={classes.label}>BBB Fee</h4>
                    <h4 className={classes.value}>5% of item sold price</h4>
                  </div>
                </Col>
                <Col xs={12} lg={6}>
                  <div className={'d-flex flex-column flex-md-row'}>
                    <div className={classes.chartContainer}>
                      <Doughnut
                        width={420}
                        height={420}
                        options={{ legend: { display: false } }}
                        data={{
                          datasets: [
                            {
                              data: dataChart.map((item) => item.value),
                              backgroundColor: dataChart.map((item) => item.color),
                              borderWidth: 0,
                            },
                          ],
                          labels: dataChart.map((item) => item.label),
                        }}
                      />
                      <div className={classes.totalChart}>
                        <div className={classes.price}>
                          {formatCurrency(
                            values.calculate === 'price'
                              ? Number(calculatedPrice.sale.toFixed(0))
                              : Number(calculatedPrice.netProfit.toFixed(0)),
                          )}
                        </div>
                        <span className={classes.description}>
                          {values.calculate === 'price' ? 'Recommended Price' : 'Net Profit'}
                        </span>
                      </div>
                    </div>
                    <div className={classes.chartLabelContainer}>
                      {dataChart.map((item) => (
                        <div key={item.label} className={classes.chartLabel}>
                          <div>
                            <span className={classes.label}> {item.label}</span>
                            <br />
                            <span className={classes.price}>{formatCurrency(item.value)}</span>
                          </div>
                          <div
                            className={classes.icon}
                            style={{
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      ))}
                      <div className={classes.salePrice}>
                        <span className={classes.label}>Sale price</span>
                        <br />
                        <span className={classes.price}>{formatCurrency(Number(calculatedPrice.sale.toFixed(0)))}</span>
                      </div>
                    </div>
                  </div>
                  <Button className={'float-md-right mt-4'} type={'submit'}>
                    Set as Sale Price
                  </Button>
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>
    </MobileFullScreenModal>
  );
};

export default ProfitCalculateModal;
