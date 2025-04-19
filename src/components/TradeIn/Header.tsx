import React, { FC, useCallback } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import classes from './trade-in.module.scss';

import icLogoV2 from '../../assets/img/common/logo_v2.svg';
import icRestart from '../../assets/img/trade-in/ic_restart.svg';
import icClose from '../../assets/img/trade-in/ic_close.svg';

interface Props {
  onRestart: () => void;
}

const Header: FC<Props> = (props) => {
  const onExit = useCallback(() => {
    Router.push('/sell-tradein');
  }, []);

  return (
    <>
      <div className={classes.headerContainer}>
        <Link href={'/'}>
          <a className={cx('d-none', 'd-sm-block')}>
            <img className={classes.logo} src={icLogoV2} alt={'bicyclebluebook-logo'} />
          </a>
        </Link>
        <div className={classes.title}>Trade In</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            className={cx(classes.title, classes.button, 'd-none', 'd-sm-block')}
            buttonType="transparent"
            onClick={props.onRestart}>
            Restart
          </Button>
          <Button
            className={cx(classes.title, classes.button, 'd-none', 'd-sm-block')}
            style={{ marginLeft: 36 }}
            buttonType="transparent"
            onClick={onExit}>
            Exit
          </Button>
          <ImageButton className={cx(classes.button, 'd-sm-none', 'd-block')} onClick={props.onRestart}>
            <img style={{ width: 18, height: 18 }} src={icRestart} alt={'restart-icon'} />
          </ImageButton>
          <ImageButton
            className={cx(classes.button, 'd-sm-none', 'd-block')}
            style={{ marginLeft: 28 }}
            onClick={onExit}>
            <img style={{ width: 14, height: 14 }} src={icClose} alt={'close-icon'} />
          </ImageButton>
        </div>
      </div>
    </>
  );
};

export default Header;
