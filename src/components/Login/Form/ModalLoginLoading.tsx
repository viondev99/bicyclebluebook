/* eslint-disable react-hooks/rules-of-hooks */
import React, { FC, useMemo } from 'react';
import Modal from '@ui/Modal/Modal';
import cx from 'classnames';
import classes from './loginForm.module.scss';

interface Props {
  isOpen: boolean;
}

const ModalLoginLoading: FC<Props> = ({ isOpen }) => {
  const renderHeader = useMemo(() => {
    return (
      <div className={cx(classes.wrapHeader)}>
        <div className={classes.animationLoading}>
          <div className={classes.loader}>
            <div />
          </div>
        </div>
      </div>
    );
  }, []);

  const renderBody = useMemo(() => {
    return <div className={classes.wrapBody}>Logging in...</div>;
  }, []);

  return (
    <>
      <div className={classes.wrapModel}>
        <Modal
          onClose={null}
          isOpen={isOpen}
          className={classes.modal}
          contentClassName={classes.content}
          bodyClassName={classes.body}
          showClose={false}
          header={<>{renderHeader}</>}>
          {renderBody}
        </Modal>
      </div>
    </>
  );
};

export default ModalLoginLoading;
