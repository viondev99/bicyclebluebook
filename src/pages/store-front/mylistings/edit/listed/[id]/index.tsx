import React, { ComponentType, FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import EditListingContainer from 'components/Account/Personal/MyListing/Edit/EditListingContainer';
import EditListingPartAccessoriesContainer from 'components/Account/Personal/MyListing/Edit/EditListingPartAccessoriesContainer';
import { getDetailListingListed } from 'store/account/personal/listings/listings.action';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { ComponentStatic } from 'model/common';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import StoreState from 'model/store';
import { withInjectAllSaga } from '../../../../../../hocs/withAllSagaInjected';

const EditListing = () => {
  const dispatch = useDispatch();
  const detailListingListed = useSelector((store: StoreState) => store.account.personal?.listings?.detailListingListed);
  const { replace, query } = useRouter();
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
        <EditListingPartAccessoriesContainer />
      ) : (
        <EditListingContainer />
      )}
    </>
  );
};

EditListing.getInitialProps = () => {
  return {};
};

EditListing.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.ONLINE_STORE })(EditListing as FC<ComponentType & ComponentStatic>),
);
