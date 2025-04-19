import React, { FC, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import StoreState from 'model/store';
import Input from '@ui/Inputs/Input';
import Button from '@ui/Buttons/Primary/Button';
import classes from './stripe-account-section.module.scss';

interface Props {
  account: string | number;
  onConnect: () => void;
}

const StripeAccountSection: FC<Props> = ({ account, onConnect }) => {
  const { pathname } = useRouter();
  const detailListing = useSelector((store: StoreState) => store.account.personal?.listings?.detailListingListed);

  const isCreate = useMemo(() => {
    return pathname?.includes('create') || pathname?.includes('sell-similar');
  }, [pathname]);

  const onConnectStripe = useCallback(() => {
    onConnect();
  }, [onConnect]);

  return (
    <section className={classes.stripeAccountSection}>
      <h4 className={classes.title}>Card/Account to Receive Payment</h4>
      <Input className={classes.input} disabled={true} value={account} />
      {!account && (
        <Button
          className={classes.button}
          type="button"
          buttonType={'transparent'}
          buttonSize={'m'}
          onClick={onConnectStripe}>
          Add Card/Account
        </Button>
      )}
      {!isCreate && !!detailListing?.paypalEmailSeller && !!account && (
        <p className={classes.note}>This listing was moved from Paypal to Stripe</p>
      )}
    </section>
  );
};

export default StripeAccountSection;
