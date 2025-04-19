import React, { FC, useEffect, useCallback } from 'react';
import Container from 'reactstrap/lib/Container';
import images from 'assets/images';
import { pxToRem } from 'helpers/common.helper';
import { ComponentStatic } from 'model/common';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import Card from '@ui/Cards';
import Button from '@ui/Buttons/Primary/Button';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const ReconnectStripeComplete: FC & ComponentStatic = () => {
  useEffect(() => {
    setTimeout(() => {
      window.close();
    }, 500);
  }, []);

  const handleCloseWindow = useCallback(() => {
    window.close();
  }, []);

  return (
    <Container>
      <Card style={{ maxWidth: 450, margin: '120px auto', padding: '40px', display: 'flex', alignItems: 'center' }}>
        <img
          style={{ width: 50, height: 50, minWidth: 120, maxHeight: 120 }}
          src={images.common.icTick}
          alt={'icon-tick'}
        />
        <p style={{ textAlign: 'center', fontSize: pxToRem(25), marginTop: 30, marginBottom: 0, fontWeight: 700 }}>
          Reconnect Stripe Account Completed.
        </p>
        <Button type="button" style={{ marginTop: 20 }} buttonSize={'m'} onClick={handleCloseWindow}>
          Close
        </Button>
      </Card>
    </Container>
  );
};

ReconnectStripeComplete.getInitialProps = async () => {
  return {};
};

ReconnectStripeComplete.renderLayout = renderMainLayout;

export default withInjectAllSaga(ReconnectStripeComplete);
