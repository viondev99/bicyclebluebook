import Input from '@ui/Inputs/Input';
import cx from 'classnames';
import CONFIG from 'config';
import { SEARCH_TYPE } from 'constants/marketplace';
import { Roles } from 'constants/roles';
import { consistentArray } from 'helpers/common.helper';
import { FILTER_CONDITION_OPTIONS } from 'helpers/constraint.helper';
import { BBB_STAFF, currentPathnameWithoutQuery, formatCurrency, ONLINE_STORE, PERSONAL } from 'helpers/string.helper';
import { ItemLabelValue, sortFilterBrand } from 'helpers/utilities.helper';
import useMarketplaceFilter from 'hocs/marketplace/useMarketplaceFilter';
import omit from 'lodash/omit';
import { OptionsModel } from 'model/store/common.model';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import React, { FC, useCallback, useMemo, useState } from 'react';
import FilterCheckboxes from '../FilterPanel/FilterCheckBox/FilterCheckboxes';
import FilterMap from '../FilterPanel/FilterMap/FilterMap';
import FilterPanel from '../FilterPanel/FilterPanel';
import FilterRadio from '../FilterPanel/FilterRadio/FilterRadio';
import FilterRange from '../FilterPanel/FilterRange/FilterRange';
import FilterSelectBox from '../FilterPanel/FilterSelectBox/FilterBoxSelect';
import classes from './filter.module.scss';
import Wishlist from './Wishlist';

import icCloseCircle from '../../../../assets/img/common/ic_close_circle.svg';

const MAX_PRICE = 9999;
const priceRange: [number, number] = [0, MAX_PRICE];

const MAX_YEAR = new Date().getFullYear() + 1;
const yearRange: [number, number] = [1990, MAX_YEAR];

export const listSellerOptions: OptionsModel[] = [
  { value: 'ALL', label: 'All' },
  { value: PERSONAL, label: 'Private Seller' },
  { value: ONLINE_STORE, label: 'Store' },
  { value: BBB_STAFF, label: 'BBB Direct' },
];

export const listListingTypesOptions: OptionsModel[] = [
  { label: 'Bike', value: 'BIKE' },
  { label: 'Part & Accessories', value: 'PART_ACCESSORIES' },
];

interface Props {
  isViewSales?: boolean;
  onRestart?: () => void;
  onCloseFilter?: () => void;
}

