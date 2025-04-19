import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { brandAndFamilyToFamilyParam, ONLINE_STORE, separateArrayQueryToCommaArrayQuery } from 'helpers/string.helper';
import { useListStoreFronts } from 'hooks/useListStoreFronts';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import { useListCommonComponent } from '../../hooks/useListCommonComponent';
import { useToArray } from './useToArray';
import { SEARCH_TYPE } from '../../constants/marketplace';
import { useListFamily } from './useListFamily';
import useListModel, { FamilySelected } from './useListModel';
import { CommonComponents, ItemStoreFrontModel } from '../../model/store/common.model';

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
export default function useMarketplaceFilter() {
  const { query } = useRouter();
  const parsedQuery = useMemo(() => {
    // default next query is separate array, we need to convert to array comma query
    return separateArrayQueryToCommaArrayQuery(query);
  }, [query]);

  const listFilter = useListCommonComponent(components);
  const brand = useToArray(parsedQuery[SEARCH_TYPE.brand]);
  const sellType = useToArray(parsedQuery[SEARCH_TYPE.sellerType]).toString();
  const leftFilter = useSelector((state: StoreState) => state.marketplace.list.leftFilter);

  const checkConditionGetListStoreFront = useMemo(() => {
    if (sellType?.length > 0 && sellType.includes(ONLINE_STORE)) {
      return true;
    }
    if (
      leftFilter?.[SEARCH_TYPE.sellerType]?.length > 0 &&
      leftFilter?.[SEARCH_TYPE.sellerType].includes(ONLINE_STORE)
    ) {
      return true;
    }
    return false;
  }, [leftFilter, sellType]);

  const brands = useMemo(() => {
    if (leftFilter?.[SEARCH_TYPE.brand]?.length > 0) {
      return leftFilter?.[SEARCH_TYPE.brand];
    }
    return brand;
  }, [brand, leftFilter]);

  const listStoreFronts: ItemStoreFrontModel[] = useListStoreFronts(checkConditionGetListStoreFront);

  const storeName = useToArray(parsedQuery[SEARCH_TYPE.storeName]);
  const listingTypes = useToArray(parsedQuery[SEARCH_TYPE.listingTypes]);
  const sizeName = useToArray(parsedQuery[SEARCH_TYPE.sizeName]);
  const model = useToArray(parsedQuery[SEARCH_TYPE.model]);
  const typeName = useToArray(parsedQuery[SEARCH_TYPE.typeName]);
  const wheelSize = useToArray(parsedQuery[SEARCH_TYPE.wheelSize]);
  const family = useToArray(parsedQuery[SEARCH_TYPE.family]);

  const familys = useMemo(() => {
    if (leftFilter?.[SEARCH_TYPE.family]?.length > 0) {
      return leftFilter?.[SEARCH_TYPE.family];
    }
    return family;
  }, [family, leftFilter]);

  const suspension = useToArray(parsedQuery[SEARCH_TYPE.suspension]);
  const gender = useToArray(parsedQuery[SEARCH_TYPE.gender]);
  const condition = useToArray(parsedQuery[SEARCH_TYPE.condition]);
  const frameMaterialName = useToArray(parsedQuery[SEARCH_TYPE.frameMaterialName]);
  const brakeTypeName = useToArray(parsedQuery[SEARCH_TYPE.brakeTypeName]);
  const startPrice = parsedQuery[SEARCH_TYPE.startPrice] || '';
  const endPrice = parsedQuery[SEARCH_TYPE.endPrice] || '';
  const startYear = parsedQuery[SEARCH_TYPE.startYear] || '';
  const endYear = parsedQuery[SEARCH_TYPE.endYear] || '';
  const location = (parsedQuery[SEARCH_TYPE.location] || '').toString().split(',');
  const familyList = useListFamily(brands);
  const page = query[SEARCH_TYPE.page];
  const pageSize = query[SEARCH_TYPE.pageSize];
  const sort = query[SEARCH_TYPE.sort];
  const content = query[SEARCH_TYPE.content];
  const priceRanges = useToArray(query[SEARCH_TYPE.priceRanges]);
  const listFamilyModelSelected = useMemo<FamilySelected[]>(() => {
    return familyList
      .filter((i) => familys.includes(brandAndFamilyToFamilyParam(i.brandIds, i.familyName)))
      .map((i) => ({
        brandIds: i.brandIds,
        productFamily: i.familyName,
      }));
  }, [familyList, familys]);

  const modelList = useListModel(brands, listFamilyModelSelected);

  return {
    listStoreFronts,
    storeName,
    brand,
    sizeName,
    model,
    typeName,
    wheelSize,
    family,
    suspension,
    gender,
    condition,
    frameMaterialName,
    brakeTypeName,
    startPrice,
    endPrice,
    startYear,
    endYear,
    location,
    modelList,
    brandList: listFilter.allBrandBicycle,
    familyList,
    parsedQuery,
    sellType,
    listingTypes,
    listFilter,
    page,
    pageSize,
    sort,
    content,
    priceRanges,
  };
}
