import React, { FC, useMemo, useCallback } from 'react';
import MenuDropdown from '@ui/Dropdown/MenuDropdown';
import Dropdown from '@ui/Dropdown/Dropdown';
import images from 'assets/images';
import Button from '@ui/Buttons/Primary/Button';
import { getListSortTypes } from 'helpers/constraint.helper';
import { SEARCH_TYPE } from 'constants/marketplace';
import router, { useRouter } from 'next/router';
import { StageInventory } from 'model/store/common.model';
import classes from './listing.module.scss';

const MenuSort: FC = () => {
  const { query, replace, pathname } = useRouter();

  const ListFilterSortTypes = useMemo(() => {
    return getListSortTypes(`${query?.statuses}`).filter((it) => it.listShow.includes(`${query?.statuses}`));
  }, [query]);

  const handleSort = useCallback(
    (sortField: string, sortType: string, sort?: string) => {
      switch (query?.statuses) {
        case StageInventory.CustomerReturned:
          router.replace({
            pathname,
            query: {
              ...query,
              [SEARCH_TYPE.sort]: sort,
            },
          });
          break;
        case StageInventory.Cancelled:
          router.replace({
            pathname,
            query: {
              ...query,
              [SEARCH_TYPE.sort]: sort,
            },
          });
          break;

        default:
          router.replace({
            pathname,
            query: {
              ...query,
              [SEARCH_TYPE.sortField]: sortField,
              [SEARCH_TYPE.sortType]: sortType,
            },
          });
          break;
      }
    },
    [pathname, query],
  );

  return (
    <>
      {ListFilterSortTypes?.length ? (
        <Dropdown
          className={'d-flex'}
          style={{ position: 'relative' }}
          renderToggle={({ toggle }) => (
            <Button buttonType={'transparent'} className={classes.btnSortOffer} onClick={toggle}>
              <img src={images.iconSort} alt="icon sort" className={classes.icSortOffer} />
            </Button>
          )}
          renderMenu={({ hide }) => (
            <MenuDropdown className={classes.menuDropDown} onClose={hide}>
              {ListFilterSortTypes?.map((item) => {
                return (
                  <MenuDropdown.Item
                    onClick={() => handleSort(item.valueSortField, item.valueSortType, item.sort)}
                    key={item.label}>
                    {item.label}
                  </MenuDropdown.Item>
                );
              })}
            </MenuDropdown>
          )}
        />
      ) : null}
    </>
  );
};

export default MenuSort;
