/* eslint-disable react-hooks/rules-of-hooks */
import React, { FC, useMemo } from 'react';
import Modal from '@ui/Modal/Modal';
import useScreenDetect from 'hooks/useScreenDetect';
import { formatDateNoTime } from 'helpers/date.helper';
import { safelySetHtml } from 'helpers/html.helper';
import classes from './tp-dashboard.module.scss';

interface UserCreated {
  _id: string;
  email: string;
  name: string;
}

interface Datum {
  user_created: UserCreated;
  users_subscriber_read: string[];
  users_un_subscriber: string[];
  status: string;
  _id: string;
  type: string;
  title: string;
  content: string;
  date_created: Date;
  date_updated: Date;
  date_published: Date;
}
interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemNoti: Datum[];
  titleNoti: string[];
}

const PopupNotification: FC<Props> = ({ isOpen, onClose, itemNoti, titleNoti }) => {
  const { currentWidthScreen } = useScreenDetect();
  const contentNoti = itemNoti?.map((it) => it.content);
  const date_published = itemNoti?.map((it) => it.date_published);
  const author = itemNoti?.map((it) => it.user_created?.name);
  const date = formatDateNoTime(date_published.toString());

  const renderDescriptionNoti = useMemo(() => {
    const checkStringInDescriptions = contentNoti.toString().includes('<li>' || '</li>' || '<ul>' || '</ul>');
    if (checkStringInDescriptions) {
      return (
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: safelySetHtml(contentNoti?.toString()),
          }}
        />
      );
    }
    return <pre className={classes.fixPreTag}>{contentNoti?.toString()}</pre>;
  }, [contentNoti]);

  const renderBody = useMemo(() => {
    return (
      <div className={classes.wrapBody}>
        <p className={classes.titleNoti}>{titleNoti || ''}</p>
        <p className={classes.contentNotiPopup}>{renderDescriptionNoti || ''}</p>
        <p className={classes.footerNoti}>{`– ${author}, ${formatDateNoTime(date)}` || ''}</p>
      </div>
    );
  }, [author, date, renderDescriptionNoti, titleNoti]);

  return (
    <div className={classes.wrapModel}>
      <Modal
        centered
        onClose={onClose}
        isOpen={isOpen}
        className={classes.modal}
        contentClassName={classes.content}
        bodyClassName={classes.body}
        icArrowLeftClassName={classes.icArrowLeftClassName}
        hideButtonClose={currentWidthScreen <= 767}
        showButtonCloseXBlackLeft={currentWidthScreen <= 767}
        title={`Important Notification  `}>
        {renderBody}
      </Modal>
    </div>
  );
};

export default PopupNotification;
