import React, { useState } from 'react';
import Container from 'reactstrap/lib/Container';
import { useRouter } from 'next/router';
import cx from 'classnames';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Card from '@ui/Cards';
import FormCreateOnlineStore from './Form';
import classes from './onlineStore.module.scss';
import BackButton from '../Register/BackButton';

const OnlineStore = () => {
  const router = useRouter();
  return (
    <Container className={cx(classes.onlineStore)}>
      <BackButton
        onClick={() => {
          router.push('/trade-in-account/my-account/profile');
        }}
      />

      <h2 style={{ marginBottom: 30 }}>Create Online Store</h2>
      <Row className={classes.online_store__wrapper}>
        <Col className={cx(classes.online_store__wrapper_content)}>
          <Card className={cx(classes.left_card)}>
            <FormCreateOnlineStore />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OnlineStore;
