/* eslint-disable import/no-cycle */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-await-in-loop */
import CONFIG from 'config';
import numeral from 'numeral';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import isDate from 'lodash/isDate';
import isArray from 'lodash/isArray';
import isNil from 'lodash/isNil';
import { ConditionModel } from 'model/store/common.model';
import cloneDeep from 'lodash/cloneDeep';
import { SetCreateScorecardQuantityParams } from 'model/store/partner/scorecard-summary-standardquote.model';
import * as Socket from 'socket.io-client';
import { JwtDecodedToken } from 'model/api/authenticate.model';
import jwt_decode from 'jwt-decode';
import t from './language';
import { toastError } from './utils.helper';
import { CONDITION_NAME } from './constraint.helper';

export interface ItemIdName {
  id: number | string;
  name: string;
}

export interface ItemLabelValue {
  value: string;
  label: string;
}

export function isProduction() {
  return CONFIG.NAME === 'PRODUCTION';
}

export function isStaging() {
  return CONFIG.NAME === 'STAGING';
}

export const bicycleOutletId = isProduction()
  ? '61e89c7b1fa8f9008020e89f'
  : isStaging()
  ? '61e68debf5a2b00011df9194'
  : '61e51b3aa902ad00848cf4c5';

export const TREK_PARTNER_PARENT_ID = isProduction() ? '5d491a80fff8cc11494271b8' : '5d5ca963282a62290bf287d0';

export const FOUR_BIKE_BRAND_IN_FIRST = [
  { id: isProduction() ? 672 : isStaging() ? 672 : 1340, name: 'Cannondale' },
  { id: isProduction() ? 683 : isStaging() ? 683 : 683, name: 'Giant' },
  { id: isProduction() ? 741 : isStaging() ? 741 : 1222, name: 'Specialized' },
  { id: isProduction() ? 750 : isStaging() ? 750 : 1312, name: 'Trek' },
];

export const isPrivateSeller = (typeInventoryName: string = '', storefrontId: string = '') => {
  return typeInventoryName === 'PTP' && storefrontId === '';
};

export const convertLocation = (...location: string[]) => {
  const locationFilter = location.filter((item) => item && item.length !== 0);
  return locationFilter.join(', ');
};

export const sortFilterBrand = (listFilter: ItemIdName[], preventExtend?: boolean) => {
  if (listFilter.length === 0) {
    return listFilter.map((brand: ItemIdName) => {
      return {
        value: String(brand.id),
        label: brand.name,
      };
    });
  }
  const filterFourBikeFirst = listFilter.filter(
    (it: ItemIdName) => !FOUR_BIKE_BRAND_IN_FIRST.some((item: ItemIdName) => `${item.id}` === `${it.id}`),
  );
  if (preventExtend) {
    const listNoExtends = FOUR_BIKE_BRAND_IN_FIRST.filter((item) =>
      listFilter.some((it) => `${item.id}` === `${it.id}`),
    );
    return [...listNoExtends, ...filterFourBikeFirst].map((brand: ItemIdName) => {
      return {
        value: String(brand.id),
        label: brand.name,
      };
    });
  }
  return [...FOUR_BIKE_BRAND_IN_FIRST, ...filterFourBikeFirst].map((brand: ItemIdName) => {
    return {
      value: String(brand.id),
      label: brand.name,
    };
  });
};

export const BBBDirectId = isProduction()
  ? '5d31f4c5a508d3001354bea5'
  : isStaging()
  ? '5d38089415f5820012d32fca'
  : '5cc03729119c7b004c3afadb';

export function isStoreBike() {
  if (isProduction()) {
    return '61e89c7b1fa8f9008020e89f';
  }
  if (isStaging()) {
    return '61e68debf5a2b00011df9194';
  }
  return '61e51b3aa902ad00848cf4c5';
}

export const getUrlTracking = (trackingId: number | string) => {
  return `https://wwwapps.ups.com/tracking/tracking.cgi?tracknum=${trackingId}&requester=ST/`;
};

export const DefaultIconDeleteLink = 'https://i.imgur.com/XjCNKJL.png';

export function roundNumberLarge(n: number | string | undefined) {
  return numeral(n).format('0,0');
}

export function emailValidate(value: string) {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(value);
}

export function phoneValidate(value: string) {
  const regex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
  return regex.test(value);
}

export function isRolePartnerInstantPayout(role: string) {
  return ['user_administrator', 'user_manager'].indexOf(role) > -1;
}

export const exceptionKeyInputNumber: string[] = ['+', '-', 'ArrowDown'];
export const exceptionHasDotKeyInputNumber: string[] = ['+', '-', 'ArrowDown', '.', ','];

