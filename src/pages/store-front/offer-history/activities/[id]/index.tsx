import React, { ComponentType, FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import AccountPersonalLayout from 'layout/Account/StoreFront';
import OfferActivitiesContain from 'components/Account/Personal/Offers/Activities/ActivitiesContainer';
import { getOfferActivities } from 'store/account/personal/offers/offers.action';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { Roles } from 'constants/roles';
import { ComponentStatic } from 'model/common';
import { withInjectAllSaga } from '../../../../../hocs/withAllSagaInjected';

const OfferActivities = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();

  useEffect(() => {
    dispatch(getOfferActivities(query?.id));
  }, [query, dispatch]);

  return (
    <AccountPersonalLayout>
      <OfferActivitiesContain />
    </AccountPersonalLayout>
  );
};

OfferActivities.getInitialProps = () => {
  return {};
};
OfferActivities.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.ONLINE_STORE })(OfferActivities as FC<ComponentType & ComponentStatic>),
);
