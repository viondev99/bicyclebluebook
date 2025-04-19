import React, { FC, ReactElement } from 'react';
import Card from '@ui/Cards/index';
import Button from '@ui/Buttons/Primary/Button';
import Link from 'next/link';
import classes from './not-found.module.scss';

interface Props {
  title?: string;
  content?: ReactElement;
}

const NotFoundItem: FC<Props> = ({ title = '', content }) => {
  return (
    <Card className={classes.notFound}>
      <div className={classes.titleNotFound}>{title}</div>
      <Button color="primary" className={classes.btnShowMkp}>
        {content || (
          <Link href="/marketplace/buy-now">
            <a>Visit Marketplace</a>
          </Link>
        )}
      </Button>
    </Card>
  );
};

export default NotFoundItem;
