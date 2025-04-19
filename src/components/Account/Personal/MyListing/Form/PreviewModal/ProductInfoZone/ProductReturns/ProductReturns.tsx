import React, { FC, useCallback } from 'react';

import classes from 'components/Marketplace/Detail/ProductInfoZone/ProductReturns/product-returns.module.scss';
import { FormValue } from '../../../form';

interface Props {
  formData: FormValue;
}

const ProductReturns: FC<Props> = ({ formData }) => {
  const { returnShippingPayer, returnWithinDays, isAllowReturn } = formData;

  const renderContent = useCallback(() => {
    if (isAllowReturn) {
      return (
        <>
          <div className={'my-5'}>
            <div className={classes.title}>Payment</div>
            <div className={classes.description}>
              We have now partnered up with Stripe, a reliable payment processing company, as the middle man for our
              private transactions. This means we will hold onto your money when buying from a private seller or store
              until you receive your item. This provides you with the utmost security when shopping with us.
            </div>
          </div>
          <div className={'my-5'}>
            <div className={classes.title}>Returns</div>
            <div className={classes.description}>
              After receiving the item, contact the seller within {returnWithinDays} days.
              <br />
              {returnShippingPayer === 'SELLER' ? 'Seller' : 'Buyer'} pays return shipping.
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        <div className={'my-5'}>
          <div className={classes.title}>Payment</div>
          <div className={classes.description}>
            WWe have now partnered up with Stripe, a reliable payment processing company, as the middle man for our
            private transactions. This means we will hold onto your money when buying from a private seller or store
            until you receive your item. This provides you with the utmost security when shopping with us.
          </div>
        </div>
        <div className={'my-5'}>
          <div className={classes.title}>Returns</div>
          <div className={classes.description}>The seller does not accept returns.</div>
        </div>
      </>
    );
  }, [isAllowReturn, returnWithinDays, returnShippingPayer]);

  return <section className={classes.returnsInfo}>{renderContent()}</section>;
};

export default ProductReturns;
