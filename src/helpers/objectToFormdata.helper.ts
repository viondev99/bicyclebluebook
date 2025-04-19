import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import isDate from 'lodash/isDate';
import isArray from 'lodash/isArray';

const isBoolean = (value: any) => typeof value === 'boolean';

const isObject = (value: any) => value === Object(value);

const isBlob = (value: any) =>
  value && typeof value.size === 'number' && typeof value.type === 'string' && typeof value.slice === 'function';

const isFile = (value: any) =>
  isBlob(value) &&
  typeof value.name === 'string' &&
  (typeof value.lastModifiedDate === 'object' || typeof value.lastModified === 'number');

export const objectToFormData = (obj: any, config?: Options, formData?: FormData, pre?: string): FormData => {
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

export type Options = {
  indices?: boolean;
  nullsAsUndefineds?: boolean;
};
