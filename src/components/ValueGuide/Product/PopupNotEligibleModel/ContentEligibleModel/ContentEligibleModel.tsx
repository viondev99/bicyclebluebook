import Button from '@ui/Buttons/Primary/Button';
import { useRouter } from 'next/router';
import React, { FC, useMemo } from 'react';
import classes from './contentEligibleModel.module.scss';

interface Props {
  typeBike: string;
  fairCondition?: number;
  isShowButtonControlScoreCard?: boolean;
  onRestart?: () => void;
  onReturn?: () => void;
}

const ContentEligibleModel: FC<Props> = ({
  typeBike,
  fairCondition,
  onRestart,
  onReturn,
  isShowButtonControlScoreCard,
}) => {
  const renderTextContent = useMemo(() => {
    if (typeBike === 'Kids') {
      return 'Bicycle Blue Book is no longer accepting kids bikes through our trade-in program. We apologize for any inconvenience this may cause.';
    }
    if (typeBike === 'E-Bike') {
      return 'Bicycle Blue Book is no longer accepting E-Bikes through our trade-in program. We apologize for any inconvenience this may cause.';
    }
    if (fairCondition < 400) {
      return 'Bikes with a trade-in value below $400 are not eligible for the Bicycle Blue Book trade-in program. We apologize for any inconvenience this may cause.';
    }
    return '';
  }, [fairCondition, typeBike]);

  return (
    <>
      <p className={classes.textContent}>{renderTextContent}</p>
      {isShowButtonControlScoreCard && (
        <div className={classes.btnBottom}>
          <Button onClick={onRestart}>Restart Scorecard</Button>
          <Button onClick={onReturn} className={classes.btnRight}>
            Return to Partner Portal
          </Button>
        </div>
      )}
    </>
  );
};

export default ContentEligibleModel;
