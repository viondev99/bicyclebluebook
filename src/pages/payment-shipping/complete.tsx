import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Container from 'reactstrap/lib/Container';
import images from 'assets/images';
import { ComponentStatic } from 'model/common';
import { getMessageFromError, printLabel, pxToRem } from 'helpers/common.helper';
import { toastError } from 'helpers/utils.helper';
import { completePayWithPaypal } from 'api/shipment.api';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import Card from '@ui/Cards';
import Button from '@ui/Buttons/Primary/Button';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const Complete: React.FC & ComponentStatic = () => {
  const { query, replace } = useRouter();
  const [linkPrint, setLinkPrint] = useState<string | Array<string>>('');

  useEffect(() => {
    if (query) {
      const payload = {
        order_id: String(query?.order_id) || '',
        master_listing_id: String(query?.master_listing_id) || '',
        payment_id: String(query?.paymentId) || '',
        payer_id: String(query?.PayerID) || '',
      };
      completePayWithPaypal(payload)
        .then((response) => {
          setLinkPrint(Array.isArray(response) ? response.map((item) => item.fullLinkLabel) : response.fullLinkLabel);
        })
        .catch((error) => {
          toastError(getMessageFromError(error));
          replace(`/marketplace/buy-now/${payload.master_listing_id}`);
        });
    }
  }, [query, replace]);

  const handlePrintLabel = useCallback(() => {
    if (linkPrint.length > 0) {
      const newWindow: any = window.open('', '_blank', 'width=1000,height=600');
      printLabel(newWindow, linkPrint);
    }
  }, [linkPrint]);

  return (
    <Container>
      <Card style={{ maxWidth: 450, margin: '120px auto', padding: '40px', display: 'flex', alignItems: 'center' }}>
        <img
          style={{ width: 50, height: 50, minWidth: 120, maxHeight: 120 }}
          src={images.common.icTick}
          alt={'icon-tick'}
        />
        <p style={{ textAlign: 'center', fontSize: pxToRem(37), marginTop: 30, marginBottom: 0, fontWeight: 700 }}>
          Pay completed.
        </p>
        <Button type="button" style={{ marginTop: 20 }} buttonSize={'l'} onClick={handlePrintLabel}>
          Print
        </Button>
      </Card>
    </Container>
  );
};

Complete.getInitialProps = () => {
  return {};
};

Complete.renderLayout = renderMainLayout;

export default withInjectAllSaga(Complete);
