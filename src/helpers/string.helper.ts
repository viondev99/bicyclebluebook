import numeral from 'numeral';
import isNil from 'lodash/isNil';
import startCase from 'lodash/startCase';
import camelCase from 'lodash/camelCase';
import qs from 'query-string';

import { Product, StageCart } from 'model/common';
import { StatusMarketListing } from 'constants/marketplace';
import { ReimbursementStatus } from 'constants/scorecard';

export function formatNumberDecimal(s: number | string) {
  if (isNil(s)) {
    return '';
  }
  return Number(numeral(s).format('0.00'));
}

export function formatCurrency(s: number | string, rounded: boolean = true): string {
  if (isNil(s)) {
    return '';
  }
  if (rounded) {
    return numeral(s).format('$0,0');
  }
  return numeral(s).format('$0,0[.]00');
}

export function formatCurrencyFixed(s: number | string, rounded: boolean = false): string {
  if (isNil(s)) {
    return '';
  }
  if (rounded) {
    return numeral(s).format('$0,0');
  }
  return numeral(s).format('$0,0.00');
}

export function formatNumber(s: number | string, rounded: boolean = true): string {
  if (isNil(s)) {
    return '';
  }
  if (rounded) {
    return numeral(s).format('0,0');
  }
  return numeral(s).format('0,0[.]00');
}

export function normalizeServerConstant(constant: string, separator: string = '_'): string {
  if (!constant) {
    return '';
  }
  return constant.split(separator).join(' ');
}

export function getStatusProduct(product: Partial<Product>): string {
  if (product.delete) {
    return 'Deleted';
  }
  if (product.stageCart === StageCart.InShoppingCart) {
    return 'In shopping cart';
  }
  if (product.status === StatusMarketListing.SOLD) {
    return 'Sold';
  }
  if (product.status === StatusMarketListing.SALE_PENDING) {
    return 'Sale pending';
  }
  if (product.status === StatusMarketListing.LISTED) {
    return 'For sale';
  }
  return normalizeServerConstant(product.status);
}

export function setStatusReimbursement(status: string): string {
  if (status === ReimbursementStatus.OPEN) {
    return 'Open';
  }
  if (status === ReimbursementStatus.DUE) {
    return 'Due';
  }
  if (status === ReimbursementStatus.PAID) {
    return 'Paid';
  }
  if (status === ReimbursementStatus.CANCELED) {
    return 'Canceled';
  }
  if (status === ReimbursementStatus.NON_COMPLIANT) {
    return 'Non Compliant';
  }
  return 'All Status';
}

interface Query {
  [key: string]: string | string[];
}

export function separateArrayQueryToCommaArrayQuery(query: Query): Query {
  return Object.keys(query).reduce((acc, current) => {
    const stringQuery = query[current].toString();
    return { ...acc, [current]: stringQuery ? stringQuery.split(',') : [] };
  }, {});
}

export function parseToCommaArrayQueryString(query: Query): string {
  return qs.stringify(query, {
    arrayFormat: 'comma',
    encode: false,
  });
}

export function familyParamsToFamilyName(param: string) {
  return param.split('__').pop();
}

export function brandAndFamilyToFamilyParam(brandIds: string[], familyName: string) {
  return `${brandIds.join('++')}__${familyName}`;
}

export function slugify(text: string) {
  if (text && text.length) {
    return text
      .replace(/[^-a-zA-Z0-9\s+]+/gi, '')
      .replace(/\s+/gi, '-')
      .toLowerCase();
  }
  return text;
}

export function slugifyId(title: string, id: string | number) {
  return [slugify(title), id].join('-');
}

export function getIdFromSlugified(url: string): number {
  return +url.split('-').pop();
}

export function capitalizeFirstLetter(str: string) {
  if (str) {
    const stringFirstLetter = str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
    return stringFirstLetter.replace(/_/g, ' ');
  }
  return null;
}

