import React, { FC, useCallback, useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Modal from '@ui/Modal/Modal';
import cx from 'classnames';
import Link from 'next/link';
import CONFIG from 'config';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import Button from '@ui/Buttons/Primary/Button';
import useScreenDetect from 'hooks/useScreenDetect';
import icCircleTickBlue from 'assets/img/trade-in/ic_circle_tick_blue.svg';
import iconWhiteFacebook from 'assets/img/logo/ic_facebook_white.svg';
import iconClose from 'assets/img/modal/ic_close.svg';
import iconWhiteTwitterLogo from 'assets/img/logo/ic_twitter_white.svg';
import iconSaveLink from 'assets/img/logo/ic_save_link.svg';
import iconWhiteEmailLogo from 'assets/img/logo/ic_email_white.svg';
import InvisibleBackdrop from '../Backdrop/InvisibleBackdrop';
import classes from './share-social-modal.module.scss';

interface Props {
  onClose: (isCopyMobile?: boolean) => void;
  open: boolean;
}

const ModalShareSocial: FC<Props> = ({ onClose, open }) => {
  const { asPath } = useRouter();
  const screen = useScreenDetect();
  const [popupSuccessVisible, setPopupSuccessVisible] = useState(false);
  const currentURL = useMemo(() => {
    return `${CONFIG.WEB_URL}${asPath.slice(1, asPath.length)}`;
  }, [asPath]);
  const linkFacebook = `https://www.facebook.com/sharer/sharer.php?u=${currentURL}`;
  const linkTwitter = `http://twitter.com/share?url=${currentURL}`;
  // const linkInstagram = `https://www.instagram.com`;
  const linkEmail = `mailto:?body=${encodeURIComponent(currentURL)}`;

  useEffect(() => {
    let closeTimeout: NodeJS.Timeout = null;
    if (popupSuccessVisible) {
      closeTimeout = setTimeout(() => {
        setPopupSuccessVisible(false);
      }, 2500);
    }
    return () => {
      clearTimeout(closeTimeout);
    };
  }, [popupSuccessVisible]);
  const handleCopyLink = useCallback(() => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', currentURL);
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand('copy');
    document.body.removeChild(input);
    if (screen.isMediumScreen()) {
      onClose(true);
    } else {
      setPopupSuccessVisible(true);
    }
  }, [currentURL, onClose, screen]);
  const handleCloseWhenClickOut = useCallback(() => {
    setPopupSuccessVisible(false);
  }, []);
  return (
    <Modal
      centered={true}
      onClose={() => onClose(false)}
      isOpen={open}
      className={classes.modalShare}
      contentClassName={classes.contentModalShare}
      header={
        <div className={classes.wrapHeader}>
          <h2 className={classes.titleModal}>Share</h2>
          <div className={classes.titleModalMobile}>
            <div className={classes.lineIos} />
            Share With
          </div>
          <ImageButton
            className={cx('d-none', 'd-md-block', 'buttonClose')}
            clear={true}
            onClick={() => onClose(false)}>
            <img src={iconClose} alt={'close-icon'} />
          </ImageButton>
        </div>
      }>
      <div className={cx('d-flex', classes.wrapWhenMobile)}>
        <Link href={linkFacebook}>
          <a target="_blank" className={cx(classes.logoIcon, classes.iconFaceBook)}>
            <img src={iconWhiteFacebook} alt="icon facebook" />
            <span className={classes.titleLogo}>Facebook</span>
          </a>
        </Link>
        <Link href={linkTwitter}>
          <a target="_blank" className={cx(classes.logoIcon, classes.iconTwitter)}>
            <img src={iconWhiteTwitterLogo} alt="icon twitter" />
            <span className={classes.titleLogo}>Twitter</span>
          </a>
        </Link>
        {/* <Link href={linkInstagram}>
          <a target="_blank" className={cx(classes.logoIcon, classes.iconInstagram)}>
            <img src={images.iconWhiteInstagramLogo} alt="icon instagram" />
          </a>
        </Link> */}

        <Link href={linkEmail}>
          <a target="_blank" className={cx(classes.logoIcon, classes.iconEmail)}>
            <img src={iconWhiteEmailLogo} alt="icon email" />
            <span className={classes.titleLogo}>Email</span>
          </a>
        </Link>

        <Button className={cx(classes.logoIcon, classes.iconSaveLink)} buttonType="clear" onClick={handleCopyLink}>
          {popupSuccessVisible && (
            <InvisibleBackdrop onClick={handleCloseWhenClickOut}>
              <div className={classes.saveLinkSuccess}>
                <img src={icCircleTickBlue} alt="icon tick" className={classes.iconTick} />{' '}
                <span>URL copied to clipboard</span>
              </div>
            </InvisibleBackdrop>
          )}
          <img src={iconSaveLink} alt="icon save link" />
          <span className={classes.titleLogo}>Copy Link</span>
        </Button>
      </div>
    </Modal>
  );
};

export default ModalShareSocial;
