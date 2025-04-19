import React, { FC, useEffect } from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { getDetailOrder } from 'store/account/personal/orders/orders.action';
import OrderDetailContainer from 'components/Account/Personal/Orders/Detail/OrderDetailContainer';
import Container from 'reactstrap/lib/Container';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';
import { ComponentStatic } from '../../../model/common';

const OrderDetail: FC & ComponentStatic = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDetailOrder(router.query.id));
  }, [dispatch, router.query.id]);
  return (
    <div className="wrapper-with-header extra-light-container">
      <Container className={'mb-4'}>
        <OrderDetailContainer />
      </Container>
    </div>
  );
};

OrderDetail.getInitialProps = () => {
  return {};
};
OrderDetail.renderLayout = renderMainLayout;

export default withInjectAllSaga(OrderDetail);
