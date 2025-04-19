import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Container from 'reactstrap/lib/Container';
import { ComponentStatic } from 'model/common';
import { getMessageFromError, pxToRem } from 'helpers/common.helper';
import { toastSuccess, toastError } from 'helpers/utils.helper';
import { cancelPayWithPaypal } from 'api/shipment.api';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import Card from '@ui/Cards';
import t from 'helpers/language';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

interface CProps {
  id: string;
}

const Cancel: React.FC<CProps> & ComponentStatic = () => {
  const { query, replace } = useRouter();

  useEffect(() => {
    if (query) {
      const payload = {
        order_id: String(query?.order_id) || '',
        master_listing_id: String(query?.master_listing_id) || '',
        payment_id: String(query?.paymentId) || '',
        payer_id: String(query?.PayerID) || '',
      };
      cancelPayWithPaypal(payload)
        .then(() => {
          toastSuccess(t('cart.paymentCancelled'), t('seoTitle.success'));
          replace(`/marketplace/buy-now/${payload.master_listing_id}/print-label`);
        })
        .catch((error) => {
          toastError(getMessageFromError(error));
          replace(`/marketplace/buy-now/${payload.master_listing_id}/print-label`);
        });
    }
  }, [query, replace]);

  return (
    <Container>
      <Card style={{ maxWidth: 450, margin: '120px auto', padding: '40px' }}>
        <p style={{ textAlign: 'center', fontSize: pxToRem(37), marginTop: 30, marginBottom: 0, fontWeight: 700 }}>
          we are cancelling...
        </p>
      </Card>
    </Container>
  );
};

Cancel.getInitialProps = () => {
  return {};
};

Cancel.renderLayout = renderMainLayout;

export default withInjectAllSaga(Cancel);
