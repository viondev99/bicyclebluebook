import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import StoreState from 'model/store';
import classes from './product-shipping.module.scss';
import { formatCurrency } from 'helpers/string.helper';

interface Props {
  typeCondition?: number;
  shippingCost?: number;
}

function ProductShippingFee(props: Props) {
  const productDetail = useSelector((state: StoreState) => state.marketplace.detail);
  const { typeCondition, shippingCost } = props;

  const renderByCondition = useMemo(() => {
    switch (typeCondition) {
      case 0: {
        return (
          <ul className={classes.wrapUL}>
            <li className={classes.mb10}>
              <strong className={classes.beStrong}>Option 1: </strong>
              <span>
                Local pickup only. Seller will contact you once the purchase is complete to arrange the pickup.
              </span>
            </li>
            <li>
              <strong className={classes.beStrong}>Option 2: </strong>
              <span>Free shipping</span>
            </li>
          </ul>
        );
      }

      case 1: {
        return (
          <ul className={classes.wrapUL}>
            <li className={classes.mb10}>
              <strong className={classes.beStrong}>Option 1: </strong>
              <span>
                <strong className={classes.beStrong}>{`$${formatCurrency(
                  shippingCost || productDetail?.shippingFee,
                )}`}</strong>
                <span className={classes.ml10}>
                  {productDetail?.oversizedShipping ? 'This item requires an oversize box' : 'Standard shipping'}
                </span>
              </span>
            </li>
            <li>
              <strong className={classes.beStrong}>Option 2: </strong>
              <span>
                Local pickup only. Seller will contact you once the purchase is complete to arrange the pickup.
              </span>
            </li>
          </ul>
        );
      }

      case 2: {
        return (
          <>
            <strong className={classes.beStrong}>{`$${formatCurrency(
              shippingCost || productDetail?.shippingFee,
            )}`}</strong>
            <span className={classes.ml10}>
              {productDetail?.oversizedShipping ? 'This item requires an oversize box' : 'Standard shipping'}
            </span>
          </>
        );
      }

      case 3: {
        return (
          <ul className={classes.wrapUL}>
            <li className={classes.mb10}>
              <strong>Option 1: </strong>
              <span>
                <strong>{`$${formatCurrency(productDetail?.shippingFee)}`}</strong>
                <span className={classes.ml10}>
                  {productDetail?.oversizedShipping ? 'This item requires an oversize box' : 'Standard shipping'}{' '}
                  {productDetail?.shippingProfileLabel ? `(${productDetail.shippingProfileLabel})` : ''}
                </span>
              </span>
            </li>
            <li>
              <strong className={classes.beStrong}>Option 2: </strong>
              <span>
                Local pickup only. Seller will contact you once the purchase is complete to arrange the pickup.
              </span>
            </li>
          </ul>
        );
      }

      case 4: {
        return (
          <>
            <strong className={classes.beStrong}>{`$${formatCurrency(productDetail?.shippingFee)}`}</strong>
            <span className={classes.ml10}>
              {productDetail?.oversizedShipping ? 'This item requires an oversize box' : 'Standard shipping'}{' '}
              {productDetail?.shippingProfileLabel ? `(${productDetail.shippingProfileLabel})` : ''}
            </span>
          </>
        );
      }

      case 5: {
        return (
          <ul className={classes.wrapUL}>
            <li className={classes.mb10}>
              <strong className={classes.beStrong}>Option 1: </strong>
              <span>
                <strong className={classes.beStrong}>{`$${formatCurrency(productDetail?.shippingFee)}`}</strong>
                <span className={classes.ml10}>
                  {productDetail?.oversizedShipping ? 'This item requires an oversize box' : 'Standard shipping'}
                </span>
              </span>
            </li>
            <li>
              <strong className={classes.beStrong}>Option 2: </strong>
              <span>
                Local pickup only. Seller will contact you once the purchase is complete to arrange the pickup.
              </span>
            </li>
          </ul>
        );
      }

      case 6: {
        return (
          <>
            <strong className={classes.beStrong}>{`$${formatCurrency(productDetail?.shippingFee)}`}</strong>
            <span className={classes.ml10}>
              {productDetail?.oversizedShipping ? 'This item requires an oversize box' : 'Standard shipping'}
            </span>
          </>
        );
      }

      default:
        return null;
    }
  }, [typeCondition, productDetail, shippingCost]);

  return renderByCondition;
}

export default ProductShippingFee;
