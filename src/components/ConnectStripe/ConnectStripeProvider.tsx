import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { StripeProvider } from 'react-stripe-elements';
import CONFIG from 'config';
import { loadScriptAsync } from 'helpers/utilities.helper';
import { URL_STRIPE } from 'helpers/constraint.helper';

const ConnectStripeProvider: FC = ({ children }) => {
  const [stripeLoaded, setStripeLoaded] = useState(false);

  const handlLoadScript = useCallback(async () => {
    await loadScriptAsync(URL_STRIPE);
    if (window.Stripe) {
      setStripeLoaded(true);
    }
  }, []);

  useEffect(() => {
    handlLoadScript();
  }, [handlLoadScript]);

  const renderStrikeProvider = useMemo(() => {
    if (!stripeLoaded) {
      return (
        <StripeProvider stripe={null} key={null}>
          {children}
        </StripeProvider>
      );
    }
    return (
      <StripeProvider
        key={(window as any)?.Stripe(CONFIG.STRIPE_API_KEY_P2P)}
        stripe={(window as any)?.Stripe(CONFIG.STRIPE_API_KEY_P2P)}>
        {children}
      </StripeProvider>
    );
  }, [children, stripeLoaded]);

  return <>{renderStrikeProvider}</>;
};

export default ConnectStripeProvider;
