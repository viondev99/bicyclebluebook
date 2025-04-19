import React, { FC, memo, useCallback, useState } from 'react';
import { useRouter } from 'next/router';

import { toastSuccess, toastError } from 'helpers/utils.helper';
import { reactivateAccount } from 'api/authenticate.api';
import Modal from '@ui/Modal/Modal';
import Button from '@ui/Buttons/Primary/Button';
import classes from './reactivate-modal.module.scss';

const ReactivateModal: FC = () => {
  const { pathname, query, replace } = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const onClose = useCallback(() => {
    replace({ pathname, query: {} });
  }, [replace, pathname]);

  const onReactivateAccount = useCallback(() => {
    setLoading(true);
    reactivateAccount(query?.reactivate as string)
      .then(() => {
        toastSuccess(
          'Reactivate account successfully! An e-mail with instructions on how to set your new password has been sent.',
        );
        setLoading(false);
      })
      .catch((e) => {
        toastError(e);
        setLoading(false);
      });
    onClose();
  }, [query, onClose]);

  return (
    <Modal
      className={classes.reactivateModal}
      centered={true}
      isOpen={!!query?.reactivate}
      onClose={onClose}
      header={null}>
      <div className={classes.description} style={{ marginBottom: 30 }}>
        There is currently a disabled account attached to this email.
        <br />
        Would you like to reactivate it?
      </div>
      <div className={classes.buttonGroup}>
        <Button disabled={loading} type="button" buttonSize={'l'} buttonType={'primary'} onClick={onReactivateAccount}>
          Yes, reactivate account
        </Button>
        <Button type="button" buttonSize={'l'} buttonType={'outline'} onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default memo(ReactivateModal);
