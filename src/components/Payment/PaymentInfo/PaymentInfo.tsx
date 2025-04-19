/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { FC, Suspense, useCallback, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import images from 'assets/images';

import { useConnectStripe } from 'hooks/useConnectStripe';
import Card from '@ui/Cards';
import Button from '@ui/Buttons/Primary/Button';
import cx from 'classnames';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import { StorefrontRole } from 'constants/roles';
import classes from './payment-info.module.scss';

const ModalConfirmDisconnectStripe = React.lazy(() => import('@ui/Modal/ModalConfirmDisconnectStripe'));

interface Props {
  hideTitle?: boolean;
  customContainer?: string;
  customCardContainer?: string;
}

const PaymentInfo: FC<Props> = ({ hideTitle, customContainer, customCardContainer }) => {
  const { loading, account, onConnect, onDelete } = useConnectStripe();

  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const [visibleModalConfirmDisconnectStripe, setVisibleModalConfirmDisconnectStripe] = useState(false);

  const visibleRenderButtonDisconnectStripe = useMemo(() => {
    if (userInfo?.role !== StorefrontRole.Employee) {
      return true;
    }
    return false;
  }, [userInfo]);

  const onConnectStripe = useCallback(() => {
    onConnect();
  }, [onConnect]);

  return (
    <Card className={customCardContainer}>
      <div className={cx(classes.paymentInfoContainer, customContainer)}>
        {!hideTitle && <h1>Card/Account to Receive Payment</h1>}
        {loading && (
          <>
            <div className={classes.info}>
              <Skeleton width={200} height={26} />
            </div>
            <div className={classes.type}>
              <Skeleton width={150} height={23} />
            </div>
          </>
        )}
        {!!account && !loading && (
          <>
            {visibleRenderButtonDisconnectStripe && (
              <img
                onClick={() => setVisibleModalConfirmDisconnectStripe(true)}
                src={images.common.icCloseCircle}
                alt="disconnect-stripe"
                className={classes.icDisableConnectStripe}
              />
            )}
            <div className={classes.info}>{account}</div>
            <div className={classes.type}>Stripe Account</div>
          </>
        )}
        {!account && !loading && (
          <Button
            disabled={loading}
            className={classes.button}
            type="button"
            buttonType={'transparent'}
            buttonSize={'l'}
            onClick={onConnectStripe}>
            <>
              <img src={images.account.partner.icBank} alt={'bank-error'} />
              Add Card/Account
            </>
          </Button>
        )}
      </div>

      {visibleModalConfirmDisconnectStripe && (
        <Suspense fallback={null}>
          <ModalConfirmDisconnectStripe
            isOpen={visibleModalConfirmDisconnectStripe}
            onClose={() => setVisibleModalConfirmDisconnectStripe(false)}
            onDelete={onDelete}
          />
        </Suspense>
      )}
    </Card>
  );
};

export default PaymentInfo;
