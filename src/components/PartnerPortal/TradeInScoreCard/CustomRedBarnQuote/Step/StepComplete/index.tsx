/* eslint-disable no-unused-expressions */
/* eslint-disable import/named */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-cycle */
import React, { FC, useState } from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import ModalAutoCloseAfter3s from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalAutoCloseAfter3s';
import { constTitleStepCustomQuote } from '../../constraint';
import images from '@images';
import Partner from './Account/Partner';
import classes from './step-complete.module.scss';

interface Props {
  onRestart: (isRestartOnly?: boolean) => void;
}

const StepComplete: FC<Props> = ({ onRestart }) => {
  const [visibleModalAutoNextToNewScorecard, setVisibleModalAutoNextToNewScorecard] = useState<boolean>(false);

  return (
    <div className={classes.wrapStepComplete}>
      <div className={classes.header}>
        <img src={images.icCircleCheckBlue} alt={'icon CircleCheckBlue'} />
        <div>{constTitleStepCustomQuote.StepComplete}</div>
      </div>
      <Row>
        <Col lg={9} md={8}>
          <div className={classes.customCard}>
            <div className={classes.text}>
              Thank you for submitting a trade in request. Our skilled team of bicycle appraisers will review your
              request and respond within 48 hours. Please email{' '}
              <a className={classes.customLink} href="mailto:dealersupport@bicyclebluebook.com" target="_top">
                dealersupport@bicyclebluebook.com
              </a>{' '}
              if you have any questions.
            </div>
          </div>
        </Col>
        <Col lg={3} md={4}>
          <Partner />
        </Col>
      </Row>
      {visibleModalAutoNextToNewScorecard && (
        <ModalAutoCloseAfter3s
          isOpen={visibleModalAutoNextToNewScorecard}
          onClose={() => setVisibleModalAutoNextToNewScorecard(false)}
          title="Stand by for creating next scorecard. Please wait..."
          page="custom"
          onRestart={onRestart}
        />
      )}
    </div>
  );
};

export default StepComplete;
