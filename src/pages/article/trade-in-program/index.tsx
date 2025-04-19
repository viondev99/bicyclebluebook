import React from 'react';
import TradeInProgram from 'components/Article/TradeInProgram';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';

function TradeIn() {
  return <TradeInProgram />;
}
export default TradeIn;
TradeIn.renderLayout = renderMainLayout;
