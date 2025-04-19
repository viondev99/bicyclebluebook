import React, { FC } from 'react';
import FeedbackContainer from 'components/PartnerPortal/Feedback';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import PartnerPortalLayout from 'layout/Account/Partner';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const Feedback: FC & ComponentStatic = () => {
  return (
    <PartnerPortalLayout titleMobile={'Feedback'}>
      <FeedbackContainer />
    </PartnerPortalLayout>
  );
};

Feedback.renderLayout = renderMainLayout;

export default withInjectAllSaga(Feedback);
