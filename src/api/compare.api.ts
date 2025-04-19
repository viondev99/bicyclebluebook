import { Product } from '../model/common';
import { COMPARE_KEY } from '../constants/common';
import { getDetailMasterListing } from './marketplace.api';
import { checkExistLocalStorage } from 'helpers/utilities.helper';

export type CompareList = number[];
type Listener = (listCompare: CompareList) => void;

interface CompareStorage {
  listener: Listener[];
  getCompareList: () => CompareList;
  addCompare: (masterListingId: number) => CompareList;
  removeCompareList: (masterListingId: number) => CompareList;
  setStorage: (listCompare: CompareList) => void;
  onCompareListChange: (fn: Listener) => void;
  _triggerListener: () => void;
}

export const compareStorage: CompareStorage = {
  listener: [],
  getCompareList(): CompareList {
    const compareList = checkExistLocalStorage() ? localStorage?.getItem(COMPARE_KEY) : null;
    if (!compareList) {
      return [];
    }
    try {
      return JSON.parse(compareList) as CompareList;
    } catch (e) {
      if (checkExistLocalStorage()) {
        // eslint-disable-next-line no-unused-expressions
        localStorage?.setItem(COMPARE_KEY, JSON.stringify([]));
      }

      return [];
    }
  },
  addCompare(masterListingId: number): CompareList {
    if (masterListingId) {
      const currentCompareList = this.getCompareList();
      const newList = [...currentCompareList, masterListingId];
      this.setStorage(newList);
      this._triggerListener();
      return newList;
    }
  },
  removeCompareList(masterListingId: number): CompareList {
    const currentCompareList = this.getCompareList();
    const newCompareList = currentCompareList.filter((item: number) => item !== masterListingId);
    this.setStorage(newCompareList);
    this._triggerListener();
    return newCompareList;
  },
  _triggerListener() {
    this.listener.forEach((a: Listener) => a(this.getCompareList()));
  },
  setStorage(list: CompareList) {
    localStorage?.setItem(COMPARE_KEY, JSON.stringify(list));
  },
  onCompareListChange(fn: Listener) {
    this.listener.push(fn);
    return () => {
      this.listener = this.listener.filter((a: Listener) => a !== fn);
    };
  },
};

function getListProduct(ids: number[]) {
  return Promise.all(
    ids.map((id) => {
      return new Promise((resolve) => {
        getDetailMasterListing(id)
          .then(resolve)
          .catch(() => resolve(null)); // resolve null when masterlisting not found
      });
    }),
  );
}

export function addToCompareList(masterListing: number) {
  const idList = compareStorage.getCompareList();
  if (idList.length >= 6) {
    throw new Error('TOO MANY BIKES SELECTED. Sorry, but only 6 bikes can be compared at once');
  }
  if (idList.includes(masterListing)) {
    throw new Error('Item is already in compare list');
  }
  return compareStorage.addCompare(masterListing);
}

export async function getCompareList() {
  const idList = compareStorage.getCompareList();
  const listCompareDetail = await getListProduct(idList);

  // Remove all id from storage when product return from getListProduct is null
  const newIdList = idList.filter((i) => {
    // filter all id not exist on getListProduct result
    return listCompareDetail.find((detail: Partial<Product> | null) => detail && detail.masterListingId === +i);
  });
  compareStorage.setStorage(newIdList);
  return listCompareDetail.filter((i) => i);
}

export function removeFromCompare(masterListingId: number) {
  compareStorage.removeCompareList(masterListingId);
  // return getListProduct(idList);
}