export const checkImageLink = (url: string) => {
  return (
    url.toLowerCase().includes('.jpeg') || url.toLowerCase().includes('.png') || url.toLowerCase().includes('.jpg')
  );
};

export const changeNameCondition = (name: string) => {
  switch (name) {
    case 'EXCELLENT':
      return 'Excellent';
    case 'VERY_GOOD':
      return 'Very Good';
    case 'GOOD':
      return 'Good';
    case 'POOR':
      return 'Poor';
    case 'FAIR':
      return 'Fair';
    default:
      return 'Excellent';
  }
};

const TradeInValueModifierPriceCalculationTable = [
  {
    minPrice: 500,
    maxPrice: 1000,
    Drivetrain: {
      up: 0.1,
      down: -0.1,
    },
    Wheels: {
      up: 0.1,
      down: -0.1,
    },
  },
  {
    minPrice: 1000,
    maxPrice: 2000,
    Drivetrain: {
      up: 0.1,
      down: -0.1,
    },
    Wheels: {
      up: 0.1,
      down: -0.1,
    },
  },
  {
    minPrice: 2000,
    maxPrice: 3500,
    Drivetrain: {
      up: 0.2,
      down: -0.2,
    },
    Wheels: {
      up: 0.2,
      down: -0.2,
    },
  },
  {
    minPrice: 3500,
    maxPrice: 5000,
    Drivetrain: {
      up: 0.2,
      down: -0.2,
    },
    Wheels: {
      up: 0.2,
      down: -0.2,
    },
  },
  {
    minPrice: 5000,
    maxPrice: 6500,
    Drivetrain: {
      up: 0.17,
      down: -0.17,
    },
    Wheels: {
      up: 0.17,
      down: -0.17,
    },
  },
  {
    minPrice: 6500,
    maxPrice: 8000,
    Drivetrain: {
      up: 0.15,
      down: -0.15,
    },
    Wheels: {
      up: 0.15,
      down: -0.15,
    },
  },
  {
    minPrice: 8000,
    maxPrice: 9000,
    Drivetrain: {
      up: 0.1,
      down: -0.1,
    },
    Wheels: {
      up: 0.1,
      down: -0.1,
    },
  },
  {
    minPrice: 9000,
    maxPrice: 99999999999,
    Drivetrain: {
      up: 0.08,
      down: -0.08,
    },
    Wheels: {
      up: 0.08,
      down: -0.08,
    },
  },
];

export function getTradeInPrice(
  value: number,
  wheels: string,
  driveTrain: string,
  clean: string,
  msrp: number,
  priceAdjustment: number = 0,
): string | number {
  const tradeInPriceModifierCalculation: any = TradeInValueModifierPriceCalculationTable.find(
    (item) => msrp > item.minPrice && msrp <= item.maxPrice,
  );
  // if (this.props.formik.values['Wheels'])
  let tradeInPrice = value;

  if (tradeInPriceModifierCalculation) {
    if (wheels) {
      tradeInPrice += value * tradeInPriceModifierCalculation.Wheels[wheels];
    }
    if (driveTrain) {
      tradeInPrice += value * tradeInPriceModifierCalculation.Drivetrain[driveTrain];
    }
  }
  if (clean === 'no') {
    tradeInPrice -= 25;
  }
  if (priceAdjustment) {
    tradeInPrice += priceAdjustment;
  }

  return tradeInPrice <= 0 ? 0 : Math.round(tradeInPrice);
}

export const upgradeComps = [
  { id: 1, name: 'Wheels', percentValue: 0.3, up: true },
  {
    id: 2,
    name: 'Drivetrain',
    percentValue: 0.25,
    up: true,
  },
  { id: 3, name: 'Wheels', percentValue: 0.3, up: false },
  {
    id: 4,
    name: 'Drivetrain',
    percentValue: 0.25,
    up: false,
  },
];

export const parseJwt = (token: string) => {
  try {
    return jwt_decode<JwtDecodedToken>(token);
  } catch (e) {
    return null;
  }
};

export function printContent(content: string) {
  const mywindow: any = window.open('', '_blank', 'width=1000,height=600');
  mywindow.document.write('<html><head><title>PrintLabel</title>');
  mywindow.document.write('</head><body>');
  mywindow.document.write(content);
  mywindow.document.write('</body></html>');

  mywindow.document.close(); // necessary for IE >= 10
  setTimeout(() => mywindow.focus(), 300);
  mywindow.focus(); // necessary for IE >= 10*/
  let calledPrint = false;
  mywindow.onafterprint = () => {
    calledPrint = true;
    setTimeout(() => mywindow.close(), 50);
  };
  const mediaQueryList = mywindow.matchMedia('print');
  mediaQueryList.addListener((mql: any) => {
    if (mql.matches) {
      calledPrint = true;
      mywindow.focus(); // necessary for IE >= 10*/
      // console.log('onbeforeprint equivalent');
      mywindow.addEventListener('focus', () => {
        setTimeout(() => mywindow.close(), 50);
      });
    }
  });
  const callPrint = () => {
    if (!calledPrint) {
      mywindow.print();
    }
  };
  callPrint();
  setTimeout(() => {
    // for mobile devices with delay on animation
    callPrint();
  }, 1000);
}

