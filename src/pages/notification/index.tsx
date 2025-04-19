import React, { FC } from 'react';
import Head from 'next/head';
import Container from 'reactstrap/lib/Container';
import classes from 'components/Notification/notification.module.scss';
import ListNotification from 'components/Notification/ListNotification/ListNotification';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { ComponentStatic } from '../../model/common';
import { renderMainLayout } from '../../layout/MainLayout/MainLayout';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const Notification: FC & ComponentStatic = () => {
  return (
    <>
      <Head>
        <title>Notifications</title>
        <meta name="description" content={`Bicycle Blue Book Notifications`} />
      </Head>
      <div className="wrapper-with-header overflow-hidden">
        <Container style={{ marginBottom: 85 }}>
          <h1 className={classes.title}>All Notifications</h1>
          <ListNotification />
        </Container>
      </div>
    </>
  );
};

Notification.renderLayout = renderMainLayout;

export default withInjectAllSaga(withAuthenticate()(Notification));
