import React, { FC, memo, ReactElement, useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import Link, { LinkProps } from 'next/link';
import classes from './header.module.scss';
import { MenuModel } from '../../../model/common';
import SubMenuMobile from './SubMenuMobile';
import SubmenuWrapper from './SubmenuWrapper';

interface Props extends Partial<MenuModel> {
  linkProps?: LinkProps;
  renderPrefix?: ReactElement;
  renderSuffix?: ReactElement;
  onToggleSubmenu?: (a: { open: boolean; onClose: () => void }) => void;
}

const MenuItem: FC<Props & React.ButtonHTMLAttributes<HTMLLIElement>> = ({
  linkProps,
  name,
  className,
  subMenu,
  onClick,
  onToggleSubmenu,
  renderSuffix,
}) => {
  const [openSubMenu, setOpenSubMenu] = useState(false);

  const onOpenSubmenu = useCallback(() => {
    setOpenSubMenu(true);
  }, []);

  useEffect(() => {
    onToggleSubmenu && onToggleSubmenu({ open: openSubMenu, onClose: () => setOpenSubMenu(false) });
  }, [onToggleSubmenu, openSubMenu]);

  const renderChild = () => {
    if (linkProps) {
      return (
        <Link {...linkProps}>
          <a>{name}</a>
        </Link>
      );
    }
    if (subMenu) {
      return (
        <Button buttonType="clear" className={classes.customBtn} onClick={onOpenSubmenu}>
          {name}
        </Button>
      );
    }
    return (
      <Button buttonType="clear" className={classes.customBtn} onClick={onClick}>
        {name}
      </Button>
    );
  };

  return (
    <>
      <li className={cx(classes.menuTopItem, classes.wrapBtn, className)}>
        {renderChild()}
        {renderSuffix}
      </li>
      {subMenu && (
        <SubmenuWrapper open={openSubMenu}>
          <SubMenuMobile menu={subMenu} />
        </SubmenuWrapper>
      )}
    </>
  );
};

export default memo(MenuItem);
