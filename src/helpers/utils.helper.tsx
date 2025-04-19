/* eslint-disable react/react-in-jsx-scope */
import { toast, ToastOptions } from 'react-toastify';
import get from 'lodash/get';
import icCheckedSuccessToastly from '../assets/img/common/icCheckedSuccessToastly.svg';
import icWariningErrorToastly from '../assets/img/common/icWariningErrorToastly.svg';
// eslint-disable-next-line import/no-cycle
import { getMessageFromError } from './common.helper';
import classes from './toastly.module.scss';

export const urlRegex: RegExp = new RegExp(
  `(?:^(?:(?:(?:[a-z]+:)?//)|www\.)(?:\S+(?::\S*)?@)?(?:localhost|(?:(?:[a-z\u00a1-\uffff0-9][-_]*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::[0-9]{2,5})?(?:[/?#][^\s"]*)?$)`,
  'i',
);

const optionsError = {
  type: toast.TYPE.ERROR,
  closeButton: null,
  autoClose: 3000,
  className: 'custom-toast',
  position: toast.POSITION.TOP_RIGHT,
} as ToastOptions;

const optionsSuccess = {
  type: toast.TYPE.SUCCESS,
  closeButton: null,
  autoClose: 3000,
  className: 'custom-toast',
  position: toast.POSITION.TOP_RIGHT,
} as ToastOptions;

const renderToastly = (message: any, messageTitle: string, type: string) => {
  const renderImage = (
    <img
      src={type === 'Success' ? icCheckedSuccessToastly : icWariningErrorToastly}
      alt="toastly-icon"
      className={classes.imgToastly}
    />
  );
  return (
    <div className={classes.wrapBodyToastly}>
      <div className={type === 'Success' ? classes.borderLeftSuccess : classes.borderLeftError} />
      <div className={type === 'Success' ? classes.wrapImageSuccess : classes.wrapImageError}>{renderImage}</div>
      <div className={classes.wrapContentToastly}>
        <div className={classes.title}>{messageTitle || type}</div>
        <div className={classes.text}>{message || ''}</div>
      </div>
    </div>
  );
};

function _toastError(error: any, messageTitle: string, type: string, duration?: number) {
  const options = duration ? { ...optionsError, autoClose: duration } : optionsError;
  if (typeof error === 'string') {
    // return toast(error, options);
    return toast(renderToastly(error, messageTitle, type), options);
  }
  if (typeof error?.message === 'string') {
    // return toast(error, options);
    return toast(renderToastly(error?.message, messageTitle, type), options);
  }
  if (error.response) {
    if (!(error.response.status === 401)) {
      return toast(get(error.response, 'data.message') || error.message, options);
    }
  } else if (error.request) {
    return toast('Network error', options);
  }

  return toast(error.message, options);
}

function _toastSuccess(success: any, messageTitle: string, type: string, duration?: number) {
  const options = duration ? { ...optionsSuccess, autoClose: duration } : optionsSuccess;
  if (typeof success === 'string') {
    // return toast(success, options);
    return toast(renderToastly(success, messageTitle, type), options);
  }
  if (success.response) {
    return toast(get(success.response, 'data.message') || success.message, options);
  }
  if (success.request) {
    return toast('Network error', options);
  }
  return toast(success.message, options);
}

class ToastInstance {
  toast: any = null;

  toastSuccess = (_message: any, messageTitle: string = '', duration: number = 3000) => {
    const message = getMessageFromError(_message);
    if (!toast.isActive(this.toast)) {
      this.toast = _toastSuccess(message, messageTitle, 'Success', duration);
    } else {
      toast.update(this.toast, {
        render: renderToastly(message, messageTitle, 'Success'),
        closeButton: null,
        autoClose: duration,
      });
    }
  };

  toastError = (_message: any, messageTitle: string = '', duration: number = 3000) => {
    const message = getMessageFromError(_message);
    if (!toast.isActive(this.toast)) {
      this.toast = _toastError(message, messageTitle, 'Invalid', duration);
    } else {
      toast.update(this.toast, {
        render: renderToastly(message, messageTitle, 'Invalid'),
        closeButton: null,
        autoClose: duration,
      });
    }
  };
}

const toastSuccessInstance = new ToastInstance();
const toastErrorInstance = new ToastInstance();

const { toastSuccess } = toastSuccessInstance;
const { toastError } = toastErrorInstance;

export { toastSuccess, toastError };
