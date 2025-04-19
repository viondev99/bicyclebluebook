import React, { FC } from 'react';
import Container from 'reactstrap/lib/Container';
import RecentActivitySection from 'components/StoreFront/Dashboard/RecentActivitySection';
import TaskSection from 'components/StoreFront/Dashboard/TaskSection';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import StorefrontLayout from 'layout/Account/StoreFront';
import { renderMainLayout } from '../../../layout/MainLayout/MainLayout';
import { ComponentStatic } from '../../../model/common';
import OverviewSection from '../../../components/StoreFront/Dashboard/OverviewSection';
import ChartSection from '../../../components/StoreFront/Dashboard/ChartSection';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const StoreFrontDashboard: FC & ComponentStatic = () => {
  return (
    <StorefrontLayout titleMobile="Dashboard">
      <Container style={{ marginBottom: 85 }}>
        <OverviewSection isMenu />
        <ChartSection isMenu />
        <TaskSection />
        <RecentActivitySection isMenu />
      </Container>
    </StorefrontLayout>
  );
};

StoreFrontDashboard.renderLayout = renderMainLayout;

export default withInjectAllSaga(withAuthenticate({ role: Roles.ONLINE_STORE })(StoreFrontDashboard));
