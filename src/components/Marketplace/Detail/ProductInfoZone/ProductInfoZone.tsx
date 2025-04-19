import React, { FC, useState, useMemo, useEffect, useCallback } from 'react';
import Tabs from '@ui/Tabs/Tabs';
import { useSelector } from 'react-redux';
import StoreState from 'model/store/index';
import CONFIG from 'config';
import classes from './product-info-zone.module.scss';
import ProductDetails from './ProductDetails/ProductDetails';
import ProductShipping from './ProductShipping/ProductShipping';
import ProductReturns from './ProductReturns/ProductReturns';
import RecentView from './RecentlyViewed/RecentlyViewed';
import BBBDirect from './BBBDirect/BbbDirect';
import ProductHowToBuy from './ProductHowToBuy/ProductHowToBuy';
import ProductAvoidScam from './ProductAvoidScam/ProductAvoidScam';

const DETAILS_TAB = { label: 'Details', value: 'DETAILS' };
const SHIPPING_TAB = { label: 'Shipping', value: 'SHIPPING' };
const HOW_TO_BUY_TAB = { label: 'How To Buy', value: 'HOW_TO_BUY' };
const AVOID_SCAMS_TAB = { label: 'Avoid Scams', value: 'AVOID_SCAMS' };
const BBB_DIRECT_TAB = { label: 'BBB Direct', value: 'BBB_DIRECT' };
const RETURN_POLICY_TAB = { label: 'Payment & Returns', value: 'RETURN_POLICY' };

const ProductInfoZone: FC = () => {
  const detail = useSelector((state: StoreState) => state.marketplace.detail);
  const checkShowHowToBuyAndAvoidScam = !detail.sellerIsBBB && !detail.storefrontId;
  const checkShowShippingCost = detail?.sellerIsBBB || (detail?.storefrontId && detail?.storefrontId !== 'no_provider');
  const checkShowReturnPolicy = detail?.sellerIsBBB;
  const checkShowBBBDirect = detail?.storefrontId === CONFIG.BBB_STAFF[0];

  const detailTabs = useMemo(() => {
    const initialTabs = [DETAILS_TAB];

    if (checkShowHowToBuyAndAvoidScam) {
      initialTabs.push(HOW_TO_BUY_TAB, AVOID_SCAMS_TAB);
    }
    if (checkShowShippingCost) {
      initialTabs.push(SHIPPING_TAB);
    }
    if (checkShowBBBDirect) {
      initialTabs.push(BBB_DIRECT_TAB);
    }
    if (checkShowReturnPolicy) {
      initialTabs.push(RETURN_POLICY_TAB);
    }
    return initialTabs;
  }, [detail]);
  const [currentTab, setCurrentTab] = useState('details');

  useEffect(() => {
    setCurrentTab(detailTabs[0].value);
  }, [detail, detailTabs]);

  const onChangeTab = useCallback((value: string) => {
    setCurrentTab(value);
  }, []);

  const renderContentSection = useCallback(() => {
    switch (currentTab) {
      case DETAILS_TAB.value:
        return <ProductDetails />;

      case SHIPPING_TAB.value:
        return <ProductShipping />;

      case HOW_TO_BUY_TAB.value:
        return <ProductHowToBuy />;

      case AVOID_SCAMS_TAB.value:
        return <ProductAvoidScam />;

      case BBB_DIRECT_TAB.value:
        return <BBBDirect />;

      case RETURN_POLICY_TAB.value:
        return <ProductReturns storefrontId={detail?.storefrontId} />;

      default:
        return null;
    }
  }, [currentTab, detailTabs]);

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
      <RecentView />
    </div>
  );
};

export default ProductInfoZone;
