import React, { FC } from 'react';
import Link from 'next/link';

import Button from '@ui/Buttons/Primary/Button';
import t from 'helpers/language';
import classes from './reset-password-success-full-screen.module.scss';

const ResetPasswordSuccessFullScreen: FC = () => {
  return (
    <div style={{ flex: 1, background: '#fff', margin: '20px 0px' }}>
      <div className={classes.content}>
        <h2 style={{ marginTop: 30, marginBottom: 40 }}>{t('myAccount.profile.changePassword')}</h2>
        <Link href={'/'}>
          <Button type="button" style={{ width: '100%', marginTop: 30 }}>
            Return to Bicycle Blue Book
          </Button>
        </Link>
      </div>
    </div>
  );
};
export default ResetPasswordSuccessFullScreen;