const LeftFilter: FC<Props> = ({ isViewSales, onRestart, onCloseFilter }) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchFamily, setSearchFamily] = useState<string>('');
  const [searchValueModel, setSearchValueModel] = useState<string>('');
  const { query, pathname, asPath } = useRouter();
  const router = useRouter();

  const isHotBike = useMemo(() => {
    switch (pathname?.includes('online-store')) {
      case true:
        return false;

      default:
        return (
          query?.id === 'road-bikes' ||
          query?.id === 'mountain-bikes' ||
          query?.id === 'hybrid-bikes' ||
          query?.id === 'kids-bikes' ||
          query?.id === 'e-bikes'
        );
    }
  }, [pathname, query]);

  const queryParams = useMemo(() => {
    return omit(query, ['sellerId', 'storeId']);
  }, [query]);
  const {
    storeName,
    listStoreFronts,
    modelList,
    frameMaterialName,
    gender,
    suspension,
    model,
    brand,
    family,
    typeName,
    brakeTypeName,
    condition,
    wheelSize,
    sizeName,
    familyList,
    location,
    parsedQuery,
    listFilter,
    sellType,
    listingTypes,
  } = useMarketplaceFilter();

  const startPrice = parsedQuery[SEARCH_TYPE.startPrice] || '0';
  const endPrice = parsedQuery[SEARCH_TYPE.endPrice] || MAX_PRICE;
  const startYear = parsedQuery[SEARCH_TYPE.startYear] || '1990';
  const endYear = parsedQuery[SEARCH_TYPE.endYear] || MAX_YEAR;

  const priceValue = useMemo<[number, number]>(() => {
    return [+startPrice.toString(), +endPrice.toString()];
  }, [startPrice, endPrice]);
  const yearValue = useMemo<[number, number]>(() => {
    return [+startYear.toString(), +endYear.toString()];
  }, [startYear, endYear]);

  const isStoreOrSellerPage = query.sellerId || query.storeId;

  const handleSearch = useCallback(
    (newQuery: string | ParsedUrlQueryInput | any) => {
      const typeOfBike = newQuery?.[SEARCH_TYPE.typeName];
      if (!typeOfBike || !!isStoreOrSellerPage) {
        if (pathname?.includes('coming-soon')) {
          router.push(
            {
              pathname,
              query: {
                ...newQuery,
                isComingSoon: true,
                page: 1,
              },
            },
            {
              pathname: currentPathnameWithoutQuery(asPath),
              query: { ...newQuery, isComingSoon: true, page: 1 },
            },
          );
        } else
          router.push(
            {
              pathname,
              query: newQuery,
            },
            {
              pathname: currentPathnameWithoutQuery(asPath),
              query: newQuery,
            },
          );
      } else if (typeOfBike && newQuery?.sell_type) {
        router.push(
          {
            pathname: pathname?.includes('coming-soon') ? '/marketplace/coming-soon' : '/marketplace/buy-now',
            query: newQuery,
          },
          {
            pathname: currentPathnameWithoutQuery(
              pathname?.includes('coming-soon') ? '/marketplace/coming-soon' : '/marketplace/buy-now',
            ),
            query: newQuery,
          },
        );
      } else {
        switch (typeOfBike) {
          case 'Road':
            router.push({
              pathname: `/marketplace/buy-now/road-bikes`,
              query: newQuery,
            });
            break;

          case 'Mountain':
            router.push({
              pathname: `/marketplace/buy-now/mountain-bikes`,
              query: newQuery,
            });
            break;

          case 'Hybrid':
            router.push({
              pathname: `/marketplace/buy-now/hybrid-bikes`,
              query: newQuery,
            });
            break;

          case 'E-Bike':
            router.push({
              pathname: `/marketplace/buy-now/e-bikes`,
              query: newQuery,
            });
            break;

          case 'Kids':
            router.push({
              pathname: `/marketplace/buy-now/kids-bikes`,
              query: newQuery,
            });
            break;

          default:
            router.push(
              {
                pathname,
                query: newQuery,
              },
              {
                pathname: currentPathnameWithoutQuery(asPath),
                query: newQuery,
              },
            );
            break;
        }
      }
    },
    [asPath, isStoreOrSellerPage, pathname, router],
  );

  const handleChangePrice = useCallback(
    ([start, end]) => {
      handleSearch({
        ...queryParams,
        [SEARCH_TYPE.startPrice]: start,
        [SEARCH_TYPE.endPrice]: end,
        page: 1,
      });
    },
    [handleSearch, queryParams],
  );
  const handleChangeYear = useCallback(
    ([start, end]) => {
      handleSearch({
        ...queryParams,
        [SEARCH_TYPE.startYear]: start,
        [SEARCH_TYPE.endYear]: end,
        page: 1,
      });
    },
    [handleSearch, queryParams],
  );

  const gotoHotBikeDetail = useCallback(
    (hotBikeValue: string) => {
      switch (hotBikeValue) {
        case 'Mountain': {
          router.push(`/marketplace/buy-now/mountain-bikes`);
          break;
        }
        case 'Road': {
          router.push(`/marketplace/buy-now/road-bikes`);
          break;
        }
        case 'Hybrid': {
          router.push(`/marketplace/buy-now/hybrid-bikes`);
          break;
        }
        case 'E-Bike': {
          router.push(`/marketplace/buy-now/e-bikes`);
          break;
        }
        case 'Kids': {
          router.push(`/marketplace/buy-now/kids-bikes`);
          break;
        }
        default:
          break;
      }
    },
    [router],
  );

  const onChangeParam = (name: string) => (value: string[] | string) => {
    let newValue: string;
    // handle if exist query.id && type === hot bike
    // if (name === 't' && value?.length && listHotBike.includes(value[value?.length - 1])) {
    //   gotoHotBikeDetail(value[value?.length - 1]);
    //   return;
    // }
    // handle if change seller type === BBB_STAFF
    // handle if change seller type !== ONLINE STORE

    if (parsedQuery?.sn?.length && name === SEARCH_TYPE.sellerType && value !== ONLINE_STORE) {
      delete parsedQuery.sn;
    }
    if (name === SEARCH_TYPE.sellerType) {
      if (value === BBB_STAFF) {
        router.push({
          pathname: `/marketplace/online-store/${CONFIG.BBB_STAFF[0]}`,
          query: {
            ...query,
            sell_type: value,
          },
        });
        return;
      }
      if (value !== ONLINE_STORE) {
        router.push({
          pathname: pathname?.includes('coming-soon') ? '/marketplace/coming-soon' : '/marketplace/buy-now',
          query: {
            ...query,
            storeId: null,
            sn: null,
            sell_type: value,
          },
        });
        return;
      }
      return router.push({
        pathname: pathname?.includes('coming-soon') ? '/marketplace/coming-soon' : '/marketplace/buy-now',
        query: {
          ...query,
          storeId: null,
          sell_type: value,
        },
      });
    }

    if (name === 'b' && value?.length === 0) {
      delete parsedQuery.fm;
      delete parsedQuery.m;
    }

    if (consistentArray(value).length === 0) {
      const newQuery = omit(parsedQuery, name, 'id');
      handleSearch(newQuery);
    } else {
      newValue = consistentArray(value).join(',');
      const newQuery = {
        ...omit(parsedQuery, 'id'),
        [name]: newValue,
        page: 1,
      };
      handleSearch(newQuery);
    }
  };

  const listBikeType = useMemo(() => {
    return listFilter.type ? listFilter.type.map((i) => ({ value: i.name, label: i.name })) : [];
  }, [listFilter.type]);
  const listBikeBrands: ItemLabelValue[] = useMemo(() => {
    return listFilter.allBrandBicycle ? sortFilterBrand(listFilter.allBrandBicycle) : [];
  }, [listFilter.allBrandBicycle]);
  const brandWithFiltered: ItemLabelValue[] = useMemo(
    () =>
      listBikeBrands.filter((option: ItemLabelValue) => option.label.toLowerCase().includes(searchValue.toLowerCase())),
    [listBikeBrands, searchValue],
  );
  const listFrameSizes = useMemo(() => {
    return listFilter.sizeInv ? listFilter.sizeInv.map((i) => ({ value: i.name, label: i.name })) : [];
  }, [listFilter.sizeInv]);
  const listWheelSize = useMemo(() => {
    return listFilter.wheelSize ? listFilter.wheelSize.map((i) => ({ value: i.name, label: i.name })) : [];
  }, [listFilter.wheelSize]);
  const listStoreFrontOptions = useMemo(() => {
    return listStoreFronts?.length > 0
      ? listStoreFronts.map((i) => ({
          value: i.name,
          label: i.name,
        }))
      : [];
  }, [listStoreFronts]);

  const listFamily = useMemo(() => {
    return familyList.map((i) => ({
      value: `${i.brandIds.join('++')}__${i.familyName}`,
      label: i.familyName,
    }));
  }, [familyList]);

  const familyByFiltered: ItemLabelValue[] = useMemo(() => {
    return listFamily?.filter((item: ItemLabelValue) =>
      item?.label?.toLowerCase().includes(searchFamily.toLowerCase()),
    );
  }, [listFamily, searchFamily]);

  const listModel = useMemo(() => {
    return modelList.map((i) => ({
      value: String(i.id),
      label: i.name,
    }));
  }, [modelList]);

  const listModelFilter: ItemLabelValue[] = useMemo(() => {
    return listModel.filter((option: ItemLabelValue) =>
      option.label.toLowerCase().includes(searchValueModel.toLowerCase()),
    );
  }, [listModel, searchValueModel]);

  const listSuspension = useMemo(() => {
    return listFilter.suspension
      ? listFilter.suspension.map((item) => ({
          value: item.name,
          label: item.name,
        }))
      : [];
  }, [listFilter.suspension]);
  const listGender = useMemo(() => {
    return listFilter.gender
      ? listFilter.gender.map((item) => ({
          value: item.name,
          label: item.name,
        }))
      : [];
  }, [listFilter.gender]);
  // const listCondition = useMemo(() => {
  //   return listFilter.condition
  //     ? listFilter.condition.map((item) => ({
  //         value: item.condition,
  //         label: normalizeServerConstant(item.condition),
  //       }))
  //     : [];
  // }, [listFilter.condition]);
  const listCondition = useMemo(() => {
    return FILTER_CONDITION_OPTIONS;
  }, []);
  const listFrameMaterial = useMemo(() => {
    return listFilter.frameMaterial
      ? listFilter.frameMaterial.map((item) => ({
          value: item.name,
          label: item.name,
        }))
      : [];
  }, [listFilter.frameMaterial]);
  const listBrakeType = useMemo(() => {
    return listFilter.brakeType
      ? listFilter.brakeType.map((item) => ({
          value: item.name,
          label: item.name,
        }))
      : [];
  }, [listFilter.brakeType]);

  const renderPathname = useMemo(() => {
    if (asPath.includes(`/marketplace/online-store`)) {
      return `/marketplace/online-store/${query?.storeId}?sell_type=BBB`;
    }
    if (asPath.includes(`/marketplace/seller`)) {
      return `/marketplace/seller/${query?.sellerId}`;
    }
    if (asPath.includes(`/marketplace/buy-now/`)) {
      return `/marketplace/buy-now/`;
    }
    if (asPath.includes(`/marketplace/coming-soon`)) {
      return `/marketplace/coming-soon/?isComingSoon=true&page=1`;
    }
    return pathname;
  }, [asPath, pathname, query]);

  const noFilter = useMemo(() => {
    return (
      typeName.length === 0 &&
      !sellType &&
      listingTypes.length === 0 &&
      sizeName.length === 0 &&
      wheelSize.length === 0 &&
      !(priceValue[0] !== priceRange[0] || priceValue[1] !== priceRange[1]) &&
      brand.length === 0 &&
      family.length === 0 &&
      model.length === 0 &&
      gender.length === 0 &&
      condition.length === 0 &&
      !(yearValue[0] !== yearRange[0] || yearValue[1] !== yearRange[1]) &&
      frameMaterialName.length === 0 &&
      !location[0] &&
      brakeTypeName.length === 0 &&
      !isHotBike
    );
  }, [
    typeName.length,
    sellType,
    listingTypes.length,
    sizeName.length,
    wheelSize.length,
    priceValue,
    brand.length,
    family.length,
    model.length,
    gender.length,
    condition.length,
    yearValue,
    frameMaterialName.length,
    location,
    brakeTypeName.length,
    isHotBike,
  ]);
  return (
    <div style={{ marginBottom: 20 }}>
      <div className={cx('d-none', 'd-lg-block')}>
        <Wishlist disabled={noFilter} isHotBike={isHotBike} />
      </div>
      {
        <FilterPanel title={'Seller Type'} open={sellType.length > 0}>
          <FilterRadio options={listSellerOptions} value={sellType} onChange={onChangeParam(SEARCH_TYPE.sellerType)} />
        </FilterPanel>
      }
      {sellType === Roles.ONLINE_STORE.toUpperCase() ? (
        <FilterPanel title={'Store Name'} open={listStoreFrontOptions.length > 0}>
          <FilterCheckboxes
            options={listStoreFrontOptions}
            values={storeName || []}
            onChange={onChangeParam(SEARCH_TYPE.storeName)}
          />
        </FilterPanel>
      ) : null}
      <FilterPanel title={'Category'} open={listingTypes.length > 0}>
        <FilterCheckboxes
          options={listListingTypesOptions}
          values={listingTypes}
          onChange={onChangeParam(SEARCH_TYPE.listingTypes)}
        />
      </FilterPanel>
      {!isHotBike && (
        <FilterPanel title={'Type of Bike'} open={typeName.length > 0}>
          <FilterCheckboxes options={listBikeType} values={typeName} onChange={onChangeParam(SEARCH_TYPE.typeName)} />
        </FilterPanel>
      )}
      <FilterPanel
        open={brand.length > 0}
        title={'Brand'}
        headerCollapse={
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={'Search'}
            inputSize={'s'}
            style={{ marginBottom: 20 }}
          />
        }>
        <FilterCheckboxes options={brandWithFiltered} values={brand} onChange={onChangeParam(SEARCH_TYPE.brand)} />
      </FilterPanel>
      <FilterPanel
        open={family.length > 0}
        title={'Family'}
        headerCollapse={
          <>
            {brand.length > 0 && (
              <Input
                value={searchFamily}
                onChange={(e) => setSearchFamily(e.target.value)}
                placeholder={'Search'}
                inputSize={'s'}
                style={{ marginBottom: 20 }}
              />
            )}
          </>
        }>
        <FilterCheckboxes options={familyByFiltered} values={family} onChange={onChangeParam(SEARCH_TYPE.family)} />
      </FilterPanel>
      <FilterPanel
        title={'Model'}
        open={model.length > 0}
        headerCollapse={
          listModel?.length > 0 && (
            <Input
              value={searchValueModel}
              onChange={(e) => setSearchValueModel(e.target.value)}
              placeholder={'Search'}
              inputSize={'s'}
              style={{ marginBottom: 20 }}
            />
          )
        }>
        <FilterCheckboxes options={listModelFilter} values={model} onChange={onChangeParam(SEARCH_TYPE.model)} />
      </FilterPanel>
      <FilterPanel title={'Year'} open={yearValue[0] !== yearRange[0] || yearValue[1] !== yearRange[1]}>
        <FilterRange range={yearRange} value={yearValue} onChange={handleChangeYear} />
      </FilterPanel>
      <FilterPanel
        title={'Price'}
        overflow={false}
        open={priceValue[0] !== priceRange[0] || priceValue[1] !== priceRange[1]}>
        <FilterRange
          range={priceRange}
          value={priceValue}
          onChange={handleChangePrice}
          formatDisplayValue={formatCurrency}
        />
      </FilterPanel>
      <FilterPanel title={'Condition'} open={condition.length > 0}>
        <FilterCheckboxes options={listCondition} values={condition} onChange={onChangeParam(SEARCH_TYPE.condition)} />
      </FilterPanel>
      <FilterPanel title={'Location'} overflow={false} open={!!location[0]}>
        <FilterMap
          initDistance={location[3]}
          initZip={location[2]}
          onSearch={(value) => {
            onChangeParam(SEARCH_TYPE.location)([String(value.lat), String(value.lng), value.zip, value.distance]);
            onCloseFilter();
          }}
        />
      </FilterPanel>
      <FilterPanel title={'Gender'} open={gender.length > 0}>
        <FilterCheckboxes options={listGender} values={gender} onChange={onChangeParam(SEARCH_TYPE.gender)} />
      </FilterPanel>
      <FilterPanel title={'Frame Size'} open={sizeName.length > 0}>
        <FilterCheckboxes options={listFrameSizes} values={sizeName} onChange={onChangeParam(SEARCH_TYPE.sizeName)} />
      </FilterPanel>
      <FilterPanel title={'Wheel Size'} open={wheelSize.length > 0} overflow={false}>
        <FilterSelectBox options={listWheelSize} values={wheelSize} onChange={onChangeParam(SEARCH_TYPE.wheelSize)} />
      </FilterPanel>
      <FilterPanel title={'Suspension'} open={suspension.length > 0}>
        <FilterCheckboxes
          options={listSuspension}
          values={suspension}
          onChange={onChangeParam(SEARCH_TYPE.suspension)}
        />
      </FilterPanel>
      <FilterPanel title={'Frame Material'} open={frameMaterialName.length > 0}>
        <FilterCheckboxes
          options={listFrameMaterial}
          values={frameMaterialName}
          onChange={onChangeParam(SEARCH_TYPE.frameMaterialName)}
        />
      </FilterPanel>
      <FilterPanel title={'Brake Type'} open={brakeTypeName.length > 0}>
        <FilterCheckboxes
          options={listBrakeType}
          values={brakeTypeName}
          onChange={onChangeParam(SEARCH_TYPE.brakeTypeName)}
        />
      </FilterPanel>
      {/* <FilterPanel title={'Family'} open={family.length > 0}>
        <FilterCheckboxes options={listFamily} values={family} onChange={onChangeParam(SEARCH_TYPE.family)} />
      </FilterPanel> */}
      {/* <FilterPanel title={'Condition'} open={condition.length > 0}>
        <FilterCheckboxes options={listCondition} values={condition} onChange={onChangeParam(SEARCH_TYPE.condition)} />
      </FilterPanel> */}
      <Link scroll={false} shallow={true} replace={true} href={renderPathname}>
        <a onClick={onRestart} className={cx(classes.clearAllButton, 'd-none', 'd-lg-block')} type="button">
          <img src={icCloseCircle} alt={'close'} className={'icon-button'} />
          Remove all filters
        </a>
      </Link>
      <div className={cx('d-block', 'd-lg-none')}>
        <Wishlist disabled={noFilter} isHotBike={isHotBike} />
      </div>
    </div>
  );
};

export default LeftFilter;
