import React, { useCallback, useMemo } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { useSelector } from 'react-redux';

import marketplaceActions from 'store/marketplace/marketplace.action';
import StoreState from 'model/store';
import StorefrontLayout from 'layout/Account/StoreFront';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ComponentStatic } from 'model/common';
import AccountPersonalLayout from 'layout/Account/Personal';
import PaymentFormSection from 'components/PrintLabel/PaymentFormSection/PaymentFormSection';
import { stopAndAwaitSagaTask } from 'store';
import { NextPageContext } from 'next';
import cookies from 'next-cookies';
import { V3_TOKEN_KEY } from 'constants/common';
import { loadStripe } from '@stripe/stripe-js';
import CONFIG from 'config';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';

interface CProps {
  id: string;
}

const stripeFonts = [
  {
    cssSrc: 'https://fonts.googleapis.com/css2?family=DM+Sans&display=swap',
  },
];

const Payment: React.FC<CProps> & ComponentStatic = () => {
  const isOnlineStore = useSelector((store: StoreState) => !!store.authenticate.user?.storefront);
  const carts = useSelector((store: StoreState) => store.checkout.cart.carts);
  const isAllItemBBB = useMemo(() => {
    return carts.length > 0 && carts.every((i) => i?.seller_is_bbb);
  }, [carts]);
  const stripePromise = useMemo(() => {
    return loadStripe(isAllItemBBB ? CONFIG.STRIPE_API_KEY_B2C : CONFIG.STRIPE_API_KEY_P2P);
  }, [isAllItemBBB]);

  const renderContent = useCallback(() => {
    return (
      <Elements stripe={stripePromise}>
        <PaymentFormSection />
      </Elements>
    );
  }, [stripePromise]);

  return isOnlineStore ? (
    <StorefrontLayout titleMobile={'Listings'}>{renderContent()}</StorefrontLayout>
  ) : (
    <AccountPersonalLayout titleMobile={'Listings'}>{renderContent()}</AccountPersonalLayout>
  );
};

Payment.getInitialProps = async (ctx: NextPageContext) => {
  const { query, store, res, isServer } = ctx;
  const tokenFromReq = cookies(ctx)[V3_TOKEN_KEY];
  if (res && !query.submitted) {
    res.writeHead(301, { Location: `/marketplace/buy-now/${String(query.id)}/print-label` });
    res.end();
  } else {
    store.dispatch(
      marketplaceActions.getDetailProduct(String(query.id), {
        silentLoad: false,
        isServer,
        tokenFromReq,
      }),
    );
    store.dispatch(marketplaceActions.getDetailProduct(String(query.id)));
    if (isServer) {
      await stopAndAwaitSagaTask(store);
      if (store.getState().marketplace.detail.error) {
        res.statusCode = 404;
      }
    }
  }
  return {};
};

Payment.renderLayout = renderMainLayout;

export default withInjectAllSaga(Payment);
