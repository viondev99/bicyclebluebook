import React, { FC, memo, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cx from 'classnames';
import { TypeFinderBike } from 'constants/bike-finder';
import Button from '@ui/Buttons/Primary/Button';
import useScreenDetect from 'hooks/useScreenDetect';
import classes from './step.module.scss';

import icRightArrowWhite from '../../../../assets/img/trade-in/ic_right_arrow_white.svg';
import icArrowLeftGrey from '../../../../assets/img/messages/ic_arrow_left_grey.svg';
import iconNextWhite from '../../../../assets/img/register/ic_next_white.svg';

interface Props {
  disabled?: boolean;
  disableBack?: boolean;
  disableContinue?: boolean;
  step?: number;
  onClickBack?: () => void;
  onClickContinue?: () => void;
}

const GroupButton: FC<Props> = (props) => {
  const { disabled, step, onClickContinue, onClickBack, disableBack, disableContinue } = props;
  const { query, replace, pathname, asPath } = useRouter();
  const { currentWidthScreen } = useScreenDetect();

  const onBack = useCallback(() => {
    switch (step) {
      case 5:
        replace({
          pathname,
          query: {
            ...query,
            step: String(query?.t) === TypeFinderBike.Kids ? 2 : 4,
          },
        });
        break;

      default:
        replace({
          pathname,
          query: {
            ...query,
            step: step - 1,
          },
        });
        break;
    }
  }, [pathname, query, replace, step]);

  const showNeedHelp = useMemo(() => {
    return (
      <div className={classes.helper}>
        Need help?{' '}
        <Link
          scroll={false}
          href={{
            pathname,
            query: { contact: true, backOnClose: true, redirectUrl: asPath, ...query },
          }}
          as={'/contact'}>
          <a>Get in touch.</a>
        </Link>
      </div>
    );
  }, [asPath, pathname, query]);

  return (
    <>
      {currentWidthScreen < 768 && showNeedHelp}
      <div className={cx(classes.wrapButton, classes.wrapButtonfixed)}>
        {currentWidthScreen > 767 && showNeedHelp}
        <Button
          buttonType="outline"
          className={cx(classes.btnBack, classes.btnChangeStep)}
          onClick={onBack || onClickBack}
          disabled={disableBack}>
          <img src={icArrowLeftGrey} alt="icon_next" className="mr-4" />
          Back
        </Button>
        <Button type="submit" className={classes.btnChangeStep} disabled={disableContinue} onClick={onClickContinue}>
          Continue
          <img src={iconNextWhite} alt="icon_next" className="ml-4" />
        </Button>
      </div>
      <div className={classes.wrapButtonSupportFixed} />
    </>
  );
};

export default memo(GroupButton);
