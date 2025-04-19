import React, { FC } from 'react';
import Modal from 'reactstrap/lib/Modal';
import { useSelector } from 'react-redux';
import StoreState from '../../model/store';
import { ComponentStatic } from '../../model/common';
import { renderMainLayout } from '../../layout/MainLayout/MainLayout';
import ShippingContent from '../../components/Checkout/Shipping/ShippingContent';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const Shipping: FC & ComponentStatic = () => {
  const statusCreateAccount = useSelector((state: StoreState) => state.checkout.cart.statusCreateAccount);

  return (
    <div className="wrapper-with-header extra-light-container">
      <Modal onClose={() => {}} isOpen={!!statusCreateAccount} header={null} centered={true} style={{ maxWidth: 600 }}>
        <div style={{ padding: 50 }}>
          <p className="text-center m-0">{statusCreateAccount}</p>
        </div>
      </Modal>
      <ShippingContent />
    </div>
  );
};

Shipping.renderLayout = renderMainLayout;

export default withInjectAllSaga(Shipping);
