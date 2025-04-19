import React, { FC, useMemo, useCallback, useEffect, useState } from 'react';
import Card from '@ui/Cards';
import MenuDropdown from '@ui/Dropdown/MenuDropdown';
import Dropdown from '@ui/Dropdown/Dropdown';
import iconSort from 'assets/img/header/ic_sort.svg';
import Button from '@ui/Buttons/Primary/Button';
import { SORT_TYPE_PERSONAL } from 'helpers/constraint.helper';
import { SEARCH_TYPE, StatusMarketListing } from 'constants/marketplace';
import router, { useRouter } from 'next/router';
import { StageInventory } from 'model/store/common.model';
import { ListingsModel } from 'model/store/account/personal/listings.model';
import classes from './cart-sort-bar.module.scss';

interface Props {
  handleChangeParamsWhenClickSort?: (data: HandleChangeParamsWhenClickSort) => void;
}

export interface HandleChangeParamsWhenClickSort {
  sortField: string;
  sortType: string;
}

const ButtonSortBar: FC<Props> = ({ handleChangeParamsWhenClickSort }) => {
  const { query, replace, pathname } = useRouter();

  const ListFilterSortTypes = useMemo(() => {
    return SORT_TYPE_PERSONAL.filter((it) => it.listShow.includes(`${query?.statuses}`));
  }, [query]);

  const handleSort = useCallback(
    (sortField: string, sortType: string, sort?: string) => {
      if (query?.statuses === StageInventory.CustomerReturned || query?.statuses === StageInventory.Cancelled) {
        router.replace({
          pathname,
          query: {
            ...query,
            [SEARCH_TYPE.sort]: sort,
          },
        });
      } else {
        router.replace({
          pathname,
          query: {
            ...query,
            [SEARCH_TYPE.sortField]: sortField,
            [SEARCH_TYPE.sortType]: sortType,
          },
        });
      }

      handleChangeParamsWhenClickSort({
        sortField,
        sortType,
      });
    },
    [handleChangeParamsWhenClickSort, pathname, query],
  );

  return (
    <Card className={classes.cardSearchBar}>
      <Dropdown
        className={'d-flex'}
        style={{ position: 'relative' }}
        renderToggle={({ toggle }) => (
          <Button buttonType={'transparent'} className={classes.btnSortOffer} onClick={toggle}>
            <img src={iconSort} alt="icon sort" className={classes.icSortOffer} />
          </Button>
        )}
        renderMenu={({ hide }) => (
          <MenuDropdown className={classes.menuDropDown} onClose={hide}>
            {ListFilterSortTypes?.map((item) => {
              return (
                <MenuDropdown.Item onClick={() => handleSort(item.valueSortField, item.valueSortType)} key={item.label}>
                  {item.label}
                </MenuDropdown.Item>
              );
            })}
          </MenuDropdown>
        )}
      />
    </Card>
  );
};

export default ButtonSortBar;
