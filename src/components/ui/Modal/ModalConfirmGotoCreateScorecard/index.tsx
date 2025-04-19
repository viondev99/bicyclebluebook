/* eslint-disable react/jsx-key */
import React, { FC, memo, useCallback, useState } from 'react';
import cx from 'classnames';
import Modal from '@ui/Modal/Modal';
import useScreenDetect from 'hooks/useScreenDetect';
import Button from '@ui/Buttons/Primary/Button';
import { useRouter } from 'next/router';
import { updateStatusQuotes } from 'api/partner/scorecard.api';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import classes from './modal-confirm-goto-create-scorecard.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isTour?: boolean;
  scorecardId?: number;
  isCreateNew?: boolean;
  onCreatedScoreCard?: () => void;
  handleGetListHistory?: () => void;
}

const ModalConfirmGotoCreateScorecard: FC<Props> = ({
  isOpen,
  onClose,
  isTour,
  scorecardId,
  isCreateNew,
  onCreatedScoreCard,
  handleGetListHistory,
}) => {
  const { currentWidthScreen } = useScreenDetect();
  const router = useRouter();
  const [loadingButton, setLoadingButton] = useState(false);

  const gotoCreateScorecard = useCallback(async () => {
    try {
      setLoadingButton(true);
      if (onCreatedScoreCard) {
        onCreatedScoreCard();
        return;
      }
      if (isCreateNew) {
        return router.replace('/trade-in-account/trade-in/new');
      }
      await updateStatusQuotes(scorecardId, 'CONVERTED');
      handleGetListHistory();
      toastSuccess('Updated Successfully');
      onClose();
    } catch (error) {
      setLoadingButton(false);
      toastError(error);
    }
  }, [handleGetListHistory, isCreateNew, onClose, onCreatedScoreCard, router, scorecardId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      centered={true}
      titleClassName={classes.titleClassName}
      className={cx(classes.customModalSize, {
        [classes.tour]: isTour,
      })}
      contentClassName={classes.paddingContentClassName}
      bodyProps={{
        className: classes.customModalBody,
      }}
      icArrowLeftClassName={classes.icArrowLeftClassName}
      hideButtonClose={currentWidthScreen <= 767}
      showButtonCloseXBlackLeft={currentWidthScreen <= 767}
      title={`Create Scorecard`}>
      <div className={classes.wrapBody}>
        <div className={classes.description}>This will create a scorecard in the scorecard tab.</div>
        <div className={classes.description}>Do you wish to continue?</div>
        <div className={classes.wrapButton}>
          <Button
            disabled={loadingButton}
            onClick={gotoCreateScorecard}
            className={cx(classes.customButtonSize, classes.btnCreate)}>
            Create Scorecard
          </Button>
          <Button disabled={loadingButton} onClick={onClose} buttonType="outline" className={classes.customButtonSize}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ModalConfirmGotoCreateScorecard);
