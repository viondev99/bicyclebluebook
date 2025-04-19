import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Card from '@ui/Cards';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import classes from './needHelpCard.module.scss';

const NeedHelpCard = () => {
  const router = useRouter();

  return (
    <Card className={cx(classes.card)}>
      <h4>Need help?</h4>
      <Link
        scroll={false}
        href={{
          pathname: router.pathname,
          query: { contact: true, backOnClose: true, redirectUrl: router.asPath, ...router.query },
        }}
        as={'/contact'}>
        <Button buttonType={'transparent'} className={cx(classes.button)}>
          Get in touch
        </Button>
      </Link>
    </Card>
  );
};

export default NeedHelpCard;
