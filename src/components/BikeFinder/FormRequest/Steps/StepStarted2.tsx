import Button from '@ui/Buttons/Primary/Button';
import { useRouter } from 'next/router';
import React, { FC, memo, useCallback, useMemo } from 'react';
import icRightArrowWhite from 'assets/img/trade-in/ic_right_arrow_white.svg';
import Link from 'next/link';
import cx from 'classnames';
import useScreenDetect from 'hooks/useScreenDetect';
import classes from './step.module.scss';
import icArrowLeftGrey from '../../../../assets/img/messages/ic_arrow_left_grey.svg';
import iconNextWhite from '../../../../assets/img/register/ic_next_white.svg';
import GroupButton from './GroupButton';

const StepStarted2: FC = () => {
  const { currentWidthScreen } = useScreenDetect();
  const { replace, pathname, query, asPath } = useRouter();
  const gotoStepOne = useCallback(() => {
    replace({
      pathname,
      query: {
        ...query,
        step: 1,
      },
    });
  }, [pathname, query, replace]);

  const onBack = useCallback(() => {
    replace({
      pathname,
    });
  }, [pathname, replace]);

  return (
    <>
      <div className={classes.wrapStepStarted2}>
        <div className={classes.stepTitle}>Need our help finding the perfect bike?</div>
        <p className={classes.textContent}>
          Answer a few simple questions and we'll show
          <br />
          you the right bikes to suit your needs.
        </p>
      </div>
      <GroupButton onClickBack={onBack} onClickContinue={gotoStepOne} />
      <div className={classes.wrapButtonSupportFixed} />
    </>
  );
};

export default memo(StepStarted2);
