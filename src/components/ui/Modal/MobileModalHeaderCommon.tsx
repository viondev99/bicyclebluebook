import React, { FC, ReactElement } from 'react';
import cx from 'classnames';
import useScreenDetect from 'hooks/useScreenDetect';
import classes from './mobile-modal-header.module.scss';
import Button from '../Buttons/Primary/Button';

import iconClose from '../../../assets/img/modal/ic_close.svg';
import icBack from '../../../assets/img/common/ic_back.component.svg';

const IconBack = icBack;

interface Props {
  onClose?: () => void;
  renderCenter?: ReactElement;
  renderRight?: ReactElement;
  className?: string;
  isVGCondition?: boolean;
}

const MobileModalHeader: FC<Props> = ({ onClose, renderCenter, renderRight, className, isVGCondition }) => {
  const { currentWidthScreen } = useScreenDetect();

  return (
    <div
      className={cx(classes.headerContainer, {
        [className]: !!className,
      })}>
      {isVGCondition && !(currentWidthScreen < 768) ? (
        <Button buttonType={'transparent'} onClick={onClose}>
          <img className={'close_icon'} src={iconClose} alt="Close icon" style={{ marginBottom: '16px' }} />
        </Button>
      ) : (
        <Button buttonType={'transparent'} onClick={onClose}>
          <IconBack style={{ width: 30 }} />
        </Button>
      )}
      {renderCenter}
      {renderRight}
    </div>
  );
};

export default MobileModalHeader;