function loadImages(image: string | string[]) {
  return new Promise((resolve, reject) => {
    let lImage: Array<string> = [];
    if (!Array.isArray(image)) {
      lImage = [image];
    } else {
      lImage = image;
    }
    Promise.all(
      lImage.map(
        (link) =>
          new Promise((res, rej) => {
            const newImage = new Image();
            newImage.style.width = '400px';
            newImage.style.display = 'block';
            newImage.style.margin = 'auto';
            newImage.src = `${link}?a=${+new Date()}`;
            newImage.onload = () => {
              res(newImage);
            };
          }),
      ),
    ).then((res) => {
      resolve(res);
    });
  });
}

export function printImage(url: string | string[]) {
  const myWindow: any = window.open('', '_blank', 'width=1000,height=600');
  if (myWindow) {
    myWindow.document.write('<html><head><title>Print</title>');
    myWindow.document.write('</head><body>');
    myWindow.document.write('</body></html>');
    const body = myWindow.document.getElementsByTagName('body')[0];
    loadImages(url).then((res: any) => {
      res.forEach((i: any) => body.append(i));
      setTimeout(() => {
        myWindow.document.close(); // necessary for IE >= 10
        setTimeout(() => myWindow.focus(), 300);
        myWindow.focus(); // necessary for IE >= 10*/
        let calledPrint = false;
        myWindow.onafterprint = function () {
          calledPrint = true;
          setTimeout(() => myWindow.close(), 50);
        };
        const mediaQueryList = myWindow.matchMedia('print');
        mediaQueryList.addListener(function (mql: any) {
          if (mql.matches) {
            calledPrint = true;
            myWindow.focus(); // necessary for IE >= 10*/
            // console.log('onbeforeprint equivalent');
            myWindow.addEventListener('focus', () => {
              setTimeout(() => myWindow.close(), 50);
            });
          }
        });
        const callPrint = () => {
          if (!calledPrint) {
            myWindow.print();
          }
        };
        callPrint();
        setTimeout(() => {
          // for mobile devices with delay on animation
          callPrint();
        }, 1000);
      }, 500);
    });
  } else {
    toastError(t('common.showPopUp'), t('seoTitle.uhOh'));
  }
}

export type Options = {
  indices?: boolean;
  nullsAsUndefineds?: boolean;
};

const isBoolean = (value: any) => typeof value === 'boolean';

const isObject = (value: any) => value === Object(value);

const isBlob = (value: any) =>
  value && typeof value.size === 'number' && typeof value.type === 'string' && typeof value.slice === 'function';

const isFile = (value: any) =>
  isBlob(value) &&
  typeof value.name === 'string' &&
  (typeof value.lastModifiedDate === 'object' || typeof value.lastModified === 'number');

export const objectToFormData = (obj: any, config?: Options, formData?: FormData, pre?: any): FormData => {
  const cfg = config || {};

  cfg.indices = isUndefined(cfg.indices) ? false : cfg.indices;

  cfg.nullsAsUndefineds = isUndefined(cfg.nullsAsUndefineds) ? false : cfg.nullsAsUndefineds;

  const fd = formData || new FormData();

  if (isUndefined(obj)) {
    return fd;
  }
  if (isNull(obj)) {
    if (!cfg.nullsAsUndefineds) {
      fd.append(pre, '');
    }
  } else if (isBoolean(obj)) {
    fd.append(pre, obj);
  } else if (isArray(obj)) {
    if (obj.length) {
      obj.forEach((value, index) => {
        const key = `${pre}[${cfg.indices ? index : ''}]`;

        objectToFormData(value, cfg, fd, key);
      });
    }
  } else if (isDate(obj)) {
    fd.append(pre, obj.toISOString());
  } else if (isObject(obj) && !isFile(obj) && !isBlob(obj)) {
    Object.keys(obj).forEach((prop) => {
      const value = obj[prop];

      if (isArray(value)) {
        while (prop.length > 2 && prop.lastIndexOf('[]') === prop.length - 2) {
          // eslint-disable-next-line no-param-reassign
          prop = prop.substring(0, prop.length - 2);
        }
      }

      const key = pre ? `${pre}.${prop}` : prop;

      objectToFormData(value, cfg, fd, key);
    });
  } else {
    fd.append(pre, obj);
  }

  return fd;
};

