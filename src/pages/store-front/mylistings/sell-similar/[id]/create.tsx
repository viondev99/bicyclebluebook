import React, { ComponentType, FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import SellSimilarContainer from 'components/Account/Personal/MyListing/SellSimilar/SellSimilarContainer';
import SellSimilarPartAndAccessoriesContainer from 'components/Account/Personal/MyListing/SellSimilar/SellSimilarPartAndAccessoriesContainer';
import { getDetailListingListed } from 'store/account/personal/listings/listings.action';
import { ComponentStatic } from 'model/common';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import StoreState from 'model/store';
import { withInjectAllSaga } from '../../../../../hocs/withAllSagaInjected';

const SellSimilar = () => {
  const dispatch = useDispatch();
  const { replace, query } = useRouter();
  const detailListingListed = useSelector((store: StoreState) => store.account.personal?.listings?.detailListingListed);
  const isBBBStaff = useUserIsBBB();

  useEffect(() => {
    if (isBBBStaff) {
      replace('/');
    }
  }, [isBBBStaff, replace]);

  useEffect(() => {
    dispatch(getDetailListingListed(query?.id));
  }, [query, dispatch]);

  return (
    <>
      {detailListingListed?.listingType === 'PART_ACCESSORIES' ? (
        <SellSimilarPartAndAccessoriesContainer />
      ) : (
        <SellSimilarContainer />
      )}
    </>
  );
};

SellSimilar.getInitialProps = () => {
  return {};
};
SellSimilar.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.ONLINE_STORE })(SellSimilar as FC<ComponentType & ComponentStatic>),
);
