import React from 'react';
import iconPadLock from 'assets/img/sell/ic_padlock.svg';
import iconHistory from 'assets/img/marketplace/ic_history.component.svg';
import iconGuarantee from 'assets/img/marketplace/ic_guarantee.component.svg';
import classes from './bbb-direct.module.scss';

const IconHistory = iconHistory;
const IconGuarantee = iconGuarantee;

const BBBDirectInfo = () => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.title}>This bike is Bicycle Blue Book Verified</div>
      <div className={classes.groupInfo}>
        <div className={classes.icon}>
          <IconHistory />
        </div>
        No hassle, 30 day return policy
      </div>
      <div className={classes.groupInfo}>
        <img src={iconPadLock} alt="iconPadLock" className={classes.icon} />
        Purchasing from a trusted source
      </div>
      <div className={classes.groupInfo}>
        <IconGuarantee className={classes.icon} />
        Examined by our certified mechanics
      </div>
    </div>
  );
};

export default BBBDirectInfo;
