import React, { ComponentType, FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import AccountPersonalLayout from 'layout/Account/Personal';
import OfferDetailBikeBuyer from 'components/Account/Personal/Offers/Detail/Bike';
import { getDetailOfferBike } from 'store/account/personal/offers/offers.action';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { ComponentStatic } from 'model/common';
import { withInjectAllSaga } from '../../../../../hocs/withAllSagaInjected';

const OfferDetailBike = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();

  useEffect(() => {
    dispatch(getDetailOfferBike(query?.id));
  }, [query, dispatch]);

  return (
    <AccountPersonalLayout>
      <OfferDetailBikeBuyer />
    </AccountPersonalLayout>
  );
};

OfferDetailBike.getInitialProps = () => {
  return {};
};
OfferDetailBike.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.PERSONAL })(OfferDetailBike as FC<ComponentType & ComponentStatic>),
);
