import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import StoreState from 'model/store';
import StorefrontLayout from 'layout/Account/StoreFront';
import marketplaceActions from 'store/marketplace/marketplace.action';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ComponentStatic } from 'model/common';
import AccountPersonalLayout from 'layout/Account/Personal';
import ProductionInfoSection from 'components/PrintLabel/ProductInfoSection/ProductionInfoSection';
import ShippingFormSection from 'components/PrintLabel/ShippingFormSection/ShippingFormSection';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';

interface CProps {
  id: string;
}

const PrintLabel: React.FC<CProps> & ComponentStatic = () => {
  const dispatch = useDispatch();
  const isOnlineStore = useSelector((store: StoreState) => !!store.authenticate.user?.storefront);
  const { query } = useRouter();

  useEffect(() => {
    dispatch(marketplaceActions.getDetailProduct(String(query.id)));
  }, [query, dispatch]);

  const renderContent = useCallback(() => {
    return (
      <>
        <div style={{ marginBottom: 20 }}>
          <ProductionInfoSection />
        </div>
        <ShippingFormSection />
      </>
    );
  }, []);

  return isOnlineStore ? (
    <StorefrontLayout titleMobile={'Listings'}>{renderContent()}</StorefrontLayout>
  ) : (
    <AccountPersonalLayout titleMobile={'Listings'}>{renderContent()}</AccountPersonalLayout>
  );
};

PrintLabel.getInitialProps = () => {
  return {};
};

PrintLabel.renderLayout = renderMainLayout;

export default withInjectAllSaga(PrintLabel);
