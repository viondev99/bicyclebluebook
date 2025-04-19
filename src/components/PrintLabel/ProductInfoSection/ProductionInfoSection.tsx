import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import StoreState from 'model/store';
import { formatCurrency } from 'helpers/string.helper';
import Card from '@ui/Cards';
import classes from './product-info-section.module.scss';

const ProductionInfoSection: React.FC = () => {
  const { title, currentListedPrice, sale } = useSelector((state: StoreState) => state.marketplace.detail);

  const shippingAddress = useMemo(() => {
    return `${sale?.apartment || ''}${sale?.apartment ? ', ' : ''}${sale?.shippingAddressLine} ${sale?.shippingCity} ${
      sale?.shippingState
    } ${sale?.shippingPostalCode}`;
  }, [sale]);

  return (
    <Card className={classes.productInfoContainer}>
      <h1 className={classes.productTitle}>{title}</h1>
      <p className={classes.productPrice}>{formatCurrency(currentListedPrice)}</p>
      <div className={classes.productRow}>
        <p className={classes.label}>Buyer Name</p>
        <p className={classes.value}>{sale?.buyerDisplayName || ''}</p>
      </div>
      <div className={classes.productRow}>
        <p className={classes.label}>Shipping Address</p>
        <p className={classes.value}>{shippingAddress}</p>
      </div>
      <div className={classes.productRow}>
        <p className={classes.label}>Order</p>
        <p className={classes.value}>{sale?.orderCode ? `#${sale?.orderCode}` : ''}</p>
      </div>
    </Card>
  );
};

export default ProductionInfoSection;
