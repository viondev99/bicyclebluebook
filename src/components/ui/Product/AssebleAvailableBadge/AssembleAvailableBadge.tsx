import React, { FC, useState } from 'react';
import iconAssemble from 'assets/img/marketplace/ic_assemble.svg';

import Tooltip from '../../Tooltip/Tooltip';
import Card from '../../Cards';
import Modal from '../../Modal';
import classes from './assemble-available-badge.module.scss';

const AssembleAvailableBadge: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const renderTooltipForAssembled = () => {
    return (
      <Card className={classes.card}>
        <h5>This bike is available fully assembled for local pickup.</h5>
        <button type="button" className={classes.linkButton} onClick={() => setShowModal(true)}>
          Learn More
        </button>
      </Card>
    );
  };

  const renderModalAssembleAvailable = () => {
    return (
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        className={classes.modalBBBDirect}
        bodyClassName={classes.bodyAssemble}
        contentClassName={classes.contentModal}
        headerClassName={classes.headerAssemble}>
        <div className={classes.modalBadgeContainer}>
          <div className={classes.section}>
            <p className={classes.title}>Address</p>
            <p className={classes.content}>2240 Paragon Drive, San Jose, CA 95131</p>
          </div>
          <div className={classes.section}>
            <p className={classes.title}>Hours</p>
            <p className={classes.content}>Mon – Fri, 10am – 5.30pm</p>
            <p className={classes.content}>Sat, 10am – 2pm, 2.30pm – 5.30pm</p>
          </div>
          <div className={classes.section}>
            <p className={classes.title}>Phone</p>
            <p className={classes.content}>(669) 263 – 6305</p>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <>
      {renderModalAssembleAvailable()}
      <Tooltip renderTooltip={renderTooltipForAssembled()}>
        <img src={iconAssemble} alt="assembled" style={{ cursor: 'pointer' }} />
      </Tooltip>
    </>
  );
};

export default AssembleAvailableBadge;
