import React, { ComponentType, FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import AccountStoreFrontLayout from 'layout/Account/StoreFront';
import OfferDetailBikeBuyer from 'components/Account/Personal/Offers/Detail/Bike';
import { getDetailOfferBike } from 'store/account/personal/offers/offers.action';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { Roles } from 'constants/roles';
import { ComponentStatic } from 'model/common';
import { withInjectAllSaga } from '../../../../../hocs/withAllSagaInjected';

const OfferDetailBike = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();

  useEffect(() => {
    dispatch(getDetailOfferBike(query?.id));
  }, [query, dispatch]);

  return (
    <AccountStoreFrontLayout>
      <OfferDetailBikeBuyer />
    </AccountStoreFrontLayout>
  );
};

OfferDetailBike.getInitialProps = () => {
  return {};
};
OfferDetailBike.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.ONLINE_STORE })(OfferDetailBike as FC<ComponentType & ComponentStatic>),
);
