import React, { FC, useCallback, useState, useMemo } from 'react';

import Tabs from '@ui/Tabs/Tabs';
import { FormValue } from 'components/Account/Personal/MyListing/Form/form';
import classes from './product-info-zone.module.scss';
import ProductDetails from './ProductDetails/ProductDetails';
import ProductShipping from './ProductShipping/ProductShipping';
import ProductReturns from './ProductReturns/ProductReturns';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import ProductAvoidScam from 'components/Marketplace/Detail/ProductInfoZone/ProductAvoidScam/ProductAvoidScam';
import ProductHowToBuy from 'components/Marketplace/Detail/ProductInfoZone/ProductHowToBuy/ProductHowToBuy';

interface Props {
  formData: FormValue;
  isAccessories?: boolean;
}

const ProductInfoZone: FC<Props> = ({ formData, isAccessories }) => {
  const [currentTab, setCurrentTab] = useState('details');
  const isStorefront = useSelector((store: StoreState) => !!store.authenticate.user?.storefront);

  const detailTabs = useMemo(() => {
    const initialTabs = [
      { label: 'Details', value: 'details' },
      // { label: 'Shipping', value: 'shipping' },
      // { label: 'Payment & Returns', value: 'returns' },
    ];
    if (!isStorefront) {
      initialTabs.push({ label: 'How To Buy', value: 'howToBuy' }, { label: 'Avoid Scams', value: 'avoidScams' });
    } else {
      initialTabs.push({ label: 'Shipping', value: 'shipping' });
    }
    return initialTabs;
  }, [isStorefront]);

  const onChangeTab = useCallback((value: string) => {
    setCurrentTab(value);
  }, []);

  const renderContentSection = useCallback(() => {
    switch (currentTab) {
      case detailTabs[0].value:
        return <ProductDetails formData={formData} isAccessories={isAccessories} />;

      case 'shipping':
        return <ProductShipping formData={formData} />;

      case 'howToBuy':
        return <ProductHowToBuy />;

      case 'avoidScams':
        return <ProductAvoidScam />;

      // case detailTabs[2].value:
      //   return <ProductReturns formData={formData} />;

      default:
        return null;
    }
  }, [currentTab, formData]);

  return (
    <div className={'my-5'}>
      <Tabs
        className={classes.tabs}
        tabBarClassName={classes.tabBar}
        tabs={detailTabs}
        value={currentTab}
        onChange={onChangeTab}
      />
      {renderContentSection()}
    </div>
  );
};

export default ProductInfoZone;
