import React, { ComponentType, FC } from 'react';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import CreateMyListingContainer from 'components/Account/Personal/MyListing/Create/CreateMyListingContainer';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { Roles } from 'constants/roles';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const CreateMyListing: ComponentStatic = () => {
  return <CreateMyListingContainer />;
};

CreateMyListing.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.PERSONAL })(CreateMyListing as FC<ComponentType & ComponentStatic>),
);
