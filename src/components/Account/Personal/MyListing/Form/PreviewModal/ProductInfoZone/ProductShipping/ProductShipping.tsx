import React, { FC, useMemo } from 'react';
import Radio from '@ui/Radio';
import classes from 'components/Marketplace/Detail/ProductInfoZone/ProductShipping/product-shipping.module.scss';
import { FormValue } from 'components/Account/Personal/MyListing/Form/form';

interface Props {
  formData: FormValue;
}

const ProductShipping: FC<Props> = ({ formData }) => {
  const onlyLocalPickUp = useMemo(() => {
    return formData?.localPickupShipping && !formData?.shippingMethod;
  }, [formData]);

  return (
    <section className={'my-5'}>
      <div className={classes.shippingInfo}>
        <Radio
          label={<span className={classes.title}>The seller will pack and ship this item</span>}
          checked={!onlyLocalPickUp}
        />
        <div className={classes.description} style={{ marginTop: 20 }}>
          BicycleBlueBook have negotiated a discounted shipping rate of $85 offered on this item.
        </div>
        <ul className={classes.description} style={{ padding: 20 }}>
          <li>
            All items require insurance of $0.75 per $100 after the first $100 (automatically included as part of
            shipping cost at checkout).
          </li>
          <li>
            Standard shipping applies to contiguous 48 States only (Please ask seller for shipping cost to other
            locations).
          </li>
          <li>Delivery date is based on the seller's handling time and when the seller receives cleared payment.</li>
          <li>
            A payment is considered 'cleared' after your payment has been deposited into the seller's account. If you
            pay using PayPal, the payment may clear immediately.
          </li>
        </ul>
      </div>
      <div className={classes.shippingInfo}>
        <Radio label={<span className={classes.title}>Local Pickup</span>} checked={onlyLocalPickUp} />
        <div className={classes.description} style={{ marginTop: 20 }}>
          Seller will contact you once the purchase is complete to arrange the pickup.
        </div>
      </div>
    </section>
  );
};

export default ProductShipping;
