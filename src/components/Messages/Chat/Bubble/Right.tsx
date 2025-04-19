import React, { FC, useMemo } from 'react';
import toLower from 'lodash/toLower';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import cx from 'classnames';
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

const Right: FC<Props> = (props) => {
  const { message, merge } = props;
  const { myId, attachments } = useSelector((store: StoreState) => ({
    myId: store.authenticate.user?._id,
    attachments: store.message.message.attachments,
  }));

  const users = useUserInfo(message.userId || message.senderId);
  const stores = useStoreInfo(message.senderId);

  const info = useMemo(() => {
    return users || stores || { id: '', name: 'Unknown User', avatar: '' };
  }, [users, stores]);

  const attachment = useMemo(() => {
    if (message.attachment) {
      return attachments.find((item) => item.id === message.attachment);
    }
    return null;
  }, [message.attachment, attachments]);

  const showName = useMemo(() => {
    return message.userId && message.userId !== myId;
  }, [message.userId, myId]);

  return (
    <div className={classes.rightBubbleContainer}>
      {/* {showName && !merge && <div className={classes.senderName}>{info.name}</div>} */}
      {message.message && (
        <div className={classes.contentMessage}>
          <span className={classes.timeTooltip}>{dayjs(message.dateCreated).format('HH:mm')}</span>
          {message.message}
        </div>
      )}
      {attachment && (
        <div className={classes.contentMessage}>
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
  );
};

export default Right;
