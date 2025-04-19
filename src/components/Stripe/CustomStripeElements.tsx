import React, { FC, useCallback, useState } from 'react';
import { CardCvcElement, CardExpiryElement, CardNumberElement } from '@stripe/react-stripe-js';
import classes from './custom-stripe.module.scss';

const inputStyle = {
  base: {
    fontSize: '18px',
    height: 55,
    color: '#6E7785',
    fontFamily: 'DM Sans',
    '::placeholder': {
      color: 'rgba(111, 120, 133, 0.4)',
      fontWeight: '500',
    },
  },
};

export const StripeCardNumber: FC = () => {
  const [error, setError] = useState('');
  const handleChange = useCallback((e: any) => {
    if (e.error) {
      setError(e.error.message);
    } else {
      setError('');
    }
  }, []);
  return (
    <div className={classes.wrapper}>
      <CardNumberElement
        options={{
          style: inputStyle,
        }}
        onChange={handleChange}
      />
      {error ? <p className={'error-message'}>{error}</p> : null}
    </div>
  );
};

export const StripeCardExpiry: FC = () => {
  const [error, setError] = useState('');
  const handleChange = useCallback((e: any) => {
    if (e.error) {
      setError(e.error.message);
    } else {
      setError('');
    }
  }, []);
  return (
    <div className={classes.wrapperExpiry}>
      <CardExpiryElement
        options={{
          style: inputStyle,
        }}
        onChange={handleChange}
      />
      {error ? <p className={'error-message'}>{error}</p> : null}
    </div>
  );
};

export const StripeCardCVV: FC = () => {
  const [error, setError] = useState('');
  const handleChange = useCallback((e: any) => {
    if (e.error) {
      setError(e.error.message);
    } else {
      setError('');
    }
  }, []);
  return (
    <div className={classes.wrapperCVV}>
      <CardCvcElement
        options={{
          style: inputStyle,
        }}
        onChange={handleChange}
      />
      {error ? <p className={'error-message'}>{error}</p> : null}
    </div>
  );
};
