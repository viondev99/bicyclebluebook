import { FC, useCallback, useEffect } from 'react';
import { useFormikContext } from 'formik';
import find from 'lodash/find';
import join from 'lodash/join';
import filter from 'lodash/filter';
import get from 'lodash/get';
import { toastError } from '../../../helpers/utils.helper';

interface Props {
  notifyType?: 'toast' | 'focus';
}

const FormikErrorNotifier: FC<Props> = ({ notifyType = 'focus' }) => {
  const formik = useFormikContext();
  const { isSubmitting, isValidating, errors } = formik;
  const getFistError = useCallback((object: any, current: string = ''): string => {
    const keys = Object.keys(object);
    if (keys.length > 0) {
      const key: any = find(keys, (item) => object[item]);
      const nextPath = join(filter([current, key]), '.');
      if (key && typeof object[key] === 'object') {
        return getFistError(object[key], nextPath);
      }
      return nextPath;
    }
    return current;
  }, []);
  useEffect(() => {
    if (isSubmitting && !isValidating) {
      const firstError = getFistError(errors);
      if (notifyType === 'focus') {
        const selector = `[name="${firstError}"]`;
        const errorElement: any = document.querySelector(selector);
        if (errorElement && typeof errorElement.focus === 'function') {
          errorElement.focus();
        }
      } else {
        toastError(get(errors, firstError));
      }
    }
  }, [errors, getFistError, isSubmitting, isValidating, notifyType]);
  return null;
};

export default FormikErrorNotifier;
