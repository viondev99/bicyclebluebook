import React, { FC, ReactElement, useState } from 'react';
import cx from 'classnames';
import images from 'assets/images';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import { ListingReturnModel } from 'model/api/account/personal/listings.model';
import classes from './custom-menu.module.scss';
import Dropdown from '../Dropdown/Dropdown';
import MenuDropdown from '../Dropdown/MenuDropdown';

interface Props {
  listMenu: ReactElement;
  classMenuContent?: string;
  icon?: string;
  catchStatusMenu?: (status: boolean) => void;
  onCheckShipping?: () => void;
  className?: string;
  buttonClassName?: string;
  dropDownContentProps?: string;
}

const MenuCustom: FC<Props> = ({
  listMenu,
  icon = '',
  classMenuContent,
  catchStatusMenu,
  onCheckShipping,
  className,
  buttonClassName,
  dropDownContentProps,
}) => {
  const [status, changeStatus] = useState<boolean>(false);
  return (
    <Dropdown
      className={cx('d-flex', className)}
      renderToggle={({ toggle }) => (
        <ImageButton
          className={cx(classes.customIcon, buttonClassName)}
          onClick={() => {
            toggle();
            if (onCheckShipping) {
              onCheckShipping();
            }
            if (catchStatusMenu) catchStatusMenu(!status);
            changeStatus(!status);
          }}>
          <img src={icon || images.account.personal.icMore} alt="icon more" />
        </ImageButton>
      )}
      renderMenu={({ hide }) => {
        return (
          <MenuDropdown className={cx(classMenuContent, classes.dropDownContent, dropDownContentProps)} onClose={hide}>
            {listMenu}
          </MenuDropdown>
        );
      }}
    />
  );
};

export default MenuCustom;
