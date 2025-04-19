import React, { FC, memo, useMemo } from 'react';
import Modal from '@ui/Modal/Modal';
import useScreenDetect from 'hooks/useScreenDetect';
import classes from './modal-tooltip-wheel-drivertrain.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: string;
}

const ModalTooltipWheelDrivertrain: FC<Props> = ({ isOpen, onClose, type }) => {
  const { currentWidthScreen } = useScreenDetect();

  const renderType = useMemo(() => {
    return type === 'Drivetrain' ? 'drivetrain' : 'wheelset';
  }, [type]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      centered={true}
      titleClassName={classes.titleClassName}
      className={classes.customModalSize}
      contentClassName={classes.paddingContentClassName}
      bodyProps={{
        className: classes.customModalBody,
      }}
      icArrowLeftClassName={classes.icArrowLeftClassName}
      hideButtonClose={true}
      showButtonCloseXBlackLeft={currentWidthScreen <= 767}
      title={`Modified ${type}`}>
      <div className={classes.wrapForm}>
        <div className={classes.wrapFormItem}>
          <div className={classes.titleForm}>
            Select <span>upgraded</span> for trade-ins that have a {renderType} greater in value than the original{' '}
            {renderType} noted in the bicycle details.
          </div>
          <div className={classes.titleForm}>
            Select <span>downgraded</span> for trade-ins that have a {renderType} lesser in value than the original{' '}
            {renderType} noted in the bicycle details.
          </div>
          <div className={classes.titleForm}>
            If no changes have been made, leave as <span>none</span>.
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ModalTooltipWheelDrivertrain);
