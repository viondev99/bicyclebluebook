import React, { FC, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cx from 'classnames';
import images from 'assets/images';
import Button from '@ui/Buttons/Primary/Button';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import classes from './trade-in.module.scss';

interface Props {
  onRestart?: () => void;
  onSave?: () => void;
  visibleSaveStep?: boolean;
  loadingButton?: boolean;
  hideSave?: boolean;
  hideRestart?: boolean;
}

const Header: FC<Props> = (props) => {
  const { visibleSaveStep, loadingButton, hideSave, hideRestart } = props;
  const router = useRouter();

  const onExit = useCallback(() => {
    router.push(`/trade-in-account/my-account/profile`);
  }, [router]);

  return (
    <>
      <div className={classes.headerContainer}>
        <Link href={'/'}>
          <a className={cx('d-none', 'd-sm-block')}>
            <img className={classes.logo} src={images.common.icLogoV2} alt={'tradein-logo'} />
          </a>
        </Link>
        <div className={classes.title}>Trade In Request</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {!hideSave && (
            <Button
              disabled={loadingButton}
              className={cx(classes.title, classes.button, 'd-none', 'd-sm-block')}
              style={{ color: visibleSaveStep && '#4cb3e4', opacity: !visibleSaveStep && '0.3' }}
              buttonType="transparent"
              onClick={props.onSave}>
              Save
            </Button>
          )}
          {!hideRestart && (
            <Button
              disabled={loadingButton}
              className={cx(classes.title, classes.button, 'd-none', 'd-sm-block')}
              buttonType="transparent"
              onClick={props.onRestart}
              style={{ marginLeft: 36 }}>
              Restart
            </Button>
          )}
          <Button
            disabled={loadingButton}
            className={cx(classes.title, classes.button, 'd-none', 'd-sm-block')}
            style={{ marginLeft: 36 }}
            buttonType="transparent"
            onClick={onExit}>
            Exit
          </Button>
          <ImageButton className={cx(classes.button, 'd-sm-none', 'd-block')} onClick={props.onSave}>
            <img
              style={{ width: 18, height: 18, opacity: !visibleSaveStep && '0.3' }}
              src={images.tradeIn.icSaveBlue}
              alt={'restart-icon'}
            />
          </ImageButton>
          <ImageButton className={cx(classes.button, 'd-sm-none', 'd-block')} onClick={props.onRestart}>
            <img style={{ width: 18, height: 18 }} src={images.tradeIn.icRestart} alt={'restart-icon'} />
          </ImageButton>
          <ImageButton className={cx(classes.button, 'd-sm-none', 'd-block')} onClick={onExit}>
            <img style={{ width: 14, height: 14 }} src={images.tradeIn.icClose} alt={'close-icon'} />
          </ImageButton>
        </div>
      </div>
    </>
  );
};

export default Header;
