import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

export const calculateSalePrice = (
  desired: 'margin' | 'fixed',
  shippingFee: BigNumber,
  cost: BigNumber,
  profit: BigNumber,
  paypalFixed: BigNumber,
  paypalPercent: BigNumber,
): number => {
  const percent = paypalPercent.dividedBy(100);

  if (desired === 'margin') {
    return cost
      .plus(paypalFixed)
      .plus(percent.multipliedBy(shippingFee))
      .dividedBy(profit.dividedBy(100).negated().plus(1).minus(0.05).minus(percent))
      .toNumber();
  }
  return percent
    .multipliedBy(shippingFee)
    .plus(paypalFixed)
    .plus(cost)
    .plus(profit)
    .dividedBy(percent.negated().minus(0.05).plus(1))
    .toNumber();
};

export const calculatePaypalFee = (
  paypalFixed: BigNumber,
  paypalPercent: BigNumber,
  shippingFee: BigNumber,
  salePrice: BigNumber,
): number => paypalFixed.plus(paypalPercent.dividedBy(100).multipliedBy(shippingFee.plus(salePrice))).toNumber();

export const calculateBBBFee = (salePrice: BigNumber): number => salePrice.multipliedBy(0.05).toNumber();

export const calculateDesiredProfit = (
  desired: 'margin' | 'fixed',
  amount: BigNumber,
  cost: BigNumber,
  salePrice: BigNumber,
  BBBFee: BigNumber,
  paypalFee: BigNumber,
) => (desired === 'margin' ? salePrice.minus(cost).minus(BBBFee).minus(paypalFee).toNumber() : amount.toNumber());

export const calculateNetProfit = (
  salePrice: BigNumber,
  shippingFee: BigNumber,
  cost: BigNumber,
  paypalFixed: BigNumber,
  paypalPercent: BigNumber,
) => {
  const percent = paypalPercent.dividedBy(100);
  return percent
    .negated()
    .minus(0.05)
    .plus(1)
    .multipliedBy(salePrice)
    .minus(percent.multipliedBy(shippingFee))
    .minus(paypalFixed)
    .minus(cost)
    .toNumber();
};

export interface CalculatorModel {
  calculate: 'price' | 'profit';
  salePrice: number | '';
  cost: number | '';
  shippingFee: number | '';
  desired: 'margin' | 'fixed';
  amount: number | '';
  paypalPercent: number | '';
  paypalFixed: number | '';
}

export const initCalculator: CalculatorModel = {
  calculate: 'price',
  desired: 'margin',
  salePrice: '',
  cost: '',
  shippingFee: '',
  amount: '',
  paypalPercent: 2.9,
  paypalFixed: 0.3,
};
export const useCalculator = ({
  desired,
  shippingFee,
  cost,
  calculate,
  paypalFixed,
  paypalPercent,
  amount,
  salePrice,
}: CalculatorModel) => {
  return useMemo(() => {
    let sale = calculateSalePrice(
      desired,
      new BigNumber(Number(shippingFee)),
      new BigNumber(Number(cost)),
      new BigNumber(Number(amount)),
      new BigNumber(Number(paypalFixed)),
      new BigNumber(Number(paypalPercent)),
    );
    let BBBFee = calculateBBBFee(new BigNumber(sale));
    let paypalFee = calculatePaypalFee(
      new BigNumber(Number(paypalFixed)),
      new BigNumber(Number(paypalPercent)),
      new BigNumber(Number(shippingFee)),
      new BigNumber(sale),
    );
    let netProfit = calculateDesiredProfit(
      desired,
      new BigNumber(Number(amount)),
      new BigNumber(Number(cost)),
      new BigNumber(Number(sale)),
      new BigNumber(Number(BBBFee)),
      new BigNumber(Number(paypalFee)),
    );
    if (calculate === 'profit') {
      sale = Number(salePrice);
      netProfit = calculateNetProfit(
        new BigNumber(sale),
        new BigNumber(Number(shippingFee)),
        new BigNumber(Number(cost)),
        new BigNumber(Number(paypalFixed)),
        new BigNumber(Number(paypalPercent)),
      );
      BBBFee = calculateBBBFee(new BigNumber(sale));
      paypalFee = calculatePaypalFee(
        new BigNumber(Number(paypalFixed)),
        new BigNumber(Number(paypalPercent)),
        new BigNumber(Number(shippingFee)),
        new BigNumber(sale),
      );
    }

    return {
      netProfit,
      sale,
      paypalFee,
      BBBFee,
    };
  }, [amount, calculate, cost, desired, paypalFixed, paypalPercent, salePrice, shippingFee]);
};

export interface Value {
  salePrice: string;
  bestOfferAutoAcceptPrice: number;
  minimumOfferAutoAcceptPrice: number;
  profitCalculator?: {
    calculatorType: 'price' | 'profit';
    itemCost: number;
    paypalFeeFixedAmount: number;
    paypalFeePercent: number;
    profit: number | null | BigNumber;
    profitType: 'margin' | 'fixed';
    sellingPrice: string;
    shippingFee: number;
  };
}
