import React, { FC } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import RecentActivitySection from 'components/StoreFront/Dashboard/RecentActivitySection';
import TaskSection from 'components/StoreFront/Dashboard/TaskSection';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import classes from '../../../components/StoreFront/Dashboard/dashboard.module.scss';
import { renderMainLayout } from '../../../layout/MainLayout/MainLayout';
import { ComponentStatic } from '../../../model/common';
import OverviewSection from '../../../components/StoreFront/Dashboard/OverviewSection';
import ChartSection from '../../../components/StoreFront/Dashboard/ChartSection';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const StoreFrontDashboard: FC & ComponentStatic = () => {
  return (
    <div className="wrapper-with-header overflow-hidden">
      <Container style={{ marginBottom: 85 }}>
        <h1 className={classes.title}>Dashboard</h1>
        <OverviewSection />
        <Row>
          <Col lg={8}>
            <ChartSection />
            <div className={'d-none d-lg-block'}>
              <TaskSection />
            </div>
          </Col>
          <Col lg={4}>
            <RecentActivitySection />
          </Col>
        </Row>
        <div className={'d-block d-lg-none'}>
          <TaskSection />
        </div>
      </Container>
    </div>
  );
};

StoreFrontDashboard.renderLayout = renderMainLayout;

export default withInjectAllSaga(withAuthenticate({ role: Roles.ONLINE_STORE })(StoreFrontDashboard));
