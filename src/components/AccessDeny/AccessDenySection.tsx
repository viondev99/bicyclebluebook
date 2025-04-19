import React, { FC } from 'react';
import cx from 'classnames';
import classes from './access-deny.module.scss';

const AccessDenySection: FC = () => {
  return (
    <section className={classes.cover}>
      <div className={cx('container', classes.sectionContainer)}>
        <h2>Access denied</h2>
        <p className={classes.title}>Error code 1020</p>
      </div>
      <div className={cx('container', classes.sectionCover)}>
        <div className={classes.section}>
          <p>You do not have access to bicyclebluebook.com.</p>
          <p>The site owner may have set restrictions that prevent you from accessing the site.</p>
          <p>Contact the site owner for access or try turning off any VPN or Proxy and load the page again.</p>
        </div>
      </div>
    </section>
  );
};

export default AccessDenySection;
