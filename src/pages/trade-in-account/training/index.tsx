import React, { FC } from 'react';
import TrainingContainer from 'components/PartnerPortal/Training';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import PartnerPortalLayout from 'layout/Account/Partner';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const Training: FC & ComponentStatic = () => {
  return (
    <PartnerPortalLayout titleMobile={'Training'}>
      <TrainingContainer />
    </PartnerPortalLayout>
  );
};

Training.renderLayout = renderMainLayout;

export default withInjectAllSaga(Training);
