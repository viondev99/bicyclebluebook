import React, { FC, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { addTag } from 'helpers/common.helper';
import Button from '@ui/Buttons/Primary/Button';
import useScreenDetect from 'hooks/useScreenDetect';
import classes from './form-request.module.scss';

interface Props {}

const Complete: FC<Props> = () => {
  const { back } = useRouter();
  const { currentWidthScreen } = useScreenDetect();

  useEffect(() => {
    addTag({
      event: 'VirtualPageView',
      virtualBBBTradeInPageTitle: 'TradeInComplete',
      virtualBBBTradeInPageUrl: '/trade-in/request/complete',
    });
  }, []);

  const onExit = useCallback(() => {
    back();
  }, [back]);

  return (
    <div className={classes.container} style={{ marginTop: currentWidthScreen >= 768 && 150 }}>
      <div className={classes.formContainer}>
        <h1 className={classes.title}>Trade in request submitted!</h1>
        <div className={classes.message}>
          A Bicycle Blue Book representative will reach out soon to discuss next steps in the trade in process. If you
          have any questions about the process, review our{' '}
          <Link href={'/help'}>
            <a className={classes.linkCustom}>FAQs</a>
          </Link>{' '}
          or email us at{' '}
          <a className={classes.linkCustom} href={'mailto:tradein@bicyclebluebook.com'}>
            tradein@bicyclebluebook.com
          </a>
          .
        </div>
        <Button className={classes.exitButton} buttonSize={'l'} buttonType={'outline'} onClick={onExit}>
          Exit
        </Button>
      </div>
    </div>
  );
};

export default Complete;
