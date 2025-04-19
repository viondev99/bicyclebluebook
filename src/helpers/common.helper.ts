import get from 'lodash/get';
import { NextRouter } from 'next/dist/next-server/lib/router/router';
import { PositionPartner } from 'model/store/dealer-locator';
import { AxiosError } from 'axios';
import * as ERROR from 'constants/error';
import t from 'helpers/language';
import jwt_decode from 'jwt-decode';
import { JwtDecodedToken } from 'model/api/authenticate.model';
// eslint-disable-next-line import/no-cycle
import { toastError } from './utils.helper';

type E = string | AxiosError;

export function getMessageFromError(error: E) {
  if (typeof error === 'string') {
    return error;
  }
  if (error.response) {
    return get(error, 'response.data.message', ERROR.COMMON);
  }
  return error.message || ERROR.COMMON;
}

export function invariant(condition: boolean, format: string, ...args: any[]) {
  let warning: any = function emptyFunction() {};
  if (process.env.NODE_ENV === 'development') {
    warning = function warningFunction() {
      if (format === undefined) {
        throw new Error(`'warning(condition, format, ...args)' requires a warning message argument`);
      }

      if (format.length < 10 || /^[s\W]*$/.test(format)) {
        throw new Error(
          `The warning format should be able to uniquely identify this warning. Please, use a more descriptive format than: ${format}`,
        );
      }

      if (format.indexOf('Failed Composite propType: ') === 0) {
        return; // Ignore CompositeComponent proptype check.
      }

      if (!condition) {
        const argIndex: number = 0;
        const message: string = `Warning: ${format.replace(/%s/g, () => args[argIndex + 1])}`;
        // eslint-disable-next-line no-console
        console.warn(message);
      }
    };
  }
  return warning();
}

export function shouldRedirectWhenLoginTo(path: string) {
  const PATH_NOT_REDIRECT = [/\/register/, '/', '/logout'];
  return !PATH_NOT_REDIRECT.find((i) => {
    if (i instanceof RegExp) {
      return i.test(path);
    }
    return path === i;
  });
}

export function getLoginLinkProps(router: NextRouter) {
  const redirectQuery = shouldRedirectWhenLoginTo(router.pathname)
    ? {
        redirectUrl: router.asPath,
      }
    : {};
  const loginLinkProps = {
    scroll: false,
    href: {
      pathname: router.pathname,
      query: {
        login: true,
        backOnClose: true,
        ...redirectQuery,
        ...router.query,
      },
    },
    as: '/login',
    shallow: true,
  };
  return loginLinkProps;
}

export function getLoginScreenLinkProps(router: NextRouter) {
  const redirectQuery = shouldRedirectWhenLoginTo(router.pathname)
    ? {
        redirectUrl: router.asPath,
      }
    : {};
  const loginLinkProps = {
    scroll: false,
    href: {
      pathname: '/login',
      query: {
        ...redirectQuery,
      },
    },
    as: '/login',
    shallow: true,
  };
  return loginLinkProps;
}
export function pxToRem(px: number) {
  return `${px / 16}rem`;
}

export function decodeToken(token: string) {
  try {
    return jwt_decode<JwtDecodedToken>(token);
  } catch (e) {
    return null;
  }
}

interface Data {
  [key: string]: any;
}

export function objectToFormData(data: Data) {
  const form = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value !== undefined) {
      form.append(key, value);
    }
  });
  return form;
}

export function consistentArray(value: string[] | string): string[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

export function objectToStringData(data: Data) {
  let form = '';
  Object.keys(data).forEach((key) => {
    const value = `${key}=${data[key]}&`;
    form += value;
  });
  return form;
}

export function findStringInString(a: string, b: string): boolean {
  const aTemp = a.trim().toUpperCase();
  const bTemp = b.trim().toUpperCase();
  return bTemp.includes(aTemp);
}

export function maxFileSizeUpload(size: number) {
  const max = 10485760 * 2; // < 20MB;
  return size < max;
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

export function printLabel(myWindow: any, url: string | string[]) {
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
        // eslint-disable-next-line no-param-reassign
        myWindow.onafterprint = function onAfterPrint() {
          calledPrint = true;
          setTimeout(() => myWindow.close(), 50);
        };
        const mediaQueryList = myWindow.matchMedia('print');
        mediaQueryList.addListener(function listener(mql: any) {
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

const rad = (x: number) => {
  return (x * Math.PI) / 180;
};

export function calculateDistance(p1: PositionPartner, p2: PositionPartner) {
  const R = 6378137; // Earth’s mean radius in meter
  const dLat = rad(p2.lat - p1.lat);
  const dLong = rad(p2.lng - p1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c) / 1609.344; // returns the distance in meter
}

export function isEndOfPage(currentPageSize: number, totalPage: number, totalItem: number, currentPage: number) {
  if (currentPageSize * (totalPage - 1) + 1 === totalItem && totalPage > 1 && currentPage !== 1) {
    return true;
  }
  return false;
}

export function addTag(tag: any) {
  const dataLayerName = 'dataLayer';
  if ((window as any)[dataLayerName]) {
    return (window as any)[dataLayerName].push(tag);
  }
  const snippet = `
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(${JSON.stringify(tag)})`;
  const script = document.createElement('script');
  script.innerHTML = snippet;
  document.head.appendChild(script);
}
