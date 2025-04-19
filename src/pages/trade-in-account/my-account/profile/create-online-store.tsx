import React, { FC } from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { ComponentStatic } from 'model/common';
import OnlineStore from 'components/OnlineStore/OnlineStore';
import { withInjectAllSaga } from '../../../../hocs/withAllSagaInjected';

const CreateOnlineStore: FC & ComponentStatic = () => {
  return <OnlineStore />;
};

CreateOnlineStore.renderLayout = renderMainLayout;

export default withInjectAllSaga(CreateOnlineStore);