export const checkTrekStore = (role: string, partner: string) => {
  if (
    (role === 'user_administrator' && partner === '5d5ca963282a62290bf287d0' && CONFIG.NAME !== 'PRODUCTION') ||
    (role === 'user_administrator' && partner === '5d491a80fff8cc11494271b8' && CONFIG.NAME === 'PRODUCTION')
  ) {
    return true;
  }
  return false;
};

export const exportXlsxFile = (data: any, fileName: string, withCols: object[]) => {
  import('xlsx').then((XLSX) => {
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    if (withCols) {
      ws['!cols'] = withCols;
    }
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  });
};

export function formatNumberLarge(num: number) {
  return numeral(num).format('0,0');
}

export function formatNumberLargeDecimal(num: number) {
  if (isNil(num)) {
    return null;
  }
  return numeral(num).format('0,0.00');
}

export const isDateData = (date: any) => {
  const dateRegex: RegExp = new RegExp(/^\d{2}\/\d{2}\/\d{4}$/);
  return dateRegex.test(date);
};

export const populateDataSort = (data: any) => {
  if (isDateData(data)) {
    return new Date(data);
  }
  if (typeof data !== 'number') {
    return String(data).toLowerCase().trim();
  }
  return data;
};

export const sortDataByFields = (data: any, orderBy: any, order: any) => {
  if (data && data.length > 0) {
    return data.sort((a: any, b: any) => {
      let prev = a[orderBy] ? a[orderBy] : '';
      let next = b[orderBy] ? b[orderBy] : '';
      prev = populateDataSort(prev);
      next = populateDataSort(next);
      if (prev < next) {
        return order === 'desc' ? 1 : -1;
      }
      if (prev > next) {
        return order === 'desc' ? -1 : 1;
      }
      return 0;
    });
  }
  return [];
};

function checkScriptExists(url: string) {
  return document.querySelectorAll(`script[src="${url}"]`).length > 0;
}

export const loadScriptAsync = (url: string) => {
  if (checkScriptExists(url)) {
    return;
  }
  return new Promise((resolve: any, reject: any) => {
    let s = null;
    s = document.createElement('script');
    s.src = url;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
};

export const DATA_RESET_CREATE_SCORECARD_QUANTITY: SetCreateScorecardQuantityParams = {
  createScorecardQuantity: 1,
  isOpenModalNumberScorecard: true,
  dataStepSummary: null,

  listDataStepStandardQuote: [],
  listDataStepCustomQuote: [],
  listDataStepEbikeQuote: [],
  indexScorecardSelected: 0,
  type: '',
};

export const formatPriorityConditionHasLikeNew = (conditions: ConditionModel[], hideLikeNew?: boolean) => {
  if (hideLikeNew) {
    return conditions;
  }

  const cloneConditions = conditions && Array.isArray(conditions) ? cloneDeep(conditions) : [];
  const findIndexConditons: number = cloneConditions.findIndex((it) => it.condition === CONDITION_NAME.LIKE_NEW);
  if (findIndexConditons === -1) {
    return cloneConditions;
  }

  const findIndexConditonsLikeNew = cloneConditions.findIndex((it) => it.condition === CONDITION_NAME.LIKE_NEW);
  const listConditionsNew = cloneConditions.slice(0, findIndexConditonsLikeNew);
  const arrItemLikeNew = [cloneConditions[findIndexConditonsLikeNew]];
  const result = [...arrItemLikeNew, ...listConditionsNew];
  return result;
};

export const checkBrowserIsSafari = () => {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('safari') !== -1) {
    if (ua.indexOf('chrome') > -1) {
      return false;
    }
    return true; // safari
  }
  return false;
};

export const checkExistLocalStorage = () => {
  return typeof window !== 'undefined';
};

export const connectSocketPayment = (userId: string, orderId?: string) => {
  const socketConnect = Socket.connect(`${CONFIG.BASE_URL}notification`, {
    transports: ['websocket'],
    path: '/billing/socket.io',
    query: {
      id: userId || orderId,
      type: userId ? 'user' : 'guest',
    },
    forceNew: true,
  });
  socketConnect.on('connect', () => {
    console.log('$ CONNECTED', socketConnect.id);
    if (userId) {
      socketConnect.emit('store_info', `u_${userId}`);
    }
    if (orderId) {
      socketConnect.emit('store_info', `g_${orderId}`);
    }
  });
  return socketConnect;
};

export const checkNotifcationIsPartner = () => {
  return checkExistLocalStorage() && localStorage.getItem('CHECK_ROLE_NOTIFICATION') === 'PARTNER';
};

export const kountConfigEnv = () => {
  return CONFIG.KOUNT;
};
