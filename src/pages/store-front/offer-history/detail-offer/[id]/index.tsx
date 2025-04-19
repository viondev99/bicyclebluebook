import React, { ComponentType, FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import AccountStoreFront from 'layout/Account/StoreFront';
import { ReduxWrapperAppContext } from 'next-redux-wrapper';
import OfferDetailSeller from 'components/Account/Personal/Offers/Detail/Seller';
import { getDetailOfferBuyer } from 'store/account/personal/offers/offers.action';
import { ComponentStatic } from 'model/common';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { withInjectAllSaga } from '../../../../../hocs/withAllSagaInjected';

const OfferDetail = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();

  useEffect(() => {
    dispatch(getDetailOfferBuyer(query?.id));
  }, [query, dispatch]);

  return (
    <AccountStoreFront>
      <OfferDetailSeller />
    </AccountStoreFront>
  );
};

OfferDetail.getInitialProps = () => {
  return {};
};
OfferDetail.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.ONLINE_STORE })(OfferDetail as FC<ComponentType & ComponentStatic>),
);
