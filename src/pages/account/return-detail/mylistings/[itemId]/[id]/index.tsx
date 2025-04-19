import React, { ComponentType, FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { getDetailOrder, getReturnDetail } from 'store/account/personal/orders/orders.action';
import ReturnDetailContainer from 'components/Account/Personal/Orders/ReturnDetail/ReturnDetailContainer';
import AccountPersonalLayout from 'layout/Account/Personal';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { Roles } from 'constants/roles';
import { ComponentStatic } from 'model/common';
import { withInjectAllSaga } from '../../../../../../hocs/withAllSagaInjected';

const ReturnDetailPage = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();

  useEffect(() => {
    dispatch(getDetailOrder(query?.id));
    dispatch(
      getReturnDetail({
        inventory_id: query?.inventory,
        market_listing_id: query?.marketListing,
        master_listing_id: query?.itemId,
        order_id: query?.id,
      }),
    );
  }, [query, dispatch]);

  return (
    <AccountPersonalLayout titleMobile="Listings">
      <ReturnDetailContainer />
    </AccountPersonalLayout>
  );
};

ReturnDetailPage.getInitialProps = () => {
  return {};
};
ReturnDetailPage.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.PERSONAL })(ReturnDetailPage as FC<ComponentType & ComponentStatic>),
);
