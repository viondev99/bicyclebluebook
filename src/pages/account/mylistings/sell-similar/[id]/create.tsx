import React, { FC, ComponentType, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import SellSimilarContainer from 'components/Account/Personal/MyListing/SellSimilar/SellSimilarContainer';
import SellSimilarPartAndAccessoriesContainer from 'components/Account/Personal/MyListing/SellSimilar/SellSimilarPartAndAccessoriesContainer';
import { getDetailListingListed } from 'store/account/personal/listings/listings.action';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { ComponentStatic } from 'model/common';
import StoreState from 'model/store';
import { withInjectAllSaga } from '../../../../../hocs/withAllSagaInjected';

const SellSimilar = () => {
  const dispatch = useDispatch();
  const detailListingListed = useSelector((store: StoreState) => store.account.personal?.listings?.detailListingListed);
  const { query } = useRouter();

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
  withAuthenticate({ role: Roles.PERSONAL })(SellSimilar as FC<ComponentType & ComponentStatic>),
);
