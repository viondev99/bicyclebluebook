import React, { FC } from 'react';
import cx from 'classnames';
import classes from './section.module.scss';
import WrapSection from './WrapSection';

interface Props {
  isActive: boolean;
}

const Section6: FC<Props> = ({ isActive }) => {
  return (
    <WrapSection isActive={isActive} className={classes.resetBg}>
      <div>
        <div className={classes.title}>That’s it! Simple.</div>
        <div className={cx(classes.intro, classes.completeSection6)}>
          Simply take the bike to your preferred Trade in Partner when your ready. Your bike’s condition will be checked
          and if correct, you’ll receive the quoted amount.
        </div>
      </div>
    </WrapSection>
  );
};

export default Section6;
