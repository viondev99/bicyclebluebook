import React, { ComponentType, FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ReduxWrapperAppContext } from 'next-redux-wrapper';
import { getDetailOfferBuyer } from 'store/account/personal/offers/offers.action';
import { stopAndAwaitSagaTask } from 'store';
import StoreState from 'model/store';
import AccountPersonalLayout from 'layout/Account/Personal';
import OfferDetailBuyer from 'components/Account/Personal/Offers/Detail/Buyer';
import OfferDetailSeller from 'components/Account/Personal/Offers/Detail/Seller';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { Roles } from 'constants/roles';
import { ComponentStatic } from 'model/common';
import { withInjectAllSaga } from '../../../../../hocs/withAllSagaInjected';

const OfferDetail = () => {
  const dispatch = useDispatch();
  const { detail, loading, user } = useSelector((store: StoreState) => ({
    detail: store.account.personal.offers.detailOfferBuyer,
    loading: store.account.personal.offers.loading,
    user: store.authenticate.user,
  }));
  const { query } = useRouter();

  useEffect(() => {
    dispatch(getDetailOfferBuyer(query?.id));
  }, [query, dispatch]);

  return (
    <AccountPersonalLayout>
      <>
        {!detail && !loading && <h1>Not found offer !</h1>}
        {detail && detail.buyerId === user._id && <OfferDetailBuyer />}
        {detail && detail.sellerUserId === user._id && <OfferDetailSeller />}
      </>
    </AccountPersonalLayout>
  );
};

OfferDetail.getInitialProps = async ({ store, isServer, res }: ReduxWrapperAppContext) => {
  if (isServer) {
    await stopAndAwaitSagaTask(store);
    if (!store.getState().personal?.offers?.detailOfferBuyer) {
      res.statusCode = 404;
    }
  }
  return {};
};
OfferDetail.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.PERSONAL })(OfferDetail as FC<ComponentType & ComponentStatic>),
);
