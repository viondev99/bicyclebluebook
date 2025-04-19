import React, { FC, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import cx from 'classnames';

import images from 'assets/images';

import Button from '@ui/Buttons/Primary/Button';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import classes from './chat.module.scss';
import { deselectConversation } from '../../../store/message/message.action';
import Title from './Info/Title';
import Image from './Info/Image';
import Actions from './Modal/Actions';

const ChatInfo: FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  useEffect(() => {
    return () => dispatch(deselectConversation());
  }, [dispatch]);

  const onBack = useCallback(() => {
    dispatch(deselectConversation());
    router.push({ pathname: router.pathname, query: {} });
  }, [dispatch, router]);

  const toggleAction = useCallback(() => {
    setShow(!show);
  }, [show]);

  return (
    <div className={classes.infoContainer}>
      <div className={classes.infoContent}>
        <Button className={classes.backButton} buttonType="transparent" onClick={onBack}>
          <img className={classes.iconBack} src={images.messages.icBackBlack} alt={'back-icon'} />
          Back to messages
        </Button>
        <Title />
      </div>
      <div className={cx('d-none', 'd-sm-block')}>
        <Image />
      </div>
      <Actions show={show} onClose={toggleAction} />
      <div className={classes.buttonMoreAction}>
        <ImageButton onClick={toggleAction}>
          <img src={images.messages.icMoreAction} alt={'more-icon'} />
        </ImageButton>
      </div>
    </div>
  );
};

export default ChatInfo;
