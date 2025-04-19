import React, { ComponentType, FC, useEffect } from 'react';
import { useRouter } from 'next/router';

import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import CreateMyListingContainer from 'components/Account/Personal/MyListing/Create/CreateMyListingContainer';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const CreateMyListing: ComponentStatic = () => {
  const { replace } = useRouter();
  const isBBBStaff = useUserIsBBB();

  useEffect(() => {
    if (isBBBStaff) {
      replace('/');
    }
  }, [isBBBStaff, replace]);

  return <CreateMyListingContainer />;
};

CreateMyListing.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.ONLINE_STORE })(CreateMyListing as FC<ComponentType & ComponentStatic>),
);
