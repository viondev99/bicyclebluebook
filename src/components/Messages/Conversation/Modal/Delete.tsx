import React, { FC } from 'react';
import cx from 'classnames';

import images from 'assets/images';

import Modal from '@ui/Modal/Modal';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import Button from '@ui/Buttons/Primary/Button';
import classes from '../conversation.module.scss';

interface Props {
  show: boolean;
  onDelete: () => void;
  onCancel: () => void;
}

const Delete: FC<Props> = (props) => {
  const { show, onDelete, onCancel } = props;

  return (
    <Modal
      isOpen={show}
      onClose={onCancel}
      centered={true}
      className={classes.deleteConversationModal}
      style={{ width: 500 }}
      header={
        <>
          <h2>Delete Chat</h2>
          <ImageButton className={cx('buttonClose', 'd-block', 'd-md-none')} clear={true} onClick={onCancel}>
            <img src={images.iconBack} alt={'close-icon'} />
          </ImageButton>
        </>
      }>
      <div className={classes.description}>
        Are you sure you want to remove this chat from your message history? This cannot be undone.
      </div>
      <div className={classes.buttonGroup}>
        <Button buttonType="danger" onClick={onDelete}>
          Delete
        </Button>
        <Button buttonType="outline" onClick={onCancel} style={{ marginLeft: 20 }}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default Delete;
