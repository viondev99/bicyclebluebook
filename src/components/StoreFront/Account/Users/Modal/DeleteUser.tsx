import React, { FC } from 'react';
import cx from 'classnames';
import { useSelector } from 'react-redux';

import images from 'assets/images';

import StoreState from 'model/store';
import classes from '../users.module.scss';
import Modal from '@ui/Modal/Modal';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import Button from '@ui/Buttons/Primary/Button';

interface Props {
  isOpen: boolean;
  onRemove: () => void;
  onClose: () => void;
}

const RemoveUser: FC<Props> = (props) => {
  const { isOpen, onRemove, onClose } = props;
  const { loading } = useSelector((store: StoreState) => ({
    loading: store.storeFront.account.loadingAction,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      centered={true}
      className={classes.removeUserModal}
      style={{ width: 500 }}
      header={
        <>
          <h2>Remove User</h2>
          <ImageButton className={cx('buttonClose', 'd-block', 'd-md-none')} clear={true} onClick={onClose}>
            <img src={images.iconBack} alt={'close-icon'} />
          </ImageButton>
        </>
      }>
      <div className={classes.description}>
        Are you sure you want to remove this user? This is permanent and cannot be undone.
      </div>
      <div className={classes.buttonGroup}>
        <Button disabled={loading} buttonType="danger" onClick={onRemove}>
          Remove User
        </Button>
        <Button buttonType="outline" onClick={onClose} style={{ marginLeft: 20 }}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default RemoveUser;
