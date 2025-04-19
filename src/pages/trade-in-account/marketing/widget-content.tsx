import React, { FC } from 'react';
import MarketingContainer from 'components/PartnerPortal/Marketing';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import PartnerPortalLayout from 'layout/Account/Partner';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const WidgetContent: FC & ComponentStatic = () => {
  return (
    <PartnerPortalLayout titleMobile={'Marketing'}>
      <MarketingContainer />
    </PartnerPortalLayout>
  );
};

WidgetContent.renderLayout = renderMainLayout;

export default withInjectAllSaga(WidgetContent);
