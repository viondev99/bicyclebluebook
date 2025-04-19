import React, { FC, useCallback, useState } from 'react';
import MenuDropdown from '@ui/Dropdown/MenuDropdown';
import Dropdown from '@ui/Dropdown/Dropdown';
import iconDropdown from 'assets/img/header/ic_dropdown.svg';
import Button from '@ui/Buttons/Primary/Button';
import router, { useRouter } from 'next/router';
import { ReturnManageOptions } from 'constants/listing';
import cx from 'classnames';
import classes from './listing.module.scss';

const MenuFilterStatus: FC = () => {
  const { query, pathname } = useRouter();
  const [status, setStatus] = useState<string>('Status');
  const handleFilter = useCallback(
    (item: { label: string; value: string }) => {
      setStatus(item?.label);
      router.replace({
        pathname,
        query: {
          ...query,
          returnStatus: item?.value,
          page: 1,
        },
      });
    },
    [pathname, query],
  );

  return (
    <Dropdown
      className={cx('d-flex', classes.menuFilter)}
      style={{ position: 'relative' }}
      renderToggle={({ toggle }) => (
        <>
          <div className={classes.statusName}>{status}</div>
          <Button buttonType={'transparent'} className={classes.btnSortOffer} onClick={toggle}>
            <img src={iconDropdown} alt="icon sort" className={classes.icSortOffer} />
          </Button>
        </>
      )}
      renderMenu={({ hide }) => (
        <MenuDropdown className={classes.menuDropDown} onClose={hide}>
          {ReturnManageOptions?.map((item) => {
            return (
              <MenuDropdown.Item onClick={() => handleFilter(item)} key={item.label}>
                {item.label}
              </MenuDropdown.Item>
            );
          })}
        </MenuDropdown>
      )}
    />
  );
};

export default MenuFilterStatus;
