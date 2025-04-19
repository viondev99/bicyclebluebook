import Tooltip from '@ui/Tooltip/Tooltip';
import React, { FC, useState } from 'react';
import iconBBBDirect from 'assets/img/marketplace/ic_bbb_direct.svg';
import Card from '../../Cards';
import Modal from '../../Modal';

import classes from './badge.module.scss';

interface Props {
  isShowLogo?: boolean;
}

const BBBDirectBadge: FC<Props> = ({ isShowLogo }) => {
  const [showModal, setShowModal] = useState(false);
  const renderTooltipForBBBDirect = () => {
    return (
      <Card className={classes.card}>
        <h5>This item ships from the Bicycle Blue Book warehouse.</h5>
        <button type="button" className={classes.linkButton} onClick={() => setShowModal(true)}>
          Learn More
        </button>
      </Card>
    );
  };

  const renderModalBBBDirect = () => {
    return (
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        className={classes.modalBadge}
        title={'Bicycle Blue Book Verified'}
        headerClassName={classes.headerModal}
        bodyClassName={classes.bodyModal}
        contentClassName={classes.contentModal}>
        <div className={classes.modalBadgeContainer}>
          <p className={classes.modalContent}>The advantages to buying our verified bikes are:</p>
          <ul className={classes.modalContent}>
            <li>No hassle, 30 day return policy</li>
            <li>Purchasing from a trusted source</li>
            <li>Examined by Bicycle Blue Book certified mechanics</li>
          </ul>
        </div>
      </Modal>
    );
  };
  return (
    <>
      {renderModalBBBDirect()}
      <Tooltip renderTooltip={renderTooltipForBBBDirect()}>
        {!isShowLogo ? (
          <img src={iconBBBDirect} alt="bbb-direct" style={{ cursor: 'pointer' }} />
        ) : (
          <div className={classes.bbbDirect}>
            <span>BBB Direct</span>
          </div>
        )}
      </Tooltip>
    </>
  );
};

export default BBBDirectBadge;
