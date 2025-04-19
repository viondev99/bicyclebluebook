import React, { FC, ReactElement, useCallback, useState } from 'react';
import Collapse from 'reactstrap/lib/Collapse';
import cx from 'classnames';
import Card from '@ui/Cards';
import classes from './filter-panel.module.scss';

import icDropDown from '../../../../assets/img/common/ic_dropdown.svg';

interface Props {
  title: string;
  open?: boolean;
  overflow?: boolean;
  headerCollapse?: ReactElement;
}

const FilterPanel: FC<Props> = ({ open: initOpen, title, children, overflow = true, headerCollapse = true }) => {
  const [open, setOpen] = useState(initOpen);

  const toggle = useCallback(() => {
    setOpen((p) => !p);
  }, []);

  return (
    <Card className={classes.filterWrapper}>
      <button className={cx('d-flex', classes.toggleButton)} onClick={toggle} type={'button'}>
        <div className={cx(classes.title)}>{title}</div>
        <img src={icDropDown} alt={'dropdown'} className={cx({ [classes.rotate]: open })} width={14} height={7} />
      </button>
      <Collapse isOpen={open}>
        <div className={cx(classes.panelContent)}>
          <div className={classes.headerCollapse}>{headerCollapse}</div>
          <div
            className={cx(classes.panelChild, {
              [classes.overflow]: overflow,
            })}>
            {children}
          </div>
        </div>
      </Collapse>
    </Card>
  );
};

export default FilterPanel;