export function capitalizeEachFirstLetter(str: string) {
  const convertToArray = str.replace(/_/g, ' ').toLowerCase().split(' ');
  const result = convertToArray.map((val) => {
    return val.replace(val.charAt(0), val.charAt(0).toUpperCase());
  });

  return result.join(' ');
}

export function formatStatus(status: string) {
  return status ? startCase(camelCase(status)) : '';
}

export function formatConditions(condition: string) {
  let tranFormData = condition?.split(',');
  tranFormData = tranFormData?.map((data: string) => {
    return formatStatus(data);
  });
  return tranFormData?.join();
}

export function formatPercent(s: number | string): string {
  if (isNil(s)) {
    return '';
  }
  return numeral(s).format('$0,0');
}

export function formatNegativeNumber(s: number) {
  if (isNil(s)) {
    return 0;
  }
  const price = s.toString();
  if (price.indexOf('-') !== -1) {
    const split = price.substring(1);
    return `-${numeral(split).format('0,0.00')}`;
  }
  if (price.indexOf('-') === -1) {
    return `+${numeral(price).format('0,0.00')}`;
  }
}

export function formatNumberNotNegative(s: number) {
  if (isNil(s)) {
    return 0;
  }
  if (s === 0) {
    return 0;
  }
  const price = s.toString();
  if (price.indexOf('-') !== -1) {
    const split = price.substring(1);
    return numeral(split).format('0,0.00');
  }
  if (price.indexOf('-') === -1) {
    return numeral(price).format('0,0.00');
  }
}

export function formatMoney(s: number) {
  if (isNil(s)) {
    return '';
  }
  if (s === 0) {
    return 0;
  }
  const price = s.toString();
  return `${numeral(price).format('0,0.00')}`;
}

export function normalizeCurrency(currency: string) {
  const result = String(currency).replace(/,/g, '');
  return Number(result);
}

export function currentPathnameWithoutQuery(pathName: string) {
  const indexQuery = pathName.indexOf('?') > 0 ? pathName.indexOf('?') : 100;
  return pathName.slice(0, indexQuery);
}

export const HTMLTagOnString =
  ('<p>' && '</p>') ||
  ('<ul>' && '</ul>') ||
  ('<li>' && '</li>') ||
  ('<div>' && '</div>') ||
  ('<span>' && '</span>') ||
  ('<a>' && '</a>');

export const MAX_SIZE: number = 10;
export const BLOCK_MESSAGE = {
  STOREFRONT_REPORTED: 'storefront_reported',
  USER_REPORTED: 'user_reported',
  OTHER: 'other',
  STATUS_REPORTED: 'reported',
  STATUS_BLOCKED: 'blocked',
};

export const REASONTYPEOPTIONS: { value: string; label: string }[] = [
  {
    value: 'report_00',
    label: 'The buyer is demanding something that wasn’t offered in the original listing',
  },
  {
    value: 'report_01',
    label: 'You believe the buyer is making a false claim',
  },
  {
    value: 'report_02',
    label: 'You believe the buyer is missing the marketplace',
  },
  {
    value: 'report_03',
    label: 'The buyer is abusing the messaging system and repeatedly contacting you',
  },
  {
    value: 'report_04',
    label: 'The buyer is offering you more money for the item you have listed',
  },
  {
    value: 'report_05',
    label: 'You believe the buyer is a scammer',
  },
  { value: 'report_06', label: 'The buyer is harassing you' },
  { value: 'other', label: 'Other' },
];

export const URL_PDF_UPLOAD = 'https://bbb-v2-dev.s3.amazonaws.com/original/avatar/';

export const ONLINE_STORE = 'ONLINE_STORE';
export const BBB_STAFF = 'BBB';
export const PERSONAL = 'PERSONAL';

export const BICYCLE_OUTLET_LOGGED_INFO = {
  loggedStorefront: 'loggedStorefront',
  nameOnlineStore: 'name_online_store',
};
