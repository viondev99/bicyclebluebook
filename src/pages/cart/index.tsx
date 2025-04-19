import React, { useEffect } from 'react';
import Container from 'reactstrap/lib/Container';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';

import { withAuthenticate } from 'hocs/withAuthenticate';
import StoreState from 'model/store';
import { Roles } from 'constants/roles';
import CartList from 'components/Cart/CartList/CartList';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import cartAction from 'store/checkout/cart/cart.action';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const Cart = () => {
  const dispatch = useDispatch();
  const user = useSelector((store: StoreState) => store.authenticate.user);

  useEffect(() => {
    dispatch(cartAction.getCarts());
  }, [dispatch, user]);
  return (
    <>
      <Head>
        <title>My Cart - Used Bikes for Sale - BicycleBlueBook</title>
        <meta name="description" content={`Bicycle Blue Book Cart List`} />
      </Head>
      <div className="wrapper-with-header">
        <Container style={{ maxWidth: 700 }}>
          <div style={{ padding: '20px 0' }}>
            <CartList />
          </div>
        </Container>
      </div>
    </>
  );
};

Cart.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({
    requireAuth: false,
    role: Roles.PERSONAL,
  })(Cart),
);
