import React, { FC, useMemo, useCallback } from 'react';
import toLower from 'lodash/toLower';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

import StoreState from 'model/store';
import { MessageModel } from 'model/store/message.model';
import { useUserInfo } from 'hooks/useUserInfo';
import { useStoreInfo } from 'hooks/useStoreInfo';
import classes from '../chat.module.scss';

function checkImageFile(name: string) {
  const typeImages = ['jpg', 'jpeg', 'png'];
  const array = name.split('.');
  return typeImages.includes(toLower(array[array.length - 1]));
}

interface Props {
  message: MessageModel;
  merge: boolean;
}

const Left: FC<Props> = (props) => {
  const { message, merge } = props;
  const { attachments, selected, storefront } = useSelector((store: StoreState) => ({
    attachments: store.message.message.attachments,
    selected: store.message.conversation.selected,
    storefront: store.authenticate.user?.storefront,
  }));

  const isAllParticipantStore = selected?.first_receiver_is_store && selected?.first_sender_is_store;

  const listIDStore = useMemo(() => {
    return [selected?.first_receiver, selected?.first_sender, message.senderId];
  }, [message.senderId, selected]);
  const stores = useStoreInfo(listIDStore);
  const users = useUserInfo(message.senderId);

  const storeInConvention = useMemo(() => {
    return stores
      ?.filter((i) => i?.id !== storefront)
      ?.find((it) => it.id === selected?.first_receiver || it.id === selected?.first_sender);
  }, [selected, storefront, stores]);

  const info = useMemo(() => {
    if (stores?.length && isAllParticipantStore) {
      return storeInConvention || { id: '', name: 'Unknown User', avatar: '' };
    }
    if (stores?.length && !isAllParticipantStore) {
      if (storefront) {
        return users || { id: '', name: 'Unknown User', avatar: '' };
      }

      return storeInConvention || { id: '', name: 'Unknown User', avatar: '' };
    }
    return users || { id: '', name: 'Unknown User', avatar: '' };
  }, [stores, isAllParticipantStore, users, storeInConvention, storefront]);

  const attachment = useMemo(() => {
    if (message.attachment) {
      return attachments.find((item) => item.id === message.attachment);
    }
    return null;
  }, [message.attachment, attachments]);

  const renderAvatar = useCallback(() => {
    if (info.avatar) {
      return <img className={classes.bubblyAvatar} src={info.avatar} alt={'avatar'} />;
    }
    return (
      <div className={classes.bubblyAvatarDefault} style={{ background: info.gravatar ? `url(${info.gravatar})` : '' }}>
        {info.name.charAt(0).toUpperCase()}
      </div>
    );
  }, [info]);

  return (
    <div className={classes.leftBubbleContainer}>
      {!merge && <div className={classes.senderName}>{info.name}</div>}
      <div className={classes.contentContainer}>
        <div className={classes.avatarContainer}>{!merge && renderAvatar()}</div>
        <div>
          {message.message && (
            <div className={classes.contentMessage}>
              <span className={classes.timeTooltip}>{dayjs(message.dateCreated).format('HH:mm')}</span>
              {message.message}
            </div>
          )}
          {attachment && (
            <div className={classes.contentMessage} title={dayjs(message.dateCreated).format('HH:mm')}>
              <span className={classes.timeTooltip}>{dayjs(message.dateCreated).format('HH:mm')}</span>
              <a className={classes.fileMessage} href={attachment.link} target={'_blank'}>
                {/* Replace last character - to . */}
                {checkImageFile(attachment.name.replace(/-([^-]*)$/, '.$1')) ? (
                  <img className={classes.fileImage} src={attachment.link} alt={'file-error'} />
                ) : (
                  attachment.name.replace(/-([^-]*)$/, '.$1')
                )}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Left;
