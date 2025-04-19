import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Container from 'reactstrap/lib/Container';
import { ComponentStatic } from 'model/common';
import StoreState from 'model/store';
import { getMessageFromError, pxToRem } from 'helpers/common.helper';
import { toastSuccess, toastError } from 'helpers/utils.helper';
import { cancelOrder, cancelOrderGuest } from 'api/checkout/payment.api';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import Card from '@ui/Cards';
import t from 'helpers/language';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

interface CProps {
  id: string;
}

const CancelOrder: React.FC<CProps> & ComponentStatic = () => {
  const { query, replace } = useRouter();
  const isLogging = useSelector((store: StoreState) => !!store.authenticate.token);

  useEffect(() => {
    if (query && query.id) {
      if (isLogging) {
        cancelOrder(query.id as string)
          .then(() => {
            toastSuccess(t('cart.paymentCancelled'), t('seoTitle.success'));
            replace(`/cart`);
          })
          .catch((error) => {
            toastError(getMessageFromError(error));
            replace(`/cart`);
          });
      } else {
        cancelOrderGuest(query.id as string)
          .then(() => {
            toastSuccess(t('cart.paymentCancelled'), t('seoTitle.success'));
            replace(`/cart`);
          })
          .catch((error) => {
            toastError(getMessageFromError(error));
            replace(`/cart`);
          });
      }
    }
  }, [isLogging, query, replace]);

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

CancelOrder.getInitialProps = async () => {
  return {};
};

CancelOrder.renderLayout = renderMainLayout;

export default withInjectAllSaga(CancelOrder);
