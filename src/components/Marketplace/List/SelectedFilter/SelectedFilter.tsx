import React, { FC, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import omit from 'lodash/omit';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Link from 'next/link';
import {
  familyParamsToFamilyName,
  normalizeServerConstant,
  formatCurrency,
  currentPathnameWithoutQuery,
} from 'helpers/string.helper';
import marketplaceActions from 'store/marketplace/marketplace.action';
import { SEARCH_TYPE } from 'constants/marketplace';
import { useListCommonComponent } from 'hooks/useListCommonComponent';
import { CommonComponents } from 'model/store/common.model';
import { consistentArray } from 'helpers/common.helper';
import useMarketplaceFilter from 'hocs/marketplace/useMarketplaceFilter';
import { useDispatch } from 'react-redux';
import Selected from './Selected';
import { listListingTypesOptions, listSellerOptions } from '../LeftFilter/LeftFilter';
import classes from './selected.module.scss';

const components = [
  CommonComponents.Condition,
  CommonComponents.AllBrandBicycle,
  CommonComponents.AllYearBicycle,
  CommonComponents.AllSizeInventory,
  CommonComponents.AllFrameMaterialInventory,
  CommonComponents.AllBrakeTypeInventory,
  CommonComponents.BicycleType,
  CommonComponents.AllSuspension,
  CommonComponents.AllGender,
  CommonComponents.AllWheelSize,
];

interface Props {
  onRestart?: () => void;
}

const SelectedFilter: FC<Props> = ({ onRestart }) => {
  const { pathname, asPath, push, query } = useRouter();
  const dispatch = useDispatch();
  const {
    listingTypes,
    storeName,
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
    location,
    endYear,
    startYear,
    endPrice,
    startPrice,
    parsedQuery,
    priceRanges,
    sellType,
  } = useMarketplaceFilter();

  const locationValue = useMemo(() => {
    return location[3] ? `${location[3]} miles from ${location[2]}` : undefined;
  }, [location]);
  const priceValue = useMemo<string>(() => {
    if (!startPrice && !endPrice) {
      return '';
    }
    if (!startPrice) {
      return `Under ${endPrice}`;
    }
    if (!endPrice) {
      return `Over ${startPrice}`;
    }
    return [formatCurrency(+startPrice.toString()), formatCurrency(+endPrice.toString())].join(' - ');
  }, [startPrice, endPrice]);
  const priceRangeValue = useMemo(() => {
    return priceRanges.map((i) => {
      const [s, e] = i.split('-');
      if (!s && !e) {
        return { title: '', query: i };
      }
      if (!s || s === '0') {
        return { title: `Under ${e}`, query: i };
      }
      if (!e || e > '99999') {
        return { title: `Over ${s}`, query: i };
      }
      return { title: [formatCurrency(+s.toString()), formatCurrency(+e.toString())].join(' - '), query: i };
    });
  }, [priceRanges]);
  const yearValue = useMemo<string>(() => {
    if (!startYear && !endYear) {
      return '';
    }
    if (!startYear) {
      return `Under ${endYear}`;
    }
    if (!endYear) {
      return `Over ${startYear}`;
    }
    return [+startYear.toString(), +endYear.toString()].join(' - ');
  }, [startYear, endYear]);

  const listFilter = useListCommonComponent(components);

  const listBikeBrandsSelected = useMemo(() => {
    return listFilter.allBrandBicycle ? listFilter.allBrandBicycle.filter((i) => brand.includes(String(i.id))) : [];
  }, [brand, listFilter.allBrandBicycle]);
  const listFamilySelected = useMemo(() => {
    return family;
  }, [family]);
  const listModelSelected = useMemo(() => {
    return modelList.filter((i) => model.includes(String(i.id)));
  }, [modelList, model]);
  const handleSearch = useCallback(
    (newQuery: object | any) => {
      const typeOfBike = newQuery?.[SEARCH_TYPE.typeName];
      const sellTypes = newQuery?.[SEARCH_TYPE.sellerType];
      const brands = newQuery?.[SEARCH_TYPE.brand];
      let newQuerys = {
        ...newQuery,
      };
      if (pathname?.includes('coming-soon')) {
        newQuerys = {
          ...newQuerys,
          isComingSoon: true,
          page: 1,
        };
      }
      if (!sellTypes) {
        newQuerys = {
          ...newQuerys,
          sn: null,
        };
      }
      if (!brands) {
        newQuerys = {
          ...newQuerys,
          fm: null,
          m: null,
        };
      }
      if (!typeOfBike) {
        push(
          {
            pathname: pathname?.includes('coming-soon') ? '/marketplace/coming-soon' : '/marketplace/buy-now',
            query: omit(newQuerys, 'id'),
          },
          {
            pathname: currentPathnameWithoutQuery(
              pathname?.includes('coming-soon') ? '/marketplace/coming-soon' : '/marketplace/buy-now',
            ),
            query: omit(newQuerys, 'id'),
          },
        );
      } else {
        push(
          {
            pathname,
            query: omit(newQuerys, 'id'),
          },
          {
            pathname: currentPathnameWithoutQuery(asPath),
            query: omit(newQuerys, 'id'),
          },
        );
      }
    },
    [asPath, pathname, push],
  );
  const removeItemInFilterList = (name: string, value: string) => {
    const newValues = consistentArray(parsedQuery[name]).filter((i) => i !== value);
    if (newValues.length === 0) {
      removeFilterSingleValue(name);
    } else {
      dispatch(marketplaceActions.addFilter({ ...parsedQuery, [name]: newValues }));
      handleSearch({
        ...parsedQuery,
        [name]: newValues,
      });
    }
  };
  const removeFilterSingleValue = (...name: string[]) => {
    const newQuery = omit(parsedQuery, name);
    dispatch(marketplaceActions.addFilter(newQuery));
    handleSearch(newQuery);
  };
  const renderLabel = useCallback(
    (type: string, item?: string) => {
      switch (type) {
        case SEARCH_TYPE.sellerType: {
          const itemSeller = listSellerOptions.find((it) => it.value === sellType);
          return itemSeller?.label || '';
        }
        case SEARCH_TYPE.listingTypes: {
          const itemListingTypes = listListingTypesOptions.find((it) => it.value === item);
          return itemListingTypes?.label || '';
        }
      }
      return '';
    },
    [sellType],
  );
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
  const isShowBBBType = useMemo(() => {
    return sellType && sellType !== 'BBB';
  }, [sellType]);

  const hasFilter = useMemo(() => {
    return (
      typeName.length > 0 ||
      sizeName.length > 0 ||
      wheelSize.length > 0 ||
      priceValue ||
      listBikeBrandsSelected.length > 0 ||
      listFamilySelected.length > 0 ||
      listModelSelected.length > 0 ||
      suspension.length > 0 ||
      gender.length > 0 ||
      condition.length > 0 ||
      yearValue ||
      frameMaterialName.length > 0 ||
      locationValue ||
      brakeTypeName.length > 0 ||
      isShowBBBType ||
      listingTypes.length > 0
    );
  }, [
    brakeTypeName.length,
    condition.length,
    frameMaterialName.length,
    gender.length,
    isShowBBBType,
    listBikeBrandsSelected.length,
    listFamilySelected.length,
    listModelSelected.length,
    listingTypes.length,
    locationValue,
    priceValue,
    sizeName.length,
    suspension.length,
    typeName.length,
    wheelSize.length,
    yearValue,
  ]);
  if (!hasFilter) {
    return null;
  }
  return (
    <Row>
      <Col>
        <div className={classes.filterList}>
          {isShowBBBType
            ? [sellType].map((item) => (
                <Selected
                  label={renderLabel(SEARCH_TYPE.sellerType)}
                  onRemove={() => removeItemInFilterList(SEARCH_TYPE.sellerType, item)}
                  key={item}
                />
              ))
            : null}
          {typeName.map((item) => (
            <Selected label={item} onRemove={() => removeItemInFilterList(SEARCH_TYPE.typeName, item)} key={item} />
          ))}
          {sizeName.map((item) => (
            <Selected label={item} onRemove={() => removeItemInFilterList(SEARCH_TYPE.sizeName, item)} key={item} />
          ))}
          {wheelSize.map((item) => (
            <Selected label={item} onRemove={() => removeItemInFilterList(SEARCH_TYPE.wheelSize, item)} key={item} />
          ))}
          {priceRangeValue.map((item) => (
            <Selected
              label={item.title}
              onRemove={() => removeItemInFilterList(SEARCH_TYPE.priceRanges, item.query)}
              key={item.title}
            />
          ))}
          {priceValue && (
            <Selected
              label={priceValue}
              onRemove={() => {
                removeFilterSingleValue(SEARCH_TYPE.startPrice, SEARCH_TYPE.endPrice);
              }}
            />
          )}
          {listBikeBrandsSelected.map((item) => (
            <Selected
              label={item.name}
              onRemove={() => removeItemInFilterList(SEARCH_TYPE.brand, String(item.id))}
              key={item.id}
            />
          ))}
          {listFamilySelected?.map((item) => (
            <Selected
              label={familyParamsToFamilyName(item)}
              onRemove={() => removeItemInFilterList(SEARCH_TYPE.family, item)}
              key={item}
            />
          ))}
          {listModelSelected.map((item) => (
            <Selected
              label={item.name}
              onRemove={() => removeItemInFilterList(SEARCH_TYPE.model, String(item.id))}
              key={item.id}
            />
          ))}
          {suspension.map((item) => (
            <Selected label={item} onRemove={() => removeItemInFilterList(SEARCH_TYPE.suspension, item)} key={item} />
          ))}
          {gender.map((item) => (
            <Selected label={item} onRemove={() => removeItemInFilterList(SEARCH_TYPE.gender, item)} key={item} />
          ))}
          {condition.map((item) => (
            <Selected
              label={normalizeServerConstant(item)}
              onRemove={() => removeItemInFilterList(SEARCH_TYPE.condition, item)}
              key={item}
            />
          ))}
          {yearValue && (
            <Selected
              label={yearValue}
              onRemove={() => {
                removeFilterSingleValue(SEARCH_TYPE.startYear, SEARCH_TYPE.endYear);
              }}
            />
          )}
          {frameMaterialName.map((item) => (
            <Selected
              label={item}
              onRemove={() => removeItemInFilterList(SEARCH_TYPE.frameMaterialName, item)}
              key={item}
            />
          ))}
          {locationValue && (
            <Selected
              label={locationValue}
              onRemove={() => {
                removeFilterSingleValue(SEARCH_TYPE.location);
              }}
            />
          )}
          {brakeTypeName.map((item) => (
            <Selected
              label={item}
              onRemove={() => removeItemInFilterList(SEARCH_TYPE.brakeTypeName, item)}
              key={item}
            />
          ))}
          {brakeTypeName.map((item) => (
            <Selected
              label={item}
              onRemove={() => removeItemInFilterList(SEARCH_TYPE.brakeTypeName, item)}
              key={item}
            />
          ))}
          {storeName
            ?.filter((item) => !!item)
            ?.map((item) => (
              <Selected label={item} onRemove={() => removeItemInFilterList(SEARCH_TYPE.storeName, item)} key={item} />
            ))}
          {listingTypes.map((item) => (
            <Selected
              label={renderLabel(SEARCH_TYPE.listingTypes, item)}
              onRemove={() => removeItemInFilterList(SEARCH_TYPE.listingTypes, item)}
              key={item}
            />
          ))}
        </div>
      </Col>
      <Col xs={'auto'}>
        <div className={classes.buttonRemoveZone}>
          <Link scroll={false} shallow={true} replace={true} href={renderPathname}>
            <a onClick={onRestart} className={classes.buttonRemove}>
              Remove all filters
            </a>
          </Link>
        </div>
      </Col>
    </Row>
  );
};

export default SelectedFilter;
