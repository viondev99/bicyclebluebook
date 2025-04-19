import React, { FC } from 'react';
import LocationContainer from 'components/PartnerPortal/Account/Location';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import PartnerPortalLayout from 'layout/Account/Partner';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const Location: FC & ComponentStatic = () => {
  return (
    <PartnerPortalLayout titleMobile={'Locations'}>
      <LocationContainer />
    </PartnerPortalLayout>
  );
};

Location.renderLayout = renderMainLayout;

export default withInjectAllSaga(Location);
