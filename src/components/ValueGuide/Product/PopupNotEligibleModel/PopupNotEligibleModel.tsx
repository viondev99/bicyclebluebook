import React, { FC } from 'react';
import Modal from '@ui/Modal/Modal';
import useScreenDetect from 'hooks/useScreenDetect';
import ContentEligibleModel from './ContentEligibleModel/ContentEligibleModel';
import classes from './popupNotEligibleModel.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  typeBike: string;
  fairCondition?: number;
  onRestart?: () => void;
  onReturn?: () => void;
  isShowButtonControlScoreCard?: boolean;
}

const PopupNotEligibleModel: FC<Props> = ({
  isOpen,
  onClose,
  typeBike,
  fairCondition,
  onRestart,
  onReturn,
  isShowButtonControlScoreCard,
}) => {
  const { currentWidthScreen } = useScreenDetect();
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
        title={`Not eligible for trade in`}>
        <ContentEligibleModel
          typeBike={typeBike}
          fairCondition={fairCondition}
          onRestart={onRestart}
          onReturn={onReturn}
          isShowButtonControlScoreCard={isShowButtonControlScoreCard}
        />
      </Modal>
    </div>
  );
};

export default PopupNotEligibleModel;
