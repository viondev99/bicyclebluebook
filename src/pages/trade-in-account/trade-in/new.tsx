import React, { FC, useEffect } from 'react';
import StandardQuoteContainer from 'components/PartnerPortal/TradeInScoreCard/StandardQuote';
import { ComponentStatic } from 'model/common';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import { useRouter } from 'next/router';
import { parseJwt } from 'helpers/utilities.helper';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const StandardQuote: FC & ComponentStatic = () => {
  const isLoggedIn = useSelector((state: StoreState) => !!state.authenticate.token);
  const token = parseJwt(useSelector((state: StoreState) => state.authenticate.token));

  const { replace } = useRouter();

  useEffect(() => {
    if (isLoggedIn && token?.partner === undefined) {
      replace('/');
    }
    if (!isLoggedIn) {
      replace('/login');
    }
  }, [isLoggedIn, replace, token]);

  return <StandardQuoteContainer />;
};

StandardQuote.renderLayout = null;

export default withInjectAllSaga(StandardQuote);
