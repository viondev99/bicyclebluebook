import React, { FC, ComponentType, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import EditDraftContainer from 'components/Account/Personal/MyListing/Edit/EditDraftContainer';
import EditDraftPartAccessoriesContainer from 'components/Account/Personal/MyListing/Edit/EditDraftPartAccessoriesContainer';
import { getDetailListingDraft } from 'store/account/personal/listings/listings.action';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { ComponentStatic } from 'model/common';
import StoreState from 'model/store';
import { withInjectAllSaga } from '../../../../../../hocs/withAllSagaInjected';

function EditListing() {
  const dispatch = useDispatch();
  const detailListing = useSelector((store: StoreState) => store.account.personal?.listings?.detailListingDraft);
  const { query } = useRouter();

  useEffect(() => {
    dispatch(getDetailListingDraft(query?.id));
  }, [query, dispatch]);

  return (
    <>
      {detailListing?.listingType === 'PART_ACCESSORIES' ? (
        <EditDraftPartAccessoriesContainer />
      ) : (
        <EditDraftContainer />
      )}
    </>
  );
}

EditListing.getInitialProps = () => {
  return {};
};
EditListing.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.PERSONAL })(EditListing as FC<ComponentType & ComponentStatic>),
);
